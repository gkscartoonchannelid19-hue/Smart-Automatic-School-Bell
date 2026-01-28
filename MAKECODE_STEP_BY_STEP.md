# MakeCode Step-by-Step Guide

## You Have: "bluetooth on data received new line" Block ✅

Now you need to add blocks **INSIDE** this event handler. Here's exactly what to do:

---

## Step 1: Get the Received Data

**What to do:**
1. Go to **"Variables"** category (left sidebar)
2. Click **"Make a Variable"**
3. Name it: **`data`**
4. Drag **"set data to"** block into your **"bluetooth on data received"** block
5. Go to **"Bluetooth"** category
6. Drag **"bluetooth uart read until newline"** block
7. Connect it to the **"set data to"** block

**Result:** Your block now looks like:
```
bluetooth on data received new line
  set data to [bluetooth uart read until newline]
```

---

## Step 2: Check if Command is "RING:"

**What to do:**
1. Go to **"Logic"** category
2. Drag an **"if"** block
3. Place it **below** the "set data to" block (still inside "bluetooth on data received")
4. Go to **"Logic"** again
5. Drag **"data starts with"** block
6. Connect it to the **"if"** condition
7. Type **`RING:`** in the text box

**Result:**
```
bluetooth on data received new line
  set data to [bluetooth uart read until newline]
  if [data starts with "RING:"]
    (empty - we'll add stuff here next)
```

---

## Step 3: Extract the Duration Number

**What to do:**
1. Go to **"Variables"** → **"Make a Variable"** → name it: **`duration`**
2. Drag **"set duration to"** block
3. Place it **inside** the "if" block
4. Go to **"Text"** category
5. Drag **"split data by"** block
6. Type **`:`** (colon) in the text box
7. Go to **"Text"** again
8. Drag **"get index"** block
9. Set the number to **`1`** (this gets the part after "RING:")
10. Connect: **split data by ":"** → **get index 1** → **set duration to**

**Result:**
```
bluetooth on data received new line
  set data to [bluetooth uart read until newline]
  if [data starts with "RING:"]
    set duration to [get index 1 of [split data by ":"]]
```

---

## Step 4: Ring the Bell (Turn Pin On/Off)

**What to do:**
1. Go to **"Loops"** category
2. Drag **"repeat"** block
3. Place it **below** "set duration to" (still inside "if")
4. Change the number: Click the number, go to **"Math"** category
5. Drag **"duration × 2"** (use multiplication block)
6. **Inside** the repeat block, add these in order:
   - From **"Pins"**: **"digital write pin P0 to 1"**
   - From **"Basic"**: **"pause 250 ms"**
   - From **"Pins"**: **"digital write pin P0 to 0"**
   - From **"Basic"**: **"pause 250 ms"**

**Result:**
```
bluetooth on data received new line
  set data to [bluetooth uart read until newline]
  if [data starts with "RING:"]
    set duration to [get index 1 of [split data by ":"]]
    repeat [duration × 2] times
      digital write pin P0 to 1
      pause 250 ms
      digital write pin P0 to 0
      pause 250 ms
```

---

## Step 5: Show Visual Feedback

**What to do:**
1. After the "repeat" block (still inside "if"), add:
   - From **"Basic"**: **"show icon"** → select **❤ (heart)**
   - From **"Basic"**: **"clear"** (to turn off display)

**Result:**
```
bluetooth on data received new line
  set data to [bluetooth uart read until newline]
  if [data starts with "RING:"]
    set duration to [get index 1 of [split data by ":"]]
    repeat [duration × 2] times
      digital write pin P0 to 1
      pause 250 ms
      digital write pin P0 to 0
      pause 250 ms
    show icon ❤
    clear
```

---

## Step 6: Send Confirmation (Optional)

**What to do:**
1. After "clear", go to **"Bluetooth"** category
2. Drag **"bluetooth uart write string"** block
3. Type **`OK`** in the text box

**Final Result:**
```
bluetooth on data received new line
  set data to [bluetooth uart read until newline]
  if [data starts with "RING:"]
    set duration to [get index 1 of [split data by ":"]]
    repeat [duration × 2] times
      digital write pin P0 to 1
      pause 250 ms
      digital write pin P0 to 0
      pause 250 ms
    show icon ❤
    clear
    bluetooth uart write string "OK"
```

---

## Don't Forget: "on start" Block!

You also need to set up the "on start" block:

1. Find **"on start"** block (it's already on screen)
2. Go to **"Bluetooth"** category
3. Click the **"..."** (three dots) menu
4. Drag **"bluetooth start uart service"** into "on start"
5. Add **"show icon"** → select **❤** (so you know it's running)

**"on start" should look like:**
```
on start
  bluetooth start uart service
  show icon ❤
```

---

## Download and Test!

1. Click **"Download"** button (bottom left)
2. Connect Micro:bit via USB
3. Copy the `.hex` file to your Micro:bit
4. Unplug and use battery pack
5. Connect from the web app!

---

## Troubleshooting

**Can't find a block?**
- Make sure you added the **Bluetooth extension** first
- Some blocks are in the **"..."** menu in Bluetooth category

**Blocks won't connect?**
- Make sure the shapes match (oval goes in oval, square in square)
- Some blocks need to be inside others (like inside "if" or "repeat")

**Still confused?**
- Try building it step by step
- Test after each step by downloading and flashing
- Check the browser console (F12) for errors when connecting
