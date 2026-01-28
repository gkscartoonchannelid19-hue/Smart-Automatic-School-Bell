"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SchoolSettings } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: SchoolSettings
  onUpdateSettings: (settings: Partial<SchoolSettings>) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdateSettings,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>School Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="school-name">School Name</Label>
            <Input
              id="school-name"
              value={settings.schoolName}
              onChange={(e) => onUpdateSettings({ schoolName: e.target.value })}
              placeholder="Enter school name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">School Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={settings.startTime}
                onChange={(e) => onUpdateSettings({ startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">School End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={settings.endTime}
                onChange={(e) => onUpdateSettings({ endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period-duration">Period Duration (min)</Label>
              <Input
                id="period-duration"
                type="number"
                min={15}
                max={120}
                value={settings.periodDuration}
                onChange={(e) =>
                  onUpdateSettings({
                    periodDuration: parseInt(e.target.value) || 45,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-duration">Break Duration (min)</Label>
              <Input
                id="break-duration"
                type="number"
                min={5}
                max={60}
                value={settings.breakDuration}
                onChange={(e) =>
                  onUpdateSettings({
                    breakDuration: parseInt(e.target.value) || 10,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
