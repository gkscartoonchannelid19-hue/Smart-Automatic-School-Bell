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

interface ESP32InfoProps {
  isConnected: boolean
  portName: string | null
  onConnect: () => void
  isConnecting: boolean
  error: string | null
}

export function ESP32Info({
  isConnected,
  portName,
  onConnect,
  isConnecting,
  error,
}: ESP32InfoProps) {
  const esp32Code = `#include <WebSerial.h>
#include <WiFi.h>

// Pin for relay/buzzer
const int BUZZER_PIN = 5; // GPIO5 (D5)

// WiFi credentials (modify with your WiFi)
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\\nWiFi connected!");
  Serial.println(WiFi.localIP());

  // Start WebSerial
  WebSerial.begin(&Serial);
}

void loop() {
  // Handle incoming serial commands
  if (Serial.available()) {
    String command = Serial.readStringUntil('\\n');
    processCommand(command);
  }

  // Check WebSerial for commands
  if (WebSerial.available()) {
    size_t len = WebSerial.available();
    uint8_t *buffer = (uint8_t*) malloc(len);
    WebSerial.readBytes(buffer, len);
    String command = String((char*)buffer);
    free(buffer);
    
    processCommand(command);
  }

  delay(10);
}

void processCommand(String command) {
  command.trim();

  if (command.startsWith("RING:")) {
    // Extract duration
    int duration = command.substring(5).toInt();
    ringBell(duration);
  }
}

void ringBell(int durationSeconds) {
  int durationMs = durationSeconds * 1000;
  int endTime = millis() + durationMs;

  while (millis() < endTime) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(250);
    digitalWrite(BUZZER_PIN, LOW);
    delay(250);
  }

  Serial.println("Bell rung for " + String(durationSeconds) + " seconds");
}`

  const arduinoInstructions = `SETUP INSTRUCTIONS FOR ESP-32

STEP 1: Install Arduino IDE and ESP-32 Board
1. Download Arduino IDE: https://www.arduino.cc/en/software
2. Open Arduino IDE → File → Preferences
3. Add to "Additional Board Manager URLs":
   https://dl.espressif.com/dl/package_esp32_index.json
4. Go to Tools → Board Manager
5. Search for "ESP32" and install "ESP32 by Espressif Systems"

STEP 2: Flash the Code
1. Connect ESP-32 to your computer via USB
2. Select the correct board:
   - Tools → Board → ESP32 → "ESP32 Dev Module"
3. Select the correct port:
   - Tools → Port → (select your ESP-32 port)
4. Copy the code from above
5. Paste into Arduino IDE
6. Modify WiFi credentials (ssid and password)
7. Click Upload button (→ icon)
8. Wait for "Upload complete"

STEP 3: Connect from Web App
1. Open the web app in Chrome, Edge, or Opera browser
2. Click the "Connect" button in the ESP-32 section
3. A dialog will appear showing available COM ports
4. Select your ESP-32 device (usually "USB UART" or "CP2102")
5. Click "Connect"
6. You should see "Connected" status

STEP 4: Test the Connection
1. Create a test bell or click the "Test" button
2. The ESP-32 should:
   - Receive the RING command via serial
   - Activate the buzzer/relay on GPIO5
   - Send confirmation back

HARDWARE SETUP
- Connect relay/buzzer to ESP-32:
  • Relay VCC → ESP-32 3.3V
  • Relay GND → ESP-32 GND
  • Relay IN → ESP-32 GPIO5 (D5)
  • Relay COM → Bell/Buzzer input
  • Relay NO → Bell/Buzzer output

TROUBLESHOOTING

1. "Web Serial API not supported"
   - Use Chrome, Edge, or Opera browser
   - Firefox and Safari don't support Web Serial

2. "No ports available"
   - Check USB cable is properly connected
   - Install CP2102 driver if needed:
     macOS/Linux: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
     Windows: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

3. "Port is already in use"
   - Close Arduino IDE Serial Monitor
   - Close any other serial terminal apps
   - Restart browser and try again

4. "Connection works but bell doesn't ring"
   - Check wiring to relay/buzzer
   - Verify GPIO5 is correct in code
   - Test relay with manual power (5V to relay)
   - Check Arduino IDE Serial Monitor for errors

5. "No data received from ESP-32"
   - Open Arduino IDE Serial Monitor (Tools → Serial Monitor)
   - Set baud rate to 115200
   - Check if ESP-32 is sending data`

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Cpu className="h-5 w-5" />
          ESP-32
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
              {isConnected ? portName : "Not Connected"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isConnected
                ? "Ready to ring bell"
                : "Connect via Web Serial"}
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
          <AccordionItem value="arduino">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Arduino Setup — Flash this to your ESP-32
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg bg-muted p-4">
                <pre className="whitespace-pre-wrap text-xs font-mono text-muted-foreground overflow-x-auto">
                  {esp32Code}
                </pre>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <strong>Note:</strong> Modify WiFi credentials and check GPIO5 is connected to your relay/buzzer. Use Chrome, Edge, or Opera for Web Serial API support.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Setup Instructions — Step by step guide
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs font-mono text-muted-foreground">
                  {arduinoInstructions}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Web Serial requires Chrome, Edge, or Opera browser.
              If ESP-32 is not connected, an audio bell will play through your
              speakers instead.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
              <p className="mb-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                Troubleshooting Tips:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-xs text-amber-600 dark:text-amber-300">
                <li>Make sure ESP-32 code is flashed and running</li>
                <li>Check USB cable is properly connected</li>
                <li>Use Chrome, Edge, or Opera browser</li>
                <li>Install CP2102 USB driver if needed</li>
                <li>Close Arduino Serial Monitor before connecting</li>
                <li>Check browser console (F12) for detailed errors</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
