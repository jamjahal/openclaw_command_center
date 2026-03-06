import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import {
  Zap, Activity, Calendar, BarChart3, Code, Headphones,
  BookOpen, Network, Monitor, Database, Cpu, Server,
  Workflow, Radio
} from "lucide-react";

// ─── Icon Map ───────────────────────────────────────────
const IconMap = { Calendar, BarChart3, Code, Headphones, BookOpen, Network, Monitor, Database, Cpu, Server, Workflow, Radio };

// ─── Agent Definitions ──────────────────────────────────
const AGENT_DEFS = [
  { id: "atlas", name: "Atlas", role: "Schedule Manager", color: "#3b82f6", icon: "Calendar", initPos: { x: 150, y: 150 }, defaultTask: "Coordinating team meetings" },
  { id: "sage", name: "Sage", role: "Data Analyst", color: "#10b981", icon: "BarChart3", initPos: { x: 450, y: 200 }, defaultTask: "Analyzing performance metrics" },
  { id: "cipher", name: "Cipher", role: "Code Reviewer", color: "#8b5cf6", icon: "Code", initPos: { x: 750, y: 180 }, defaultTask: "Reviewing pull request #247" },
  { id: "echo", name: "Echo", role: "Customer Support", color: "#f59e0b", icon: "Headphones", initPos: { x: 250, y: 450 }, defaultTask: "Monitoring support queue" },
  { id: "nova", name: "Nova", role: "Research Assistant", color: "#ec4899", icon: "BookOpen", initPos: { x: 550, y: 480 }, defaultTask: "Gathering market insights" },
  { id: "nexus", name: "Nexus", role: "Task Orchestrator", color: "#06b6d4", icon: "Network", initPos: { x: 800, y: 500 }, defaultTask: "Optimizing workflow pipelines" },
];

// ─── Workstation Definitions ────────────────────────────
const WORKSTATIONS = [
  { id: "planning", name: "Planning Station", x: 150, y: 150, icon: "Monitor", color: "#3b82f6" },
  { id: "analytics", name: "Analytics Hub", x: 450, y: 200, icon: "Database", color: "#10b981" },
  { id: "code", name: "Code Terminal", x: 750, y: 180, icon: "Cpu", color: "#8b5cf6" },
  { id: "support", name: "Support Console", x: 250, y: 450, icon: "Server", color: "#f59e0b" },
  { id: "research", name: "Research Lab", x: 550, y: 480, icon: "Workflow", color: "#ec4899" },
  { id: "command", name: "Command Node", x: 800, y: 500, icon: "Radio", color: "#06b6d4" },
];

const TASKS = [
  "Processing incoming requests", "Analyzing system metrics", "Optimizing workflows",
  "Reviewing documentation", "Coordinating tasks", "Gathering insights",
  "Synchronizing data", "Planning sprints", "Monitoring performance", "Generating reports",
];

const ROOM_W = 900;
const ROOM_H = 600;
const SYNC_CENTER = { x: 450, y: 350 };

// ─── 3D Robot Component ─────────────────────────────────
function Agent3D({ agent, isCollaborating, onHover }) {
  const [hovered, setHovered] = useState(false);
  const AgentIcon = IconMap[agent.icon];
  const st = agent.status;

  const antennaColor = st === "working" ? "#22c55e" : st === "collaborating" ? "#3b82f6" : st === "thinking" ? "#a855f7" : "#9ca3af";

  return (
    <motion.div
      className="absolute"
      style={{
        left: 0, top: 0, x: agent.position.x - 16, y: agent.position.y - 24,
        transformStyle: "preserve-3d", zIndex: Math.round(agent.position.y),
        cursor: "pointer",
      }}
      animate={{ scale: hovered ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => { setHovered(true); onHover?.(agent.id); }}
      onMouseLeave={() => { setHovered(false); onHover?.(null); }}
    >
      {/* Trail */}
      {agent.trail?.map((t, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: 2, height: 2, left: t.x - agent.position.x + 16, top: t.y - agent.position.y + 24,
          background: agent.color, opacity: (i / 15) * 0.6, transform: "translateZ(2px)",
        }} />
      ))}

      {/* Shadow */}
      <div className="absolute" style={{
        width: 48, height: 32, left: -8, top: 20, borderRadius: "50%",
        background: "rgba(0,0,0,0.6)", filter: "blur(6px)", transform: "translateZ(-20px)",
      }} />

      {/* Glow */}
      {(st === "working" || st === "collaborating") && (
        <motion.div className="absolute rounded-full" style={{
          width: 56, height: 56, left: -12, top: -8, background: agent.color, filter: "blur(12px)",
          transform: "translateZ(0px)",
        }} animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }} />
      )}

      {/* Legs */}
      <div className="absolute flex gap-1" style={{ left: 6, top: 28, transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>
        {[0, 1].map(i => (
          <motion.div key={i} style={{
            width: 8, height: 20, background: agent.color, borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.5)", filter: `brightness(0.8)`,
          }} animate={st === "working" ? { scaleY: [1, 0.85, 1] } : {}}
            transition={st === "working" ? { duration: 0.5, repeat: Infinity, delay: i * 0.25 } : {}} />
        ))}
      </div>

      {/* Arms */}
      <div className="absolute" style={{ left: -6, top: 8, transform: "translateZ(12px)", transformStyle: "preserve-3d" }}>
        {[-1, 1].map(side => (
          <motion.div key={side} className="absolute" style={{
            width: 8, height: 16, background: agent.color, borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.5)", filter: "brightness(0.85)",
            left: side === -1 ? 0 : 36, top: 0, transformOrigin: "top center",
          }} animate={st === "collaborating" ? { rotateZ: [0, side * 20, 0] } : {}}
            transition={st === "collaborating" ? { duration: 0.7, repeat: Infinity } : {}} />
        ))}
      </div>

      {/* Body */}
      <div className="absolute" style={{ left: 0, top: 8, transformStyle: "preserve-3d", transform: "translateZ(15px)" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 4, background: agent.color,
          border: "2px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 20px ${agent.color}60`,
        }}>
          {AgentIcon && <AgentIcon size={16} color="white" style={{ filter: "drop-shadow(0 0 4px white)" }} />}
        </div>
        {/* Body top */}
        <div className="absolute" style={{
          width: 32, height: 12, top: -6, left: 0, borderRadius: "2px 2px 0 0",
          background: agent.color, filter: "brightness(1.3)", transformOrigin: "bottom",
          transform: "rotateX(90deg)",
        }} />
        {/* Body side */}
        <div className="absolute" style={{
          width: 12, height: 32, top: 0, left: 26, borderRadius: "0 2px 2px 0",
          background: agent.color, filter: "brightness(0.6)", transformOrigin: "left",
          transform: "rotateY(90deg)",
        }} />
      </div>

      {/* Head */}
      <motion.div className="absolute" style={{ left: 2, top: -6, transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
        animate={st === "collaborating" ? { y: [0, -3, 0] } : { y: 0 }}
        transition={st === "collaborating" ? { duration: 0.6, repeat: Infinity } : {}}>
        <div style={{
          width: 28, height: 24, borderRadius: 4, background: agent.color,
          border: "2px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6, boxShadow: `0 0 12px ${agent.color}40`,
        }}>
          {/* Eyes */}
          {[0, 1].map(i => (
            <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.1 }} />
          ))}
        </div>
        {/* Head top */}
        <div className="absolute" style={{
          width: 28, height: 10, top: -5, left: 0, background: agent.color,
          filter: "brightness(1.2)", transformOrigin: "bottom", transform: "rotateX(90deg)",
          borderRadius: "2px 2px 0 0",
        }} />
        {/* Head side */}
        <div className="absolute" style={{
          width: 10, height: 24, top: 0, left: 23, background: agent.color,
          filter: "brightness(0.7)", transformOrigin: "left", transform: "rotateY(90deg)",
          borderRadius: "0 2px 2px 0",
        }} />
      </motion.div>

      {/* Antenna */}
      <motion.div className="absolute" style={{
        left: 14, top: -20, width: 2, display: "flex", flexDirection: "column", alignItems: "center",
        transform: "translateZ(24px)",
      }} animate={st === "thinking" ? { height: [32, 48, 32] } : { height: 32 }}
        transition={st === "thinking" ? { duration: 1, repeat: Infinity } : {}}>
        <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.7)" }} />
        <motion.div style={{
          width: 6, height: 6, borderRadius: "50%", background: antennaColor,
          boxShadow: `0 0 8px ${antennaColor}`, flexShrink: 0,
        }} animate={st === "thinking" ? { scale: [1, 1.4, 1] } : {}}
          transition={st === "thinking" ? { duration: 1, repeat: Infinity } : {}} />
      </motion.div>

      {/* Name tag */}
      <div className="absolute" style={{
        left: -8, top: 52, width: 48, textAlign: "center", transform: "translateZ(25px)",
        background: "rgba(0,0,0,0.8)", border: `1px solid ${agent.color}`,
        borderRadius: 3, padding: "1px 3px", fontSize: 9, fontFamily: "monospace",
        color: agent.color, boxShadow: `0 0 6px ${agent.color}40`,
        whiteSpace: "nowrap",
      }}>
        {agent.name}
      </div>

      {/* Hover bubble */}
      {hovered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute" style={{
            bottom: 60, left: -30, width: 100, transform: "translateZ(40px)",
            background: "rgba(0,0,0,0.9)", border: `1px solid ${agent.color}`,
            borderRadius: 6, padding: 6, boxShadow: `0 0 12px ${agent.color}50`,
            pointerEvents: "none",
          }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: agent.color, fontWeight: "bold" }}>{agent.role}</div>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: "#22d3ee", marginTop: 2 }}>{agent.currentTask}</div>
          <div style={{
            position: "absolute", bottom: -5, left: "50%", marginLeft: -5,
            width: 10, height: 10, background: "rgba(0,0,0,0.9)",
            border: `1px solid ${agent.color}`, borderTop: "none", borderLeft: "none",
            transform: "rotate(45deg)",
          }} />
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Workstation 3D ─────────────────────────────────────
function Workstation3D({ station }) {
  const StIcon = IconMap[station.icon];
  return (
    <div className="absolute" style={{
      left: station.x - 32, top: station.y - 32,
      width: 64, height: 64, transformStyle: "preserve-3d",
    }}>
      {/* Front */}
      <motion.div style={{
        width: 64, height: 64, borderRadius: 6, transform: "translateZ(8px)",
        background: `${station.color}20`, border: `2px solid ${station.color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 20px ${station.color}60, inset 0 0 20px ${station.color}30`,
      }} animate={{ boxShadow: [`0 0 20px ${station.color}60, inset 0 0 20px ${station.color}30`, `0 0 30px ${station.color}80, inset 0 0 30px ${station.color}40`, `0 0 20px ${station.color}60, inset 0 0 20px ${station.color}30`] }}
        transition={{ duration: 2, repeat: Infinity }}>
        {StIcon && <StIcon size={32} color={station.color} style={{ filter: `drop-shadow(0 0 6px ${station.color})` }} />}
      </motion.div>

      {/* Top */}
      <div className="absolute" style={{
        width: 64, height: 32, top: -16, left: 0, borderRadius: "4px 4px 0 0",
        background: `${station.color}40`, filter: "brightness(1.4)",
        transformOrigin: "bottom", transform: "rotateX(90deg) translateZ(0px)",
      }} />

      {/* Side */}
      <div className="absolute" style={{
        width: 32, height: 64, top: 0, left: 48, borderRadius: "0 4px 4px 0",
        background: `${station.color}30`, filter: "brightness(0.8)",
        transformOrigin: "left", transform: "rotateY(90deg)",
      }} />

      {/* Label */}
      <div style={{
        position: "absolute", top: 70, left: -8, width: 80, textAlign: "center",
        transform: "translateZ(15px)", fontSize: 9, fontFamily: "monospace",
        color: station.color, background: "rgba(0,0,0,0.8)",
        border: `1px solid ${station.color}`, borderRadius: 3, padding: "2px 4px",
        boxShadow: `0 0 8px ${station.color}40`, whiteSpace: "nowrap",
      }}>
        {station.name}
      </div>
    </div>
  );
}

// ─── Sync Chamber ───────────────────────────────────────
function SyncChamber() {
  const corners = [[-10, -10], [110, -10], [-10, 110], [110, 110]];
  return (
    <div className="absolute" style={{
      left: SYNC_CENTER.x - 50, top: SYNC_CENTER.y - 50,
      width: 100, height: 100, transformStyle: "preserve-3d", transform: "translateZ(5px)",
    }}>
      <motion.div style={{
        width: 100, height: 100, borderRadius: "50%",
        border: "2px dashed #a855f7", boxShadow: "0 0 30px rgba(168,85,247,0.4)",
      }} animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity } }} />

      {corners.map(([cx, cy], i) => (
        <motion.div key={i} className="absolute" style={{
          left: cx, top: cy, width: 6, height: 6, borderRadius: "50%",
          background: "#a855f7", boxShadow: "0 0 8px #a855f7",
          transform: "translateZ(12px)",
        }} animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
      ))}

      <div style={{
        position: "absolute", top: 108, left: 10, width: 80, textAlign: "center",
        fontSize: 8, fontFamily: "monospace", color: "#a855f7",
        background: "rgba(0,0,0,0.7)", borderRadius: 3, padding: "1px 4px",
        border: "1px solid rgba(168,85,247,0.4)",
      }}>
        SYNC CHAMBER
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────
export default function AgentRoom3D() {
  // Camera
  const rotX = useMotionValue(60);
  const rotZ = useMotionValue(-45);
  const zoom = useMotionValue(1);
  const springX = useSpring(rotX, { stiffness: 100, damping: 30 });
  const springZ = useSpring(rotZ, { stiffness: 100, damping: 30 });
  const springZoom = useSpring(zoom, { stiffness: 100, damping: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, rX: 0, rZ: 0 });
  const [camDisplay, setCamDisplay] = useState({ x: 60, z: -45, zoom: 100 });

  // Agents
  const [agents, setAgents] = useState(() =>
    AGENT_DEFS.map(d => ({
      ...d, position: { ...d.initPos }, status: "idle",
      currentTask: d.defaultTask, trail: [],
    }))
  );
  const [collabPairs, setCollabPairs] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const agentRef = useRef(agents);
  agentRef.current = agents;
  const [hoveredAgent, setHoveredAgent] = useState(null);

  // Camera controls
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest?.("[data-no-drag]")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rX: rotX.get(), rZ: rotZ.get() };
  }, [rotX, rotZ]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x) * 0.3;
    const dy = (e.clientY - dragStart.current.y) * 0.3;
    const newX = Math.max(20, Math.min(80, dragStart.current.rX - dy));
    rotX.set(newX);
    rotZ.set(dragStart.current.rZ - dx);
    setCamDisplay({ x: Math.round(newX), z: Math.round(rotZ.get()), zoom: Math.round(zoom.get() * 100) });
  }, [isDragging, rotX, rotZ, zoom]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const newZ = Math.max(0.5, Math.min(1.5, zoom.get() - e.deltaY * 0.001));
    zoom.set(newZ);
    setCamDisplay(p => ({ ...p, zoom: Math.round(newZ * 100) }));
  }, [zoom]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  // Trail update
  useEffect(() => {
    const iv = setInterval(() => {
      setAgents(prev => prev.map(a => ({
        ...a, trail: [...(a.trail || []).slice(-14), { x: a.position.x, y: a.position.y }],
      })));
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // Movement
  useEffect(() => {
    const iv = setInterval(() => {
      setAgents(prev => prev.map(a => {
        if (a.status === "collaborating") return a;
        if (Math.random() > 0.3) return a;
        const ws = WORKSTATIONS[Math.floor(Math.random() * WORKSTATIONS.length)];
        let tx = ws.x + (Math.random() - 0.5) * 25;
        let ty = ws.y + (Math.random() - 0.5) * 25;
        // Collision avoidance
        for (let attempt = 0; attempt < 8; attempt++) {
          const collision = prev.some(o => o.id !== a.id &&
            Math.hypot(o.position.x - tx, o.position.y - ty) < 40);
          if (!collision) break;
          const angle = (attempt / 8) * Math.PI * 2;
          const r = 30 + attempt * 8;
          tx = ws.x + Math.cos(angle) * r;
          ty = ws.y + Math.sin(angle) * r;
        }
        tx = Math.max(80, Math.min(ROOM_W - 80, tx));
        ty = Math.max(80, Math.min(ROOM_H - 80, ty));
        const task = TASKS[Math.floor(Math.random() * TASKS.length)];
        const statuses = ["working", "thinking", "idle"];
        return { ...a, position: { x: tx, y: ty }, status: statuses[Math.floor(Math.random() * statuses.length)], currentTask: task };
      }));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // Collaboration
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.4) return;
      const curr = agentRef.current;
      const available = curr.filter(a => a.status !== "collaborating");
      if (available.length < 2) return;
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      const [a1, a2] = [shuffled[0], shuffled[1]];

      setAgents(prev => prev.map(a => {
        if (a.id === a1.id) return { ...a, status: "collaborating", position: { x: 400, y: 350 }, currentTask: `Syncing with ${a2.name}` };
        if (a.id === a2.id) return { ...a, status: "collaborating", position: { x: 500, y: 350 }, currentTask: `Syncing with ${a1.name}` };
        return a;
      }));
      setCollabPairs([{ id1: a1.id, id2: a2.id, color: a1.color }]);
      const now = new Date().toLocaleTimeString();
      setActivityLog(prev => [`${a1.name} ⇄ ${a2.name} synced at ${now}`, ...prev].slice(0, 6));

      setTimeout(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === a1.id || a.id === a2.id) return { ...a, status: "idle" };
          return a;
        }));
        setCollabPairs([]);
      }, 3500);
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  const workingCount = agents.filter(a => a.status === "working" || a.status === "collaborating").length;

  // Camera display sync
  useEffect(() => {
    const unsubs = [
      springX.on("change", v => setCamDisplay(p => ({ ...p, x: Math.round(v) }))),
      springZ.on("change", v => setCamDisplay(p => ({ ...p, z: Math.round(v) }))),
      springZoom.on("change", v => setCamDisplay(p => ({ ...p, zoom: Math.round(v * 100) }))),
    ];
    return () => unsubs.forEach(u => u());
  }, [springX, springZ, springZoom]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab", fontFamily: "monospace" }}
      onMouseDown={handleMouseDown} onWheel={handleWheel}>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3" style={{
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(6,182,212,0.3)",
        boxShadow: "0 4px 20px rgba(6,182,212,0.1)",
      }}>
        <div className="flex items-center gap-3">
          <Zap size={20} color="#22d3ee" style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }} />
          <div>
            <h1 className="text-xl font-bold" style={{
              background: "linear-gradient(to right, #22d3ee, #3b82f6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              OpenClaw Agent Command Center
            </h1>
            <p style={{ fontSize: 12, color: "rgba(103,232,249,0.7)" }}>
              Neural Network Monitoring System v3.0 • Drag to rotate • Scroll to zoom
            </p>
          </div>
        </div>
        <div className="flex gap-3" data-no-drag>
          <div style={{
            background: "rgba(0,0,0,0.8)", border: "1px solid rgba(6,182,212,0.5)",
            borderRadius: 8, padding: "6px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: "rgba(34,211,238,0.7)" }}>Active</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#22d3ee", textShadow: "0 0 10px #22d3ee" }}>{agents.length}</div>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.8)", border: "1px solid rgba(34,197,94,0.5)",
            borderRadius: 8, padding: "6px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: "rgba(34,197,94,0.7)" }}>Working</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#22c55e", textShadow: "0 0 10px #22c55e" }}>{workingCount}</div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex h-full">

        {/* 3D Viewport */}
        <div className="flex-1 flex items-center justify-center relative" style={{ perspective: 1500 }}>
          {/* Camera info */}
          <div className="absolute top-3 left-3 z-20" data-no-drag style={{
            background: "rgba(0,0,0,0.7)", border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: 6, padding: "4px 10px", fontSize: 10, color: "rgba(34,211,238,0.7)",
            opacity: isDragging ? 0.5 : 1, transition: "opacity 0.3s",
          }}>
            X: {camDisplay.x}° Z: {camDisplay.z}° Zoom: {camDisplay.zoom}%
          </div>

          <div className="absolute bottom-20 left-3 z-20" data-no-drag style={{
            fontSize: 10, color: "rgba(34,211,238,0.5)",
            opacity: isDragging ? 0.5 : 1, transition: "opacity 0.3s",
          }}>
            🎮 Drag to Rotate | 🖱️ Scroll to Zoom
          </div>

          {/* 3D Room */}
          <motion.div style={{
            width: ROOM_W, height: ROOM_H, transformStyle: "preserve-3d", position: "relative",
            rotateX: springX, rotateZ: springZ, scale: springZoom,
          }}>
            {/* Base floor */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(135deg, #0f172a, #000, #0f172a)",
              transform: "translateZ(-40px)", borderRadius: 8,
              boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
            }} />

            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              animation: "gridScroll 20s linear infinite",
              transform: "translateZ(0px)", borderRadius: 8,
            }} />

            {/* Circuit overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, rgba(6,182,212,0.2) 1px, transparent 1px)`,
              backgroundSize: "100px 100px", transform: "translateZ(5px)",
              opacity: 0.2, borderRadius: 8,
            }} />

            {/* Room border glow */}
            <div className="absolute inset-0" style={{
              border: "1px solid rgba(6,182,212,0.25)", borderRadius: 8,
              boxShadow: "inset 0 0 40px rgba(6,182,212,0.05), 0 0 20px rgba(6,182,212,0.1)",
              transform: "translateZ(1px)",
            }} />

            {/* Workstations */}
            {WORKSTATIONS.map(ws => <Workstation3D key={ws.id} station={ws} />)}

            {/* Sync Chamber */}
            <SyncChamber />

            {/* Agents */}
            {agents.map(a => (
              <Agent3D key={a.id} agent={a}
                isCollaborating={collabPairs.some(p => p.id1 === a.id || p.id2 === a.id)}
                onHover={setHoveredAgent} />
            ))}

            {/* Collaboration Lines */}
            {collabPairs.map((pair, i) => {
              const a1 = agents.find(a => a.id === pair.id1);
              const a2 = agents.find(a => a.id === pair.id2);
              if (!a1 || !a2) return null;
              return (
                <svg key={i} className="absolute inset-0" style={{
                  width: ROOM_W, height: ROOM_H, transform: "translateZ(18px)",
                  pointerEvents: "none", overflow: "visible",
                }}>
                  <motion.line
                    x1={a1.position.x} y1={a1.position.y}
                    x2={a2.position.x} y2={a2.position.y}
                    stroke={pair.color} strokeWidth={3}
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
              );
            })}
          </motion.div>
        </div>

        {/* Activity Feed */}
        <div className="flex-shrink-0" data-no-drag style={{
          width: 280, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          borderLeft: "1px solid rgba(6,182,212,0.3)", padding: 16,
          display: "flex", flexDirection: "column", gap: 12, overflowY: "auto",
        }}>
          {/* Log header */}
          <div className="flex items-center gap-2">
            <Activity size={16} color="#22d3ee" style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }} />
            <span style={{ fontSize: 16, fontWeight: "bold", color: "#22d3ee" }}>System Log</span>
          </div>

          {/* Log entries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 80 }}>
            {activityLog.length === 0 ? (
              <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>Monitoring neural activity...</div>
            ) : activityLog.map((log, i) => (
              <motion.div key={`${log}-${i}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }} style={{
                  background: "rgba(0,0,0,0.6)", border: "1px solid rgba(6,182,212,0.3)",
                  borderRadius: 6, padding: "6px 8px",
                }}>
                <div style={{ fontSize: 11, color: "#22d3ee", fontFamily: "monospace" }}>{log}</div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(6,182,212,0.2)" }} />

          {/* Agent Roster */}
          <div>
            <div style={{ fontSize: 10, color: "#22d3ee", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>AGENT ROSTER</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {agents.map(a => (
                <div key={a.id} className="flex items-center gap-2">
                  <motion.div style={{
                    width: 8, height: 8, borderRadius: "50%", background: a.color,
                    boxShadow: `0 0 6px ${a.color}`, flexShrink: 0,
                  }} animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: a.color }}>{a.name}</div>
                    <div style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(34,211,238,0.5)" }}>{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(6,182,212,0.2)" }} />

          {/* Status Key */}
          <div>
            <div style={{ fontSize: 10, color: "#22d3ee", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>STATUS KEY</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { label: "WORKING", color: "#22c55e" },
                { label: "SYNCING", color: "#3b82f6" },
                { label: "THINKING", color: "#a855f7" },
                { label: "IDLE", color: "#9ca3af" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", background: s.color,
                    boxShadow: `0 0 4px ${s.color}`, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid animation keyframes */}
      <style>{`
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>
    </div>
  );
}
