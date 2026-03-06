# OpenClaw Agent Command Center - 3D Visualization System
 
## Overview
Build a real-time 3D visualization system for OpenClaw AI agents displayed as animated mini robots in a top-down cyberpunk mad lab environment. The system features a fully interactive 3D room viewed from an isometric perspective with smooth camera controls, 6 different agent types with distinct roles and behaviors, and a futuristic neural network monitoring interface.
 
## Core Concept
A sci-fi cyber lab command center where AI agents (represented as 3D robots) move between different terminal stations, collaborate in sync chambers, and perform various tasks. The entire scene is rendered in 3D using CSS 3D transforms with a cyberpunk aesthetic featuring neon effects, holographic UI elements, circuit patterns, and animated workstations.
 
---
 
## Technical Stack
- **React** with TypeScript
- **Motion (Framer Motion)** for animations and spring physics
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **CSS 3D Transforms** for true 3D rendering
 
---
 
## Visual Design System
 
### Color Palette
- **Background**: Black to slate-950 gradient
- **Primary Accent**: Cyan (#06b6d4, #22d3ee)
- **Secondary Accent**: Blue (#3b82f6)
- **Success**: Green (#22c55e, #10b981)
- **Warning**: Purple (#a855f7, #ec4899)
- **Grid/Lines**: Cyan with 20-30% opacity
- **Borders**: Cyan with 30% opacity, glowing effects
 
### Typography
- **Headings**: Bold, cyan-to-blue gradient text
- **Body**: Cyan/white with varying opacity (50-100%)
- **Monospace**: Use for all data displays, logs, and technical info
- **Font sizes**: 
  - Title: 2xl (24px)
  - Headings: lg (18px)
  - Body: xs-sm (12-14px)
  - Labels: 9-10px
 
### Effects
- **Glow/Shadow**: Use `drop-shadow`, `box-shadow` with agent/station colors
- **Backdrop Blur**: Apply to all panels (`backdrop-blur-sm`)
- **Neon Borders**: Glowing animated borders on interactive elements
- **Scan Lines**: Subtle horizontal animated lines for screens
- **Particle Effects**: Small glowing orbs and energy trails
 
---
 
## 3D Camera System
 
### Camera Controls
- **Perspective**: 1500px
- **Initial View**: 
  - X rotation: 60°
  - Y rotation: 0°
  - Z rotation: -45°
  - Zoom: 100%
 
### Interaction
- **Drag to Rotate**: 
  - Mouse down/move/up tracking
  - Inverted controls (drag down = look down, drag left = rotate left)
  - Sensitivity: 0.3x delta
  - X rotation constrained: 20° to 80°
  - Z rotation: unlimited 360°
 
- **Scroll to Zoom**:
  - Range: 50% to 150%
  - Sensitivity: 0.001x deltaY
 
- **Spring Physics**:
  - Stiffness: 100
  - Damping: 30
  - Smooth interpolation using Motion's `useSpring`
 
### UI Feedback
- Display live rotation angles (X, Z) and zoom percentage
- Cursor changes: `grab` → `grabbing` when dragging
- Control hint overlay showing "🎮 Drag to Rotate | 🖱️ Scroll to Zoom"
- Fade controls display to 50% opacity while dragging
 
---
 
## Room Environment (900x600px)
 
### 3D Floor Structure
1. **Base Floor** (translateZ: -40px):
   - Gradient: slate-900 via black to slate-900
   - Shadow: 0 30px 80px black with 90% opacity
 
2. **Cyber Grid** (translateZ: 0px):
   - Pattern: 40x40px grid
   - Lines: 2px cyan with 30% opacity
   - Animated: Infinite scroll from 0,0 to 40,40 over 20 seconds
 
3. **Circuit Overlay** (translateZ: 5px):
   - Radial gradient dots at strategic positions
   - 20% opacity
   - 100x100px pattern size
 
### Visual Depth
- Use `transformStyle: 'preserve-3d'` on all containers
- Layer elements at different Z-depths (-40px to +25px)
- Apply shadows and lighting effects based on Z position
 
---
 
## Agents (6 Total)
 
### Agent Types & Configuration
 
1. **Atlas** - Schedule Manager
   - Color: #3b82f6 (blue)
   - Icon: Calendar
   - Initial Position: (150, 150)
   - Default Task: "Coordinating team meetings"
 
2. **Sage** - Data Analyst
   - Color: #10b981 (green)
   - Icon: BarChart3
   - Initial Position: (450, 200)
   - Default Task: "Analyzing performance metrics"
 
3. **Cipher** - Code Reviewer
   - Color: #8b5cf6 (purple)
   - Icon: Code
   - Initial Position: (750, 180)
   - Default Task: "Reviewing pull request #247"
 
4. **Echo** - Customer Support
   - Color: #f59e0b (orange)
   - Icon: Headset
   - Initial Position: (250, 450)
   - Default Task: "Monitoring support queue"
 
5. **Nova** - Research Assistant
   - Color: #ec4899 (pink)
   - Icon: BookOpen
   - Initial Position: (550, 480)
   - Default Task: "Gathering market insights"
 
6. **Nexus** - Task Orchestrator
   - Color: #06b6d4 (cyan)
   - Icon: Network
   - Initial Position: (800, 500)
   - Default Task: "Optimizing workflow pipelines"
 
### Agent 3D Robot Structure
 
Each robot is a 3D cube-based character with:
 
#### **Head** (translateZ: 20px)
- **Front Face**: 7x6 unit rounded box
  - Background: agent color
  - Border: 2px white with 80% opacity
  - Contains: 2 blinking eyes (1.5x1.5 white circles)
  - Eyes blink: opacity animates from 1 → 0.4 → 1 over 2.5s
 
- **Top Face**: Rotated 90° on X-axis
  - Same width as front, 3px height
  - Brightness: 120% (lighter than front)
 
- **Side Face**: Rotated 90° on Y-axis
  - 3px width, same height as front
  - Brightness: 70% (darker than front)
 
#### **Antenna** (translateZ: 4px, top: -8px)
- Thin white line (0.5px wide, 8px tall)
- Top sphere showing status:
  - Idle: #9ca3af
  - Working: #22c55e
  - Collaborating: #3b82f6
  - Thinking: #a855f7
- Pulses when thinking: height 8→12→8, sphere scale 1→1.4→1
 
#### **Body** (translateZ: 15px)
- **Front Face**: 8x8 unit rounded box
  - Background: agent color
  - Border: 2px white with 80% opacity
  - Center icon: 4x4 units, white, drop-shadow
 
- **Top Face**: 8px wide, 4px deep
  - Brightness: 130%
 
- **Side Face**: 4px wide, 8px tall
  - Brightness: 60%
 
#### **Arms** (translateZ: 12px)
- Two 2x4 unit boxes on sides
- Wave when collaborating: rotate ±20° over 0.7s
- Animated from top origin
 
#### **Legs** (translateZ: 10px)
- Two 2x5 unit boxes at bottom
- Walk animation when working: scaleY 1→0.85→1 over 0.5s
- Alternating pattern (0.25s delay between legs)
 
#### **Shadow** (translateZ: -20px)
- 12x8 unit oval, black with 60% opacity
- Blur: large
- Positioned at robot's feet
 
#### **Glow Effect** (when working/collaborating)
- Pulsing aura in agent color
- Scale 1→1.3→1, opacity 0.2→0.5→0.2
- 2s animation loop
 
### Agent Movement Trail
- Last 15 positions stored
- Each trail point: 2x2px dot in agent color
- Opacity: (index / 15) × 0.6
- TranslateZ: 2px
- Creates glowing path behind moving robots
 
### Agent Interaction States
 
**Idle**: 
- Gray antenna light
- Subtle hover animation
- No special effects
 
**Working**:
- Green antenna light
- Walking leg animation
- Glowing aura
- Moving toward workstations
 
**Thinking**:
- Purple antenna light
- Pulsing antenna (height + light scale)
- Stationary or slow movement
 
**Collaborating**:
- Blue antenna light
- Waving arms
- Head bobbing (y: 0→-3→0)
- Moving to sync chamber
- Connected by lines to partner
 
### Hover Behavior
- Scale robot to 1.1x on hover
- Show floating task bubble above robot
- Bubble contains:
  - Agent role (colored text)
  - Current task (cyan text)
  - Speech bubble tail pointing down
  - Border and glow in agent color
  - Position: bottom 50px, translateZ: 40px
 
### Name Tag
- Always visible below robot
- Black background (80% opacity)
- Border in agent color with glow
- 9px font, monospace
- TranslateZ: 25px
 
---
 
## Workstations (6 Total)
 
### Station Locations & Types
 
1. **Planning Station** (150, 150) - Monitor - Blue
2. **Analytics Hub** (450, 200) - Database - Green  
3. **Code Terminal** (750, 180) - CPU - Purple
4. **Support Console** (250, 450) - Server - Orange
5. **Research Lab** (550, 480) - Workflow - Pink
6. **Command Node** (800, 500) - Radio - Cyan
 
### 3D Workstation Structure
 
Each station is a 16x16 unit 3D console:
 
#### **Front Face** (translateZ: 8px)
- Rounded box with 2px border
- Background: station color at 20% opacity
- Border: station color at 100%
- Icon: 8x8 units in station color
- Glowing box-shadow: 0 0 20px color (60% opacity)
- Inner glow: inset 0 0 20px color (30% opacity)
- Pulse animation: glow 20px→30px→20px over 2s
 
#### **Top Face**
- 8px deep, full width
- Rotated 90° on X-axis
- Background: station color at 40% opacity
- Brightness: 140%
 
#### **Side Face**
- 8px wide, full height
- Rotated 90° on Y-axis  
- Background: station color at 30% opacity
- Brightness: 80%
 
#### **Holographic Label** (translateZ: 15px)
- Position: 6px below station, centered
- Text: 9px monospace
- Border and text: station color
- Background: black at 80% opacity
- Glow: 0 0 8px color (40% opacity)
 
#### **Point Light**
- Emits from each workstation
- Color: station color
- Creates ambient lighting effect
 
---
 
## Sync Chamber (Collaboration Zone)
 
### Position & Size
- Center: (450, 350)
- Size: 100x100 unit circle
- TranslateZ: 5px
 
### Visual Elements
 
1. **Main Ring**:
   - Dashed border (2px)
   - Color: #a855f7 (purple)
   - Glow: 0 0 30px purple (40% opacity)
   - Animation: rotate 360° + scale 1→1.1→1 over 8s
 
2. **Corner Markers** (4 total):
   - Positions: (-10,-10), (110,-10), (-10,110), (110,110)
   - Size: 3x3 units, rounded
   - Color: purple with glow
   - TranslateZ: 12px
   - Staggered pulse: opacity 0.6→1→0.6, scale 1→1.3→1
   - Delay: 0.2s per marker
 
3. **Point Light**:
   - Center of chamber
   - Purple color
   - Intensity: 2
   - Distance: 3 units
 
### Collaboration Behavior
When two agents collaborate:
- Both move to opposite sides of sync chamber
- Positions: (400, 350) and (500, 350)
- Connected by animated line (see below)
- Duration: 3.5 seconds
- Activity logged with timestamp
 
---
 
## Collaboration Lines
 
### Visual Style
- Drawn with SVG between collaborating agents
- Start/End: agent center + 16px offset
- Stroke: agent1's color
- Width: 3px
- Dash pattern: 8px dash, 4px gap
- TranslateZ: 18px (above robots)
 
### Animation
- Initial: pathLength 0, opacity 0
- Animate to: pathLength 1, opacity 0.8
- Duration: 0.8s
- Appears when collaboration starts
 
---
 
## Movement & Collision System
 
### Agent Movement Pattern
Every 5 seconds:
- 30% chance agent picks new destination
- Target: random workstation + random offset (±12.5px)
- Spring animation to new position
- Stiffness: 80, Damping: 15, Mass: 0.5
 
### Collision Detection
- Minimum distance between agents: 40px
- If collision detected:
  - Try 8 alternative positions in circle around target
  - Radius increases with each attempt (30px + attempt × 8px)
  - Final position clamped to room bounds (80px to width/height - 80px)
 
### Collaboration Trigger
Every 8 seconds:
- 40% chance of collaboration event
- Pick 2 random agents
- Move both to sync chamber (opposite sides)
- Set status to 'collaborating'
- Create connection line
- Log event with both names
- After 3.5s: clear collaborating status
 
---
 
## Random Task Pool
 
Agents randomly cycle through these tasks:
- "Processing incoming requests"
- "Analyzing system metrics"  
- "Optimizing workflows"
- "Reviewing documentation"
- "Coordinating tasks"
- "Gathering insights"
- "Synchronizing data"
- "Planning sprints"
- "Monitoring performance"
- "Generating reports"
 
Task changes when agent moves to new station.
 
---
 
## Header UI
 
### Layout
Full-width bar with:
- Left: Title and subtitle
- Right: Status cards
 
### Title Section
- **Main Title**: 
  - "OpenClaw Agent Command Center - 3D View"
  - Size: 2xl, bold
  - Gradient: cyan-400 to blue-500
  - Icon: Zap (cyan, glowing)
 
- **Subtitle**:
  - "Neural Network Monitoring System v3.0 • Drag to rotate • Scroll to zoom"
  - Size: sm
  - Color: cyan-300 with 70% opacity
 
### Status Cards (2 cards)
 
**Active Agents Card**:
- Label: "Active" (cyan, 70% opacity, xs)
- Count: {agent count} (cyan, xl, bold, glowing)
- Background: black 80% opacity
- Border: cyan-500 50% opacity
 
**Working Agents Card**:  
- Label: "Working" (green, 70% opacity, xs)
- Count: {working count} (green, xl, bold, glowing)
- Background: black 80% opacity
- Border: green-500 50% opacity
 
### Container Style
- Background: black 60% opacity with backdrop blur
- Border: cyan-500 30% opacity
- Padding: 4 units
- Rounded: xl
- Shadow: cyan glow
 
---
 
## Activity Feed Panel (Right Side, 320px wide)
 
### Structure
 
#### **Header**
- Icon: Activity (cyan, glowing)
- Title: "System Log" (cyan, lg, bold)
 
#### **Log Area** (scrollable)
When empty: "Monitoring neural activity..." (gray, xs, mono)
 
When populated, each log entry shows:
- **Message**: collaboration text (cyan, xs, mono)
- **Timestamp**: current time (cyan 50% opacity, 10px, mono)
- **Container**: 
  - Black 60% background
  - Cyan border 30% opacity
  - Rounded corners
  - Enter animation: slide from right (x: 20→0) over 0.3s
 
#### **Agent Roster Section**
- Title: "AGENT ROSTER" (cyan, xs, mono)
- Each agent row:
  - Pulsing dot (2x2, agent color, glowing)
  - Name (xs, mono, agent color)
  - Role (10px, mono, cyan 50% opacity)
  - Dot animation: opacity 0.6→1→0.6 over 2s
 
#### **Status Key Section**  
- Title: "STATUS KEY" (cyan, xs, mono)
- 2x2 grid showing:
  - WORKING: green dot + label
  - SYNCING: blue dot + label  
  - THINKING: purple dot + label
  - IDLE: gray dot + label
- Each dot: 2x2 with matching glow
 
### Container Style
- Background: black 60% opacity with backdrop blur
- Border: cyan-500 30% opacity
- Padding: 4 units
- Rounded: xl
- Display: flex column
- Sections separated by cyan borders
 
---
 
## Animation Specifications
 
### Robot Animations
- **Hover**: scale 1→1.15, smooth transition
- **Eye Blink**: opacity 1→0.4→1, 2.5s loop
- **Antenna Pulse** (thinking): height 8→12→8, sphere 1→1.4→1, 1s loop
- **Arm Wave** (collaborating): rotateZ ±20°, 0.7s loop
- **Leg Walk** (working): scaleY 1→0.85→1, 0.5s loop, alternating
- **Head Bob** (collaborating): y 0→-3→0, 0.6s loop
- **Glow Pulse**: scale 1→1.3→1, opacity 0.2→0.5→0.2, 2s loop
 
### Station Animations
- **Glow Pulse**: shadow 20px→30px→20px, 2s loop, infinite
 
### Chamber Animations
- **Ring Rotate**: 0→360°, 8s loop, linear
- **Ring Scale**: 1→1.1→1, 8s loop
- **Marker Pulse**: opacity 0.6→1→0.6, scale 1→1.3→1, 1.5s loop, staggered
 
### Grid Animation
- **Background Scroll**: position 0,0→40,40, 20s loop, linear
 
### UI Animations
- **Log Entry**: opacity 0→1, x 20→0, 0.3s
- **Status Dot**: opacity 0.6→1→0.6, 2s loop
- **Collaboration Line**: pathLength 0→1, opacity 0→0.8, 0.8s
 
---
 
## Performance Optimizations
 
1. **Use CSS 3D Transforms**: Hardware accelerated
2. **Spring Physics**: Motion's `useSpring` for smooth camera
3. **Motion Values**: `useMotionValue` for zero-latency updates
4. **Ref Usage**: Track positions without re-renders
5. **Memoization**: Consider memoizing workstation/chamber renders
6. **Conditional Rendering**: Only show trails/lines when needed
7. **Transform-only Animations**: Avoid layout thrashing
8. **Will-change**: Apply to frequently transformed elements
 
---
 
## Component Architecture
 
### Main Component: `AgentRoom3D`
- Manages camera state (rotateX, rotateY, rotateZ, zoom)
- Handles mouse drag and wheel events
- Manages agent array with positions/states
- Tracks interaction pairs
- Maintains activity log
- Runs movement/collaboration intervals
 
### Sub-component: `Agent3D`
- Receives agent data and interaction state
- Renders 3D robot structure
- Manages hover state
- Shows task bubble on hover
- Renders movement trail
 
### Rendered Elements:
- Header (title + stats)
- Camera controls display
- 3D room container with transform styles
- Floor layers (base, grid, circuits)
- Workstation array
- Sync chamber
- Agent array
- Collaboration lines (SVG)
- Activity feed panel
 
---
 
## State Management
 
### Agent State Structure
```typescript
interface AgentType {
  id: string;
  name: string;
  role: string;
  color: string; // hex color
  icon: string; // icon name
  position: { x: number; y: number };
  status: 'idle' | 'working' | 'collaborating' | 'thinking';
  currentTask?: string;
  trail?: { x: number; y: number }[];
}
```
 
### Camera State
- Motion values: rotateX, rotateY, rotateZ, zoom
- Spring values: springRotateX, springRotateY, springRotateZ, springZoom
- Drag state: isDragging, dragStart ref
 
### Other State
- interactingPairs: Set<string> (agent IDs)
- activityLog: string[] (max 6 entries)
- previousPositions: Map (for trails)
 
---
 
## Intervals & Timings
 
1. **Trail Update**: 100ms
   - Update each agent's trail array
   - Keep last 15 positions
 
2. **Agent Movement**: 5000ms (5s)
   - 30% chance per agent
   - Move to random workstation
   - Update task and status
 
3. **Collaboration**: 8000ms (8s)  
   - 40% chance
   - Pick 2 random agents
   - 3500ms collaboration duration
 
---
 
## Accessibility & UX
 
1. **Cursor Feedback**: grab/grabbing cursor states
2. **Visual Feedback**: camera stats display, opacity changes while dragging
3. **Smooth Physics**: Spring damping prevents jarring movements
4. **Constrained Rotation**: X-axis limited to prevent disorientation
5. **Hover States**: Clear visual feedback on interactive elements
6. **Activity Log**: Real-time updates with timestamps
7. **Status Indicators**: Color-coded system with legend
 
---
 
## Final Notes
 
- All measurements in pixels unless specified
- Use `transformStyle: 'preserve-3d'` on all 3D containers
- Apply `will-change: transform` to animated elements
- Keep perspective at 1500px for consistent depth
- Layer Z-depths: -40px (floor) to +40px (UI overlays)https://pastebin.com/
- Use monospace font for all technical/data displays
- Maintain 60fps with transform-only animations
- Test camera controls for smooth, intuitive feel
 
---
 
## Example Color Application
 
**Robot in Idle State (Sage - Green)**:
- Body/Head: #10b981
- Body Glow: 0 0 20px #10b98160
- Antenna Light: #9ca3af
- Name Tag Border: #10b981
- Trail: #10b981 with fading opacity
 
**Workstation (Analytics Hub - Green)**:
- Background: #10b98120 (20% opacity)
- Border: #10b981
- Icon: #10b981
- Glow: 0 0 20px #10b98160
- Label: #10b981
 
This creates visual cohesion between agents and their associated workstations.