"use client"

import { useState, useCallback, useMemo } from "react"
import { Header } from "@/components/header"
import { ClockDisplay } from "@/components/clock-display"
import { ScheduleList } from "@/components/schedule-list"
import { BellEditor } from "@/components/bell-editor"
import { TodaysBells } from "@/components/todays-bells"
import { ESP32Info } from "@/components/esp32-info"
import { SettingsDialog } from "@/components/settings-dialog"
import { BellAlert } from "@/components/bell-alert"
import { useSchoolBellStore } from "@/hooks/use-school-bell-store"
import { useESP32 } from "@/hooks/use-esp32"
import type { BellEvent } from "@/lib/types"

export default function SchoolBellApp() {
  const {
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
  } = useSchoolBellStore()

  const esp32 = useESP32()

  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [ringingBell, setRingingBell] = useState<BellEvent | null>(null)

  const activeSchedule = getActiveSchedule()
  const selectedSchedule = useMemo(() => {
    if (!selectedScheduleId) return activeSchedule
    return schedules.find((s) => s.id === selectedScheduleId) || activeSchedule
  }, [selectedScheduleId, schedules, activeSchedule])

  // Get today's bells based on day of week
  const todaysBells = useMemo(() => {
    if (!activeSchedule) return []
    const today = new Date().getDay()
    if (!activeSchedule.days.includes(today)) return []
    return activeSchedule.bells.filter((b) => b.enabled)
  }, [activeSchedule])

  // Calculate next bell
  const nextBell = useMemo(() => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)

    const upcomingBells = todaysBells
      .filter((b) => b.time > currentTime)
      .sort((a, b) => a.time.localeCompare(b.time))

    return upcomingBells[0] || null
  }, [todaysBells])

  const handleBellTrigger = useCallback(
    async (bell: BellEvent) => {
      setRingingBell(bell)

      // Send command to ESP-32 if connected
      if (esp32.isConnected) {
        await esp32.ringBell(bell.duration)
      }
    },
    [esp32]
  )

  const handleTestBell = useCallback(
    async (duration: number) => {
      const testBell: BellEvent = {
        id: "test",
        name: "Test Bell",
        time: new Date().toTimeString().slice(0, 5),
        duration,
        enabled: true,
      }
      setRingingBell(testBell)

      if (esp32.isConnected) {
        await esp32.ringBell(duration)
      }
    },
    [esp32]
  )

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        schoolName={settings.schoolName}
        isConnected={esp32.isConnected}
        deviceName={esp32.portName}
        onConnect={esp32.connect}
        onDisconnect={esp32.disconnect}
        onSettingsClick={() => setSettingsOpen(true)}
        isConnecting={esp32.isConnecting}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Clock & Today's Schedule */}
          <div className="space-y-6">
            <ClockDisplay
              nextBell={nextBell}
              onBellTrigger={handleBellTrigger}
              bells={todaysBells}
            />
            <TodaysBells bells={todaysBells} />
          </div>

          {/* Middle Column - Bell Editor */}
          <div className="lg:col-span-1">
            <BellEditor
              schedule={selectedSchedule}
              onAddBell={addBellToSchedule}
              onUpdateBell={updateBellInSchedule}
              onDeleteBell={deleteBellFromSchedule}
              onReorderBells={reorderBellsInSchedule}
              onTestBell={handleTestBell}
            />
          </div>

          {/* Right Column - Schedules & Micro:bit */}
          <div className="space-y-6">
            <ScheduleList
              schedules={schedules}
              onAddSchedule={addSchedule}
              onUpdateSchedule={updateSchedule}
              onDeleteSchedule={deleteSchedule}
              onSelectSchedule={setSelectedScheduleId}
              onSetActive={setActiveSchedule}
            />
            <ESP32Info
              isConnected={esp32.isConnected}
              portName={esp32.portName}
              onConnect={esp32.connect}
              isConnecting={esp32.isConnecting}
              error={esp32.error}
            />
          </div>
        </div>
      </main>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <BellAlert
        bell={ringingBell}
        onDismiss={() => setRingingBell(null)}
        isConnectedToMicrobit={esp32.isConnected}
      />
    </div>
  )
}
