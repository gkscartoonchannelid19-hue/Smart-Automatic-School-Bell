"use client"

import { useState, useRef } from "react"
import {
  Bell,
  Plus,
  Trash2,
  GripVertical,
  Volume2,
  VolumeX,
  Play,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Schedule, BellEvent } from "@/lib/types"

interface BellEditorProps {
  schedule: Schedule | null
  onAddBell: (scheduleId: string, bell: BellEvent) => void
  onUpdateBell: (scheduleId: string, bellId: string, updates: Partial<BellEvent>) => void
  onDeleteBell: (scheduleId: string, bellId: string) => void
  onReorderBells: (scheduleId: string, fromIndex: number, toIndex: number) => void
  onTestBell: (duration: number) => void
}

export function BellEditor({
  schedule,
  onAddBell,
  onUpdateBell,
  onDeleteBell,
  onReorderBells,
  onTestBell,
}: BellEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBell, setEditingBell] = useState<BellEvent | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    time: "08:00",
    duration: 3,
  })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const dragFromIndexRef = useRef<number | null>(null)
  const lastToIndexRef = useRef<number | null>(null)

  if (!schedule) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">
            Select a schedule to view and edit bells
          </p>
        </CardContent>
      </Card>
    )
  }

  // Use original order instead of sorting by time to preserve drag order
  const bells = schedule.bells

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragFromIndexRef.current = index
    lastToIndexRef.current = null
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
    // Required for Firefox and some browsers
    e.dataTransfer.dropEffect = "move"
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5"
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"

    const from = dragFromIndexRef.current
    if (from === null || from === index) return

    const row = e.currentTarget as HTMLElement
    const rect = row.getBoundingClientRect()
    const mid = rect.top + rect.height / 2
    const mouseY = e.clientY

    let toIndex: number
    if (mouseY < mid) {
      toIndex = index
    } else {
      toIndex = index + 1
    }

    // Only reorder when drop target actually changes (avoids flicker and repeated updates)
    if (lastToIndexRef.current !== toIndex) {
      lastToIndexRef.current = toIndex
      onReorderBells(schedule.id, from, toIndex)
      // After move, the dragged item is now at toIndex (or toIndex-1 if we inserted before)
      dragFromIndexRef.current = toIndex
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null)
    dragFromIndexRef.current = null
    lastToIndexRef.current = null
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1"
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggedIndex(null)
    dragFromIndexRef.current = null
    lastToIndexRef.current = null
  }

  const openAddDialog = () => {
    setEditingBell(null)
    setFormData({ name: "", time: "08:00", duration: 3 })
    setIsDialogOpen(true)
  }

  const openEditDialog = (bell: BellEvent) => {
    setEditingBell(bell)
    setFormData({
      name: bell.name,
      time: bell.time,
      duration: bell.duration,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) return

    if (editingBell) {
      onUpdateBell(schedule.id, editingBell.id, {
        name: formData.name,
        time: formData.time,
        duration: formData.duration,
      })
    } else {
      onAddBell(schedule.id, {
        id: crypto.randomUUID(),
        name: formData.name,
        time: formData.time,
        duration: formData.duration,
        enabled: true,
      })
    }
    setIsDialogOpen(false)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold">{schedule.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{schedule.description}</p>
          </div>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-1 h-4 w-4" />
            Add Bell
          </Button>
        </CardHeader>
        <CardContent>
          {bells.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">No bells configured</p>
              <p className="text-sm">Add bells to this schedule</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bells.map((bell, index) => (
                <div
                  key={bell.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  className={`flex items-center gap-2 rounded-lg border p-3 transition-all select-none ${
                    bell.enabled
                      ? "border-border bg-card"
                      : "border-border/50 bg-muted/30"
                  } ${
                    draggedIndex === index ? "opacity-50 scale-95" : ""
                  } cursor-move hover:bg-muted/50 active:cursor-grabbing`}
                >
                  <div
                    className="flex flex-col gap-0 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation()
                        onReorderBells(schedule.id, index, index - 1)
                      }}
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === bells.length - 1}
                      onClick={(e) => {
                        e.stopPropagation()
                        onReorderBells(schedule.id, index, index + 1)
                      }}
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Bell
                      className={`h-5 w-5 ${
                        bell.enabled ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="flex-1 cursor-pointer" onClick={() => openEditDialog(bell)}>
                    <p
                      className={`font-medium ${
                        bell.enabled ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {bell.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(bell.time)} &middot; {bell.duration}s duration
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onTestBell(bell.duration)}
                      title="Test bell"
                    >
                      <Play className="h-4 w-4" />
                    </Button>

                    <Switch
                      checked={bell.enabled}
                      onCheckedChange={(enabled) =>
                        onUpdateBell(schedule.id, bell.id, { enabled })
                      }
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteBell(schedule.id, bell.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBell ? "Edit Bell" : "Add Bell"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bell-name">Bell Name</Label>
              <Input
                id="bell-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., School Start, Break Time"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bell-time">Time</Label>
                <Input
                  id="bell-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bell-duration">Duration (seconds)</Label>
                <Input
                  id="bell-duration"
                  type="number"
                  min={1}
                  max={30}
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 3,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingBell ? "Save Changes" : "Add Bell"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
