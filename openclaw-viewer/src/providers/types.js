/**
 * OpenClaw Command Center - Data Provider Types
 *
 * This file defines the contract between data providers and the visualization.
 * Any provider (mock, live WebSocket, REST polling, etc.) must emit state
 * conforming to these shapes.
 *
 * ─── AgentState ─────────────────────────────────────────
 * @typedef {Object} AgentState
 * @property {string} id - Unique agent identifier
 * @property {string} name - Display name
 * @property {string} role - Agent role description
 * @property {string} color - Hex color for theming
 * @property {string} icon - Icon key from lucide-react (e.g., "Calendar", "Code")
 * @property {{ x: number, y: number }} position - Current position in room coordinates
 * @property {'idle' | 'working' | 'collaborating' | 'thinking'} status - Current state
 * @property {string} currentTask - Human-readable current task description
 * @property {{ x: number, y: number }[]} trail - Recent position history (max 15)
 *
 * ─── CollabPair ─────────────────────────────────────────
 * @typedef {Object} CollabPair
 * @property {string} id1 - First agent ID
 * @property {string} id2 - Second agent ID
 * @property {string} color - Line color (hex)
 *
 * ─── LogEntry ───────────────────────────────────────────
 * @typedef {Object} LogEntry
 * @property {string} message - Log message text
 * @property {string} timestamp - ISO timestamp or display string
 *
 * ─── WorkstationDef ─────────────────────────────────────
 * @typedef {Object} WorkstationDef
 * @property {string} id - Unique station identifier
 * @property {string} name - Display name
 * @property {number} x - X position in room
 * @property {number} y - Y position in room
 * @property {string} icon - Icon key from lucide-react
 * @property {string} color - Hex color
 *
 * ─── ProviderState ──────────────────────────────────────
 * The complete state snapshot returned by any provider.
 *
 * @typedef {Object} ProviderState
 * @property {AgentState[]} agents - All agents with current state
 * @property {CollabPair[]} collabPairs - Active collaboration connections
 * @property {string[]} activityLog - Recent activity messages (newest first, max 6)
 * @property {WorkstationDef[]} workstations - Room workstation layout
 * @property {'demo' | 'live' | 'replay'} mode - Current provider mode
 * @property {boolean} connected - Whether the data source is connected
 */

// ─── Room Constants ─────────────────────────────────────
export const ROOM_W = 900;
export const ROOM_H = 600;
export const SYNC_CENTER = { x: 450, y: 350 };

// ─── Default Workstations ───────────────────────────────
export const DEFAULT_WORKSTATIONS = [
  { id: "planning", name: "Planning Station", x: 150, y: 150, icon: "Monitor", color: "#3b82f6" },
  { id: "analytics", name: "Analytics Hub", x: 450, y: 200, icon: "Database", color: "#10b981" },
  { id: "code", name: "Code Terminal", x: 750, y: 180, icon: "Cpu", color: "#8b5cf6" },
  { id: "support", name: "Support Console", x: 250, y: 450, icon: "Server", color: "#f59e0b" },
  { id: "research", name: "Research Lab", x: 550, y: 480, icon: "Workflow", color: "#ec4899" },
  { id: "command", name: "Command Node", x: 800, y: 500, icon: "Radio", color: "#06b6d4" },
];

// ─── Default Agent Definitions ──────────────────────────
export const DEFAULT_AGENT_DEFS = [
  { id: "atlas", name: "Atlas", role: "Schedule Manager", color: "#3b82f6", icon: "Calendar", initPos: { x: 150, y: 150 }, defaultTask: "Coordinating team meetings" },
  { id: "sage", name: "Sage", role: "Data Analyst", color: "#10b981", icon: "BarChart3", initPos: { x: 450, y: 200 }, defaultTask: "Analyzing performance metrics" },
  { id: "cipher", name: "Cipher", role: "Code Reviewer", color: "#8b5cf6", icon: "Code", initPos: { x: 750, y: 180 }, defaultTask: "Reviewing pull request #247" },
  { id: "echo", name: "Echo", role: "Customer Support", color: "#f59e0b", icon: "Headphones", initPos: { x: 250, y: 450 }, defaultTask: "Monitoring support queue" },
  { id: "nova", name: "Nova", role: "Research Assistant", color: "#ec4899", icon: "BookOpen", initPos: { x: 550, y: 480 }, defaultTask: "Gathering market insights" },
  { id: "nexus", name: "Nexus", role: "Task Orchestrator", color: "#06b6d4", icon: "Network", initPos: { x: 800, y: 500 }, defaultTask: "Optimizing workflow pipelines" },
];
