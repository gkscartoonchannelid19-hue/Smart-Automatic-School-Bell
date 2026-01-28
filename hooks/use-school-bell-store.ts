"use client"

import { useState, useEffect, useCallback } from "react"
import type { Schedule, SchoolSettings, BellEvent } from "@/lib/types"
import { supabase } from "@/lib/supabase-client"

const STORAGE_KEY = "schoolbell-data"

// Supabase single-row state (so all devices share the same data)
const SUPABASE_TABLE = "school_bell_state"
const SUPABASE_STATE_ID = "default"

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

  // Initial load: prefer Supabase, fall back to localStorage / defaults
  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      try {
        // 1. Try Supabase if configured
        if (supabase) {
          const { data, error } = await supabase
            .from(SUPABASE_TABLE)
            .select("data")
            .eq("id", SUPABASE_STATE_ID)
            .maybeSingle()

          if (error) {
            // eslint-disable-next-line no-console
            console.error("[Supabase] load error:", error.message)
          }

          if (!isCancelled && data?.data) {
            const storeData = data.data as StoreData
            setSchedules(storeData.schedules)
            setSettings(storeData.settings)
            setIsLoaded(true)
            return
          }
        }

        // 2. Fallback: localStorage
        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
          if (stored) {
            const parsed: StoreData = JSON.parse(stored)
            if (!isCancelled) {
              setSchedules(parsed.schedules)
              setSettings(parsed.settings)
              setIsLoaded(true)
              return
            }
          }
        } catch {
          // eslint-disable-next-line no-console
          console.error("Failed to load data from localStorage")
        }

        // 3. Defaults
        if (!isCancelled) {
          setSchedules([defaultSchedule])
          setSettings(defaultSettings)
          setIsLoaded(true)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load initial data:", err)
        if (!isCancelled) {
          setIsLoaded(true)
        }
      }
    }

    load()

    return () => {
      isCancelled = true
    }
  }, [])

  // Save to Supabase + localStorage on changes
  useEffect(() => {
    if (!isLoaded) return

    const data: StoreData = { schedules, settings }

    // Local cache (works even without Supabase)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    } catch {
      // ignore
    }

    // Persist to Supabase if configured
    const saveToSupabase = async () => {
      if (!supabase) return
      try {
        const { error } = await supabase.from(SUPABASE_TABLE).upsert(
          {
            id: SUPABASE_STATE_ID,
            data,
          },
          { onConflict: "id" }
        )

        if (error) {
          // eslint-disable-next-line no-console
          console.error("[Supabase] save error:", error.message)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[Supabase] unexpected save error:", err)
      }
    }

    void saveToSupabase()
  }, [schedules, settings, isLoaded])

  // Realtime updates: listen for changes from other clients and update state
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel("school-bell-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: SUPABASE_TABLE,
          filter: `id=eq.${SUPABASE_STATE_ID}`,
        },
        (payload) => {
          const newData = (payload.new as { data?: StoreData } | null)?.data
          if (!newData) return

          setSchedules((prev) => {
            // Avoid unnecessary re-renders if data is effectively the same
            try {
              if (JSON.stringify(prev) === JSON.stringify(newData.schedules)) {
                return prev
              }
            } catch {
              // ignore stringify errors
            }
            return newData.schedules
          })

          setSettings((prev) => {
            try {
              if (JSON.stringify(prev) === JSON.stringify(newData.settings)) {
                return prev
              }
            } catch {
              // ignore stringify errors
            }
            return newData.settings
          })
        }
      )
      .subscribe()

    return () => {
      void channel.unsubscribe()
    }
  }, [])

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

  const reorderBellsInSchedule = useCallback(
    (scheduleId: string, fromIndex: number, toIndex: number) => {
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id !== scheduleId) return s
          const newBells = [...s.bells]
          const [moved] = newBells.splice(fromIndex, 1)
          // Clamp target index into range after removal
          const targetIndex = Math.max(0, Math.min(newBells.length, toIndex))
          newBells.splice(targetIndex, 0, moved)
          return { ...s, bells: newBells }
        })
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
    reorderBellsInSchedule,
    getActiveSchedule,
  }
}
