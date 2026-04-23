export interface BellEvent {
  id: string
  name: string
  time: string // HH:mm format
  duration: number // seconds
  enabled: boolean
}

export interface Schedule {
  id: string
  name: string
  description: string
  bells: BellEvent[]
  isActive: boolean
  days: number[] // 0-6 (Sunday-Saturday)
}

export interface SchoolSettings {
  schoolName: string
  startTime: string
  endTime: string
  periodDuration: number // minutes
  breakDuration: number // minutes
}

export interface ESP32Connection {
  isConnected: boolean
  portName: string | null
  batteryLevel: number | null
}
