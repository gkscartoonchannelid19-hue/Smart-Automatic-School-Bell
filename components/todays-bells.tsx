"use client"

import { Bell, Check, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BellEvent } from "@/lib/types"

interface TodaysBellsProps {
  bells: BellEvent[]
}

export function TodaysBells({ bells }: TodaysBellsProps) {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)

  const sortedBells = [...bells]
    .filter((b) => b.enabled)
    .sort((a, b) => a.time.localeCompare(b.time))

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const isPast = (time: string) => time < currentTime
  const isCurrent = (time: string, index: number) => {
    if (time > currentTime) return false
    const nextBell = sortedBells[index + 1]
    return !nextBell || nextBell.time > currentTime
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5" />
          {"Today's Schedule"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {sortedBells.map((bell, index) => {
                const past = isPast(bell.time)
                const current = isCurrent(bell.time, index)

                return (
                  <div key={bell.id} className="relative flex items-start gap-4 pl-10">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[9px] h-3 w-3 rounded-full border-2 ${
                        current
                          ? "border-primary bg-primary animate-pulse"
                          : past
                            ? "border-accent bg-accent"
                            : "border-muted-foreground bg-background"
                      }`}
                    />

                    <div
                      className={`flex-1 rounded-lg p-3 transition-colors ${
                        current
                          ? "bg-primary/10 border border-primary/20"
                          : past
                            ? "bg-muted/50"
                            : "bg-card border border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            current
                              ? "text-primary"
                              : past
                                ? "text-muted-foreground"
                                : "text-foreground"
                          }`}
                        >
                          {bell.name}
                        </p>
                        {past && !current && (
                          <Check className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          past ? "text-muted-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(bell.time)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {sortedBells.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 opacity-50" />
                  <p className="mt-2 text-sm">No bells scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
