"use client"

import { useState } from "react"
import { Plus, MoreVertical, Edit, Trash2, Calendar, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Schedule } from "@/lib/types"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface ScheduleListProps {
  schedules: Schedule[]
  onAddSchedule: (schedule: Schedule) => void
  onUpdateSchedule: (id: string, updates: Partial<Schedule>) => void
  onDeleteSchedule: (id: string) => void
  onSelectSchedule: (id: string) => void
  onSetActive: (id: string) => void
}

export function ScheduleList({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onSelectSchedule,
  onSetActive,
}: ScheduleListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    days: [1, 2, 3, 4, 5] as number[],
  })

  const openAddDialog = () => {
    setEditingSchedule(null)
    setFormData({ name: "", description: "", days: [1, 2, 3, 4, 5] })
    setIsDialogOpen(true)
  }

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      name: schedule.name,
      description: schedule.description,
      days: schedule.days,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) return

    if (editingSchedule) {
      onUpdateSchedule(editingSchedule.id, {
        name: formData.name,
        description: formData.description,
        days: formData.days,
      })
    } else {
      onAddSchedule({
        id: crypto.randomUUID(),
        name: formData.name,
        description: formData.description,
        days: formData.days,
        isActive: false,
        bells: [],
      })
    }
    setIsDialogOpen(false)
  }

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day].sort(),
    }))
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Schedules</CardTitle>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer hover:bg-muted/50 ${
                schedule.isActive ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => onSelectSchedule(schedule.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    schedule.isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{schedule.name}</p>
                    {schedule.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {schedule.bells.length} bells &middot;{" "}
                    {schedule.days.map((d) => DAYS[d]).join(", ")}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!schedule.isActive && (
                    <DropdownMenuItem onClick={() => onSetActive(schedule.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Set as Active
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => openEditDialog(schedule)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDeleteSchedule(schedule.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {schedules.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">No schedules yet</p>
              <p className="text-sm">Create your first schedule to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit Schedule" : "Add Schedule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Schedule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Regular Day, Half Day"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="e.g., Standard school day schedule"
              />
            </div>
            <div className="space-y-2">
              <Label>Active Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, index) => (
                  <div key={day} className="flex items-center gap-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={formData.days.includes(index)}
                      onCheckedChange={() => toggleDay(index)}
                    />
                    <Label htmlFor={`day-${index}`} className="text-sm font-normal">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingSchedule ? "Save Changes" : "Add Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
