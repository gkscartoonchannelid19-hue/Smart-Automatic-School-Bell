"use client"

import { useState, useCallback, useMemo } from "react"
import { Header } from "@/components/header"
import { ClockDisplay } from "@/components/clock-display"
import { ScheduleList } from "@/components/schedule-list"
import { BellEditor } from "@/components/bell-editor"
import { TodaysBells } from "@/components/todays-bells"
import { MicrobitInfo } from "@/components/microbit-info"
import { SettingsDialog } from "@/components/settings-dialog"
import { BellAlert } from "@/components/bell-alert"
import { useSchoolBellStore } from "@/hooks/use-school-bell-store"
import { useMicrobit } from "@/hooks/use-microbit"
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

  const microbit = useMicrobit()

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

      // Send command to Micro:bit if connected
      if (microbit.isConnected) {
        await microbit.ringBell(bell.duration)
      }
    },
    [microbit]
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

      if (microbit.isConnected) {
        await microbit.ringBell(duration)
      }
    },
    [microbit]
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
        isConnected={microbit.isConnected}
        deviceName={microbit.deviceName}
        onConnect={microbit.connect}
        onDisconnect={microbit.disconnect}
        onSettingsClick={() => setSettingsOpen(true)}
        isConnecting={microbit.isConnecting}
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
            <MicrobitInfo
              isConnected={microbit.isConnected}
              deviceName={microbit.deviceName}
              onConnect={microbit.connect}
              isConnecting={microbit.isConnecting}
              error={microbit.error}
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
        isConnectedToMicrobit={microbit.isConnected}
      />
    </div>
  )
}
