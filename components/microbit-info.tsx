"use client"

import { Bluetooth, BluetoothOff, Cpu, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface MicrobitInfoProps {
  isConnected: boolean
  deviceName: string | null
  onConnect: () => void
  isConnecting: boolean
  error: string | null
}

export function MicrobitInfo({
  isConnected,
  deviceName,
  onConnect,
  isConnecting,
  error,
}: MicrobitInfoProps) {
  const microbitCode = `# MicroPython on micro:bit does NOT include a "bluetooth" module.
# Use MakeCode for Bluetooth connection - see "MakeCode (Bluetooth)" below.

from microbit import *

display.show(Image.YES)
sleep(1000)
display.scroll("USE MAKECODE FOR BLUETOOTH", delay=80)
display.show(Image.HEART)
sleep(2000)
display.clear()

# This script only runs to show the message above.
# Flash the MakeCode project (see instructions) to connect from the browser.`

  const makeCodeInstructions = `BLUETOOTH REQUIRES MAKECODE (not MicroPython)

STEP 1: Add Bluetooth Extension
1. Open https://makecode.microbit.org/
2. Click "Extensions" (or "+ Extensions")
3. Search for "bluetooth" and click on it
4. Accept removing the radio package (Bluetooth and radio can't work together)

STEP 2: Set Up "on start" Block
1. Find the "on start" block (it's already on the screen)
2. Click the "..." (three dots) menu in the BLUETOOTH category
3. Drag "bluetooth start uart service" into the "on start" block
4. Also add "show icon" → select heart icon (so you know it's working)

STEP 3: Handle Incoming Data (YOU ARE HERE!)
You have the "bluetooth on data received new line" block. Now add these blocks INSIDE it:

A. Get the received data:
   • From "Variables" → "Make a Variable" → name it "data"
   • Drag "set data to" into your "bluetooth on data received" block
   • From "Bluetooth" → drag "bluetooth uart read until newline" 
   • Connect it to "set data to"

B. Check if it's a RING command:
   • From "Logic" → drag "if" block
   • From "Logic" → drag "data starts with" 
   • Type "RING:" in the text box
   • Connect "data starts with RING:" to the "if" condition

C. Extract the duration number:
   • From "Variables" → "Make a Variable" → name it "duration"
   • Inside the "if" block, add "set duration to"
   • From "Text" → drag "split data by" → type ":" in the text box
   • From "Text" → drag "get index" → set it to 1
   • Connect: split data by ":" → get index 1 → set duration to

D. Ring the bell:
   • From "Loops" → drag "repeat" block
   • Change the number to: "duration × 2" (use Math blocks)
   • Inside the repeat block, add:
     - "digital write pin P0 to 1" (from "Pins")
     - "pause 250 ms" (from "Basic")
     - "digital write pin P0 to 0" (from "Pins")
     - "pause 250 ms" (from "Basic")
   • After the repeat, add "show icon" → heart icon
   • After showing heart, add "clear" (from "Basic")

E. Send confirmation (optional):
   • From "Bluetooth" → drag "bluetooth uart write string"
   • Type "OK" in the text box

STEP 4: Download and Flash
1. Click "Download" button (bottom left)
2. Connect your Micro:bit via USB
3. Copy the .hex file to your Micro:bit (it will appear as a USB drive)
4. Wait for it to flash
5. Unplug from USB and use battery pack

STEP 5: Connect from Web App
1. Open the web app in Chrome or Edge
2. Click "Connect" button
3. Select "BBC micro:bit" from the Bluetooth device list
4. Click "Pair" when asked
5. Test with the "Test" button!

Your final structure should look like:
┌─ on start
│  ├─ bluetooth start uart service
│  └─ show icon ❤
│
└─ bluetooth on data received new line
   ├─ set data to [bluetooth uart read until newline]
   └─ if [data starts with "RING:"]
      ├─ set duration to [get index 1 of split data by ":"]
      ├─ repeat [duration × 2] times
      │  ├─ digital write pin P0 to 1
      │  ├─ pause 250 ms
      │  ├─ digital write pin P0 to 0
      │  └─ pause 250 ms
      ├─ show icon ❤
      ├─ clear
      └─ bluetooth uart write string "OK"`

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Cpu className="h-5 w-5" />
          BBC Micro:bit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            isConnected
              ? "border-accent bg-accent/10"
              : "border-border bg-muted/30"
          }`}
        >
          {isConnected ? (
            <Bluetooth className="h-8 w-8 text-accent" />
          ) : (
            <BluetoothOff className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {isConnected ? deviceName : "Not Connected"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isConnected
                ? "Ready to ring bell"
                : "Connect via Web Bluetooth"}
            </p>
          </div>
          {!isConnected && (
            <Button onClick={onConnect} disabled={isConnecting} size="sm">
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="makecode">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                MakeCode (Bluetooth) — use this to connect
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg bg-muted p-4">
                <pre className="whitespace-pre-wrap text-xs font-mono text-muted-foreground">
                  {makeCodeInstructions}
                </pre>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <strong>Note:</strong> Connect pin P0 to a relay or buzzer for the bell. Use Chrome or Edge and allow pairing when the browser asks.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="micropython">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                MicroPython (no Bluetooth — info only)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs font-mono text-muted-foreground">
                  {microbitCode}
                </pre>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                The standard Micro:bit MicroPython build has no <code>bluetooth</code> module. To connect from this app, use <strong>MakeCode</strong> (see “MakeCode (Bluetooth)” above).
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Web Bluetooth requires Chrome or Edge browser.
              If Micro:bit is not connected, an audio bell will play through your
              speakers instead.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
              <p className="mb-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                Troubleshooting Tips:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-xs text-amber-600 dark:text-amber-300">
                <li>Make sure Micro:bit is powered on and code is flashed</li>
                <li>Enable Bluetooth on your computer</li>
                <li>Use Chrome or Edge browser</li>
                <li>Try resetting Micro:bit and connecting again</li>
                <li>Check browser console (F12) for detailed errors</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
