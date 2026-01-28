"use client"

import { useEffect, useRef } from "react"
import { Bell, X, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BellEvent } from "@/lib/types"

interface BellAlertProps {
  bell: BellEvent | null
  onDismiss: () => void
  isConnectedToMicrobit: boolean
}

export function BellAlert({ bell, onDismiss, isConnectedToMicrobit }: BellAlertProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (bell) {
      // Play audio bell sound
      if (!isConnectedToMicrobit) {
        playAudioBell(bell.duration)
      }

      // Auto-dismiss after duration
      timeoutRef.current = setTimeout(() => {
        onDismiss()
      }, bell.duration * 1000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [bell, onDismiss, isConnectedToMicrobit])

  const playAudioBell = (duration: number) => {
    // Create an oscillator for a bell sound
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = "sine"
      
      // Bell-like envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
      
      // Add harmonics for richer bell sound
      const harmonic = audioContext.createOscillator()
      const harmonicGain = audioContext.createGain()
      
      harmonic.connect(harmonicGain)
      harmonicGain.connect(audioContext.destination)
      
      harmonic.frequency.setValueAtTime(1200, audioContext.currentTime)
      harmonic.type = "sine"
      
      harmonicGain.gain.setValueAtTime(0, audioContext.currentTime)
      harmonicGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
      harmonicGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration * 0.7)
      
      harmonic.start(audioContext.currentTime)
      harmonic.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.error("Failed to play bell sound:", error)
    }
  }

  if (!bell) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
        <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground shadow-2xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onDismiss}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="mx-auto mb-4 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-primary-foreground/20">
            <Bell className="h-10 w-10" />
          </div>

          <h2 className="mb-2 text-3xl font-bold">{bell.name}</h2>
          <p className="text-lg opacity-90">{bell.time}</p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-75">
            <Volume2 className="h-4 w-4" />
            <span>
              {isConnectedToMicrobit
                ? "Ringing on Micro:bit"
                : "Playing audio bell"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
