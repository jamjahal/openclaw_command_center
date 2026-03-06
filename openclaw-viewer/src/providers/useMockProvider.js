import { useState, useEffect, useRef, useCallback } from "react";
import {
  DEFAULT_AGENT_DEFS, DEFAULT_WORKSTATIONS,
  ROOM_W, ROOM_H, SYNC_CENTER,
} from "./types";

// ─── Task Pool ──────────────────────────────────────────
const TASKS = [
  "Processing incoming requests", "Analyzing system metrics", "Optimizing workflows",
  "Reviewing documentation", "Coordinating tasks", "Gathering insights",
  "Synchronizing data", "Planning sprints", "Monitoring performance", "Generating reports",
];

/**
 * Mock data provider — drives the demo visualization with randomized
 * agent movement, collaboration events, and activity logging.
 *
 * Returns the same ProviderState shape as any live provider would,
 * so the visualization component doesn't know or care which provider
 * is active.
 *
 * @param {Object} [options]
 * @param {number} [options.moveInterval=5000] - ms between movement ticks
 * @param {number} [options.collabInterval=8000] - ms between collab checks
 * @param {number} [options.moveChance=0.3] - probability agent moves per tick
 * @param {number} [options.collabChance=0.4] - probability collab fires per tick
 * @param {number} [options.collabDuration=3500] - ms agents stay in sync chamber
 * @param {number} [options.trailInterval=100] - ms between trail snapshots
 * @returns {import("./types").ProviderState}
 */
export function useMockProvider(options = {}) {
  const {
    moveInterval = 5000,
    collabInterval = 8000,
    moveChance = 0.3,
    collabChance = 0.4,
    collabDuration = 3500,
    trailInterval = 100,
  } = options;

  const workstations = DEFAULT_WORKSTATIONS;

  const [agents, setAgents] = useState(() =>
    DEFAULT_AGENT_DEFS.map(d => ({
      ...d,
      position: { ...d.initPos },
      status: "idle",
      currentTask: d.defaultTask,
      trail: [],
    }))
  );

  const [collabPairs, setCollabPairs] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const agentRef = useRef(agents);
  agentRef.current = agents;

  // ── Trail snapshots ─────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setAgents(prev =>
        prev.map(a => ({
          ...a,
          trail: [...(a.trail || []).slice(-14), { x: a.position.x, y: a.position.y }],
        }))
      );
    }, trailInterval);
    return () => clearInterval(iv);
  }, [trailInterval]);

  // ── Random movement ─────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setAgents(prev =>
        prev.map(a => {
          if (a.status === "collaborating") return a;
          if (Math.random() > moveChance) return a;

          const ws = workstations[Math.floor(Math.random() * workstations.length)];
          let tx = ws.x + (Math.random() - 0.5) * 25;
          let ty = ws.y + (Math.random() - 0.5) * 25;

          // Collision avoidance
          for (let attempt = 0; attempt < 8; attempt++) {
            const collision = prev.some(
              o => o.id !== a.id && Math.hypot(o.position.x - tx, o.position.y - ty) < 40
            );
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

          return {
            ...a,
            position: { x: tx, y: ty },
            status: statuses[Math.floor(Math.random() * statuses.length)],
            currentTask: task,
          };
        })
      );
    }, moveInterval);
    return () => clearInterval(iv);
  }, [moveInterval, moveChance, workstations]);

  // ── Collaboration events ────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > collabChance) return;

      const curr = agentRef.current;
      const available = curr.filter(a => a.status !== "collaborating");
      if (available.length < 2) return;

      const shuffled = [...available].sort(() => Math.random() - 0.5);
      const [a1, a2] = [shuffled[0], shuffled[1]];

      setAgents(prev =>
        prev.map(a => {
          if (a.id === a1.id)
            return { ...a, status: "collaborating", position: { x: SYNC_CENTER.x - 50, y: SYNC_CENTER.y }, currentTask: `Syncing with ${a2.name}` };
          if (a.id === a2.id)
            return { ...a, status: "collaborating", position: { x: SYNC_CENTER.x + 50, y: SYNC_CENTER.y }, currentTask: `Syncing with ${a1.name}` };
          return a;
        })
      );

      setCollabPairs([{ id1: a1.id, id2: a2.id, color: a1.color }]);

      const now = new Date().toLocaleTimeString();
      setActivityLog(prev =>
        [`${a1.name} ⇄ ${a2.name} synced at ${now}`, ...prev].slice(0, 6)
      );

      setTimeout(() => {
        setAgents(prev =>
          prev.map(a => {
            if (a.id === a1.id || a.id === a2.id) return { ...a, status: "idle" };
            return a;
          })
        );
        setCollabPairs([]);
      }, collabDuration);
    }, collabInterval);
    return () => clearInterval(iv);
  }, [collabInterval, collabChance, collabDuration]);

  return {
    agents,
    collabPairs,
    activityLog,
    workstations,
    mode: "demo",
    connected: true,
  };
}
