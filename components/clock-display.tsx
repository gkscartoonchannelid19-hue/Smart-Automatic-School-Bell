"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { BellEvent } from "@/lib/types"

interface ClockDisplayProps {
  nextBell: BellEvent | null
  onBellTrigger: (bell: BellEvent) => void
  bells: BellEvent[]
}

export function ClockDisplay({ nextBell, onBellTrigger, bells }: ClockDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [triggeredBells, setTriggeredBells] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Check if any bell should be triggered
      const currentTimeStr = now.toTimeString().slice(0, 5)
      
      bells.forEach((bell) => {
        if (
          bell.enabled &&
          bell.time === currentTimeStr &&
          !triggeredBells.has(`${bell.id}-${currentTimeStr}`)
        ) {
          onBellTrigger(bell)
          setTriggeredBells((prev) => new Set([...prev, `${bell.id}-${currentTimeStr}`]))
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [bells, onBellTrigger, triggeredBells])

  // Reset triggered bells at midnight
  useEffect(() => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const timeUntilMidnight = midnight.getTime() - now.getTime()

    const timeout = setTimeout(() => {
      setTriggeredBells(new Set())
    }, timeUntilMidnight)

    return () => clearTimeout(timeout)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeUntilNextBell = () => {
    if (!nextBell) return null

    const [hours, minutes] = nextBell.time.split(":").map(Number)
    const bellTime = new Date()
    bellTime.setHours(hours, minutes, 0, 0)

    const diff = bellTime.getTime() - currentTime.getTime()
    if (diff < 0) return null

    const diffMinutes = Math.floor(diff / 60000)
    const diffSeconds = Math.floor((diff % 60000) / 1000)

    if (diffMinutes > 60) {
      const diffHours = Math.floor(diffMinutes / 60)
      const remainingMinutes = diffMinutes % 60
      return `${diffHours}h ${remainingMinutes}m`
    }

    return `${diffMinutes}m ${diffSeconds}s`
  }

  const timeUntilNext = getTimeUntilNextBell()

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-8 text-primary-foreground">
          <p className="text-sm font-medium opacity-90">{formatDate(currentTime)}</p>
          <p className="mt-2 font-mono text-5xl font-bold tracking-tight">
            {formatTime(currentTime)}
          </p>
        </div>

        {nextBell && (
          <div className="border-t border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Bell</p>
                <p className="text-lg font-semibold text-foreground">{nextBell.name}</p>
                <p className="text-sm text-muted-foreground">at {nextBell.time}</p>
              </div>
              {timeUntilNext && (
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Time Left</p>
                  <p className="text-2xl font-bold text-primary">{timeUntilNext}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
