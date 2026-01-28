"use client"

import { useState, useEffect, useCallback } from "react"
import type { Schedule, SchoolSettings, BellEvent } from "@/lib/types"

const STORAGE_KEY = "schoolbell-data"

interface StoreData {
  schedules: Schedule[]
  settings: SchoolSettings
}

const defaultSettings: SchoolSettings = {
  schoolName: "My School",
  startTime: "08:00",
  endTime: "15:00",
  periodDuration: 45,
  breakDuration: 10,
}

const defaultSchedule: Schedule = {
  id: "default",
  name: "Regular Day",
  description: "Standard school day schedule",
  isActive: true,
  days: [1, 2, 3, 4, 5],
  bells: [
    { id: "1", name: "School Start", time: "08:00", duration: 5, enabled: true },
    { id: "2", name: "Period 1 End", time: "08:45", duration: 3, enabled: true },
    { id: "3", name: "Period 2 End", time: "09:30", duration: 3, enabled: true },
    { id: "4", name: "Break Start", time: "09:30", duration: 5, enabled: true },
    { id: "5", name: "Break End", time: "09:45", duration: 5, enabled: true },
    { id: "6", name: "Period 3 End", time: "10:30", duration: 3, enabled: true },
    { id: "7", name: "Period 4 End", time: "11:15", duration: 3, enabled: true },
    { id: "8", name: "Lunch Start", time: "11:15", duration: 5, enabled: true },
    { id: "9", name: "Lunch End", time: "12:00", duration: 5, enabled: true },
    { id: "10", name: "Period 5 End", time: "12:45", duration: 3, enabled: true },
    { id: "11", name: "Period 6 End", time: "13:30", duration: 3, enabled: true },
    { id: "12", name: "Period 7 End", time: "14:15", duration: 3, enabled: true },
    { id: "13", name: "School End", time: "15:00", duration: 5, enabled: true },
  ],
}

export function useSchoolBellStore() {
  const [schedules, setSchedules] = useState<Schedule[]>([defaultSchedule])
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: StoreData = JSON.parse(stored)
        setSchedules(data.schedules)
        setSettings(data.settings)
      }
    } catch {
      console.error("Failed to load data from localStorage")
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      const data: StoreData = { schedules, settings }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [schedules, settings, isLoaded])

  const updateSettings = useCallback((newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  const addSchedule = useCallback((schedule: Schedule) => {
    setSchedules((prev) => [...prev, schedule])
  }, [])

  const updateSchedule = useCallback((id: string, updates: Partial<Schedule>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }, [])

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const setActiveSchedule = useCallback((id: string) => {
    setSchedules((prev) =>
      prev.map((s) => ({ ...s, isActive: s.id === id }))
    )
  }, [])

  const addBellToSchedule = useCallback((scheduleId: string, bell: BellEvent) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId ? { ...s, bells: [...s.bells, bell] } : s
      )
    )
  }, [])

  const updateBellInSchedule = useCallback(
    (scheduleId: string, bellId: string, updates: Partial<BellEvent>) => {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId
            ? {
                ...s,
                bells: s.bells.map((b) =>
                  b.id === bellId ? { ...b, ...updates } : b
                ),
              }
            : s
        )
      )
    },
    []
  )

  const deleteBellFromSchedule = useCallback(
    (scheduleId: string, bellId: string) => {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId
            ? { ...s, bells: s.bells.filter((b) => b.id !== bellId) }
            : s
        )
      )
    },
    []
  )

  const getActiveSchedule = useCallback(() => {
    return schedules.find((s) => s.isActive) || schedules[0]
  }, [schedules])

  return {
    schedules,
    settings,
    isLoaded,
    updateSettings,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    setActiveSchedule,
    addBellToSchedule,
    updateBellInSchedule,
    deleteBellFromSchedule,
    getActiveSchedule,
  }
}
