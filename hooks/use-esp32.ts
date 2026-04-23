"use client"

import { useState, useCallback, useRef } from "react"

// Web Serial API types
declare global {
  interface Navigator {
    serial: SerialManager
  }
}

interface SerialManager {
  requestPort(): Promise<SerialPort>
  getPorts(): Promise<SerialPort[]>
}

interface SerialPort {
  open(options: SerialOptions): Promise<void>
  close(): Promise<void>
  getInfo(): SerialPortInfo
  readable: ReadableStream<Uint8Array> | null
  writable: WritableStream<Uint8Array> | null
  onconnect?: () => void
  ondisconnect?: () => void
}

interface SerialOptions {
  baudRate: number
  dataBits?: number
  stopBits?: number
  parity?: string
  bufferSize?: number
  rtscts?: boolean
  xonxoff?: boolean
}

interface SerialPortInfo {
  usbProductId?: number
  usbVendorId?: number
  name?: string
}

export interface ESP32State {
  isConnected: boolean
  isConnecting: boolean
  portName: string | null
  error: string | null
}

export function useESP32() {
  const [state, setState] = useState<ESP32State>({
    isConnected: false,
    isConnecting: false,
    portName: null,
    error: null,
  })

  const portRef = useRef<SerialPort | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null | undefined>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const connect = useCallback(async () => {
    // Check if Web Serial API is available
    if (!navigator.serial) {
      setState((prev) => ({
        ...prev,
        error: "Web Serial API is not supported. Please use Chrome, Edge, or Opera browser.",
      }))
      return false
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Request serial port from user
      const port = await navigator.serial.requestPort()
      
      if (!port) {
        throw new Error("No port selected")
      }

      portRef.current = port

      // Open the port with standard serial parameters
      await port.open({
        baudRate: 115200, // Standard baud rate for ESP-32
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      })

      // Start reading from the port
      abortControllerRef.current = new AbortController()
      
      // Handle incoming data from ESP-32
      if (port.readable) {
        const reader = port.readable.getReader()
        readerRef.current = reader

        // Read incoming messages in the background
        const readLoop = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              // Process incoming data from ESP-32
              const decoder = new TextDecoder()
              const message = decoder.decode(value)
              console.log("ESP-32 says:", message)
            }
          } catch (err: unknown) {
            const error = err as Error
            if (error.name !== "AbortError") {
              console.error("Error reading from serial:", error)
            }
          }
        }

        readLoop()
      }

      // Get port info for display name
      const portInfo = port.getInfo()
      const displayName: string = `ESP-32 (COM${portInfo.name?.split("COM")?.[1] || "?"})`

      setState({
        isConnected: true,
        isConnecting: false,
        portName: displayName || "ESP-32",
        error: null,
      })

      return true
    } catch (error) {
      let errorMessage = "Connection failed"
      
      if (error instanceof Error) {
        errorMessage = error.message

        // Provide helpful error messages
        if (errorMessage.includes("cancelled") || errorMessage.includes("NotFoundError")) {
          errorMessage = null // Don't show error if user cancelled
        } else if (errorMessage.includes("not selected")) {
          errorMessage = "No port selected. Please select an ESP-32 device."
        } else if (errorMessage.includes("NetworkError") || errorMessage.includes("already open")) {
          errorMessage = "Port is already in use. Close other applications using this port."
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
    if (readerRef.current) {
      readerRef.current.cancel()
      readerRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (portRef.current) {
      portRef.current.close().catch((err) => {
        console.error("Error closing port:", err)
      })
      portRef.current = null
    }

    setState({
      isConnected: false,
      isConnecting: false,
      portName: null,
      error: null,
    })
  }, [])

  const ringBell = useCallback(async (duration: number = 3) => {
    if (!portRef.current?.writable) {
      return false
    }

    try {
      // Send command to ESP-32 to ring bell
      // Format: "RING:duration\n" where duration is in seconds
      const encoder = new TextEncoder()
      const writer = portRef.current.writable.getWriter()
      const command = `RING:${duration}\n`
      await writer.write(encoder.encode(command))
      writer.releaseLock()
      return true
    } catch (error) {
      console.error("Failed to send ring command:", error)
      return false
    }
  }, [])

  const sendCommand = useCallback(async (command: string) => {
    if (!portRef.current?.writable) return false

    try {
      const encoder = new TextEncoder()
      const writer = portRef.current.writable.getWriter()
      await writer.write(encoder.encode(command + "\n"))
      writer.releaseLock()
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
