"use client"

import { useState, useCallback, useRef } from "react"

// BBC Micro:bit Bluetooth UUIDs
const MICROBIT_UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
const MICROBIT_UART_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
const MICROBIT_UART_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

export interface MicrobitState {
  isConnected: boolean
  isConnecting: boolean
  deviceName: string | null
  error: string | null
}

export function useMicrobit() {
  const [state, setState] = useState<MicrobitState>({
    isConnected: false,
    isConnecting: false,
    deviceName: null,
    error: null,
  })

  const deviceRef = useRef<BluetoothDevice | null>(null)
  const txCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)

  const connect = useCallback(async () => {
    // Check if Web Bluetooth is available
    if (!navigator.bluetooth) {
      setState((prev) => ({
        ...prev,
        error: "Web Bluetooth is not supported. Please use Chrome or Edge browser.",
      }))
      return false
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Request device - try multiple filter options
      let device: BluetoothDevice | null = null
      
      try {
        // First try with name prefix filter
        device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: "BBC micro:bit" }],
          optionalServices: [MICROBIT_UART_SERVICE],
        })
      } catch (err) {
        // If that fails, try with services filter
        try {
          device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [MICROBIT_UART_SERVICE] }],
            optionalServices: [MICROBIT_UART_SERVICE],
          })
        } catch (err2) {
          throw new Error("Could not find Micro:bit. Make sure it's powered on and Bluetooth is enabled.")
        }
      }

      if (!device) {
        throw new Error("No device selected")
      }

      deviceRef.current = device

      // Handle disconnection
      device.addEventListener("gattserverdisconnected", () => {
        setState({
          isConnected: false,
          isConnecting: false,
          deviceName: null,
          error: "Micro:bit disconnected",
        })
        txCharRef.current = null
      })

      // Connect to GATT server
      if (!device.gatt) {
        throw new Error("GATT server not available. Make sure Micro:bit is powered on.")
      }

      const server = await device.gatt.connect()
      if (!server) {
        throw new Error("Failed to connect to GATT server")
      }

      // Get the UART service
      let service: BluetoothRemoteGATTService
      try {
        service = await server.getPrimaryService(MICROBIT_UART_SERVICE)
      } catch (err) {
        throw new Error("UART service not found. Make sure the correct code is flashed to your Micro:bit.")
      }

      // Get TX characteristic for sending commands
      let txChar: BluetoothRemoteGATTCharacteristic
      try {
        txChar = await service.getCharacteristic(MICROBIT_UART_TX)
      } catch (err) {
        throw new Error("TX characteristic not found. Check Micro:bit code.")
      }
      txCharRef.current = txChar

      // Subscribe to RX characteristic for receiving messages
      try {
        const rxChar = await service.getCharacteristic(MICROBIT_UART_RX)
        await rxChar.startNotifications()
        rxChar.addEventListener("characteristicvaluechanged", (event) => {
          const value = (event.target as BluetoothRemoteGATTCharacteristic).value
          if (value) {
            const decoder = new TextDecoder()
            const message = decoder.decode(value)
            console.log("Micro:bit says:", message)
          }
        })
      } catch (err) {
        console.warn("Could not start RX notifications:", err)
        // This is not critical, we can still send commands
      }

      setState({
        isConnected: true,
        isConnecting: false,
        deviceName: device.name || "BBC micro:bit",
        error: null,
      })

      return true
    } catch (error) {
      let errorMessage = "Connection failed"
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Provide helpful error messages
        if (errorMessage.includes("cancelled") || errorMessage.includes("User cancelled")) {
          errorMessage = null // Don't show error if user cancelled
        } else if (errorMessage.includes("not found") || errorMessage.includes("not available")) {
          errorMessage = "Micro:bit not found. Make sure:\n1. Micro:bit is powered on\n2. Bluetooth is enabled on your computer\n3. The correct code is flashed to Micro:bit"
        } else if (errorMessage.includes("GATT") || errorMessage.includes("service")) {
          errorMessage = "Could not connect to Micro:bit services. Make sure the MicroPython code is correctly flashed."
        }
      }

      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }))
      return false
    }
  }, [])

  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect()
    }
    deviceRef.current = null
    txCharRef.current = null
    setState({
      isConnected: false,
      isConnecting: false,
      deviceName: null,
      error: null,
    })
  }, [])

  const ringBell = useCallback(async (duration: number = 3) => {
    if (!txCharRef.current) {
      // If not connected, play audio bell instead
      return false
    }

    try {
      // Send command to Micro:bit to ring bell
      // Format: "RING:duration" where duration is in seconds
      const encoder = new TextEncoder()
      const command = `RING:${duration}\n`
      await txCharRef.current.writeValue(encoder.encode(command))
      return true
    } catch (error) {
      console.error("Failed to send ring command:", error)
      return false
    }
  }, [])

  const sendCommand = useCallback(async (command: string) => {
    if (!txCharRef.current) return false

    try {
      const encoder = new TextEncoder()
      await txCharRef.current.writeValue(encoder.encode(command + "\n"))
      return true
    } catch (error) {
      console.error("Failed to send command:", error)
      return false
    }
  }, [])

  return {
    ...state,
    connect,
    disconnect,
    ringBell,
    sendCommand,
  }
}
