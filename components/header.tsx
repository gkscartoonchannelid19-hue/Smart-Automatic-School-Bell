"use client"

import { Bell, Settings, Bluetooth, BluetoothOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  schoolName: string
  isConnected: boolean
  deviceName: string | null
  onConnect: () => void
  onDisconnect: () => void
  onSettingsClick: () => void
  isConnecting: boolean
}

export function Header({
  schoolName,
  isConnected,
  deviceName,
  onConnect,
  onDisconnect,
  onSettingsClick,
  isConnecting,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bell className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Smart School Bell</h1>
            <p className="text-sm text-muted-foreground">{schoolName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isConnected ? "default" : "outline"}
                  size="sm"
                  onClick={isConnected ? onDisconnect : onConnect}
                  disabled={isConnecting}
                  className="gap-2"
                >
                  {isConnected ? (
                    <>
                      <Bluetooth className="h-4 w-4" />
                      <span className="hidden sm:inline">{deviceName}</span>
                    </>
                  ) : (
                    <>
                      <BluetoothOff className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {isConnecting ? "Connecting..." : "Connect Micro:bit"}
                      </span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isConnected
                  ? "Click to disconnect Micro:bit"
                  : "Connect BBC Micro:bit via Bluetooth"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
