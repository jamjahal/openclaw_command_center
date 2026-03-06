import { useState, useEffect, useRef, useCallback } from "react";
import {
  DEFAULT_AGENT_DEFS, DEFAULT_WORKSTATIONS,
  ROOM_W, ROOM_H, SYNC_CENTER,
} from "./types";

/**
 * Live data provider — connects to an OpenClaw backend via WebSocket
 * and translates real agent events into the same ProviderState shape
 * the visualization expects.
 *
 * ─── Integration Guide ──────────────────────────────────
 *
 * Your OpenClaw backend needs to expose a WebSocket endpoint that sends
 * JSON messages. This provider expects the following message types:
 *
 *   1. AGENT_UPDATE — an agent changed state
 *      {
 *        type: "AGENT_UPDATE",
 *        agent: {
 *          id: string,           // must match an agent ID
 *          status: "idle" | "working" | "collaborating" | "thinking",
 *          currentTask: string,  // human-readable task description
 *          position?: { x, y }, // optional — provider auto-assigns if missing
 *        }
 *      }
 *
 *   2. COLLABORATION_START — two agents begin syncing
 *      {
 *        type: "COLLABORATION_START",
 *        agent1Id: string,
 *        agent2Id: string,
 *      }
 *
 *   3. COLLABORATION_END — collaboration finished
 *      {
 *        type: "COLLABORATION_END",
 *        agent1Id: string,
 *        agent2Id: string,
 *      }
 *
 *   4. LOG — activity log entry
 *      {
 *        type: "LOG",
 *        message: string,
 *      }
 *
 *   5. AGENT_REGISTER — a new agent comes online (dynamic fleet)
 *      {
 *        type: "AGENT_REGISTER",
 *        agent: { id, name, role, color, icon },
 *      }
 *
 *   6. AGENT_DEREGISTER — an agent goes offline
 *      {
 *        type: "AGENT_DEREGISTER",
 *        agentId: string,
 *      }
 *
 * ─── Position Mapping ───────────────────────────────────
 *
 * If your backend doesn't send positions, this provider auto-maps agents
 * to workstations. When an agent's task changes, it moves to the nearest
 * available station. You can override this by sending explicit positions.
 *
 * ─── Usage ──────────────────────────────────────────────
 *
 *   import { useLiveProvider } from "./providers/useLiveProvider";
 *
 *   // In your component:
 *   const data = useLiveProvider({
 *     url: "ws://localhost:8080/agents",
 *     // Optional: provide agent definitions if your fleet is fixed
 *     agentDefs: [...],
 *   });
 *
 * @param {Object} options
 * @param {string} options.url - WebSocket endpoint URL
 * @param {Array} [options.agentDefs] - Initial agent definitions (uses defaults if omitted)
 * @param {Array} [options.workstationDefs] - Workstation layout (uses defaults if omitted)
 * @param {number} [options.reconnectDelay=3000] - ms between reconnect attempts
 * @param {number} [options.trailInterval=100] - ms between trail snapshots
 * @returns {import("./types").ProviderState}
 */
export function useLiveProvider(options = {}) {
  const {
    url,
    agentDefs = DEFAULT_AGENT_DEFS,
    workstationDefs = DEFAULT_WORKSTATIONS,
    reconnectDelay = 3000,
    trailInterval = 100,
  } = options;

  const workstations = workstationDefs;

  const [agents, setAgents] = useState(() =>
    agentDefs.map(d => ({
      ...d,
      position: { ...d.initPos },
      status: "idle",
      currentTask: d.defaultTask || "Initializing...",
      trail: [],
    }))
  );

  const [collabPairs, setCollabPairs] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // ── Auto-position: assign agent to a workstation ────
  const autoPosition = useCallback(
    (agentId, agents) => {
      // Find a workstation that doesn't already have an agent nearby
      const taken = new Set();
      agents.forEach(a => {
        if (a.id === agentId) return;
        const closest = workstations.reduce((best, ws) => {
          const d = Math.hypot(a.position.x - ws.x, a.position.y - ws.y);
          return d < best.d ? { ws, d } : best;
        }, { ws: null, d: Infinity });
        if (closest.d < 60) taken.add(closest.ws.id);
      });

      const available = workstations.filter(ws => !taken.has(ws.id));
      const target = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : workstations[Math.floor(Math.random() * workstations.length)];

      return {
        x: Math.max(80, Math.min(ROOM_W - 80, target.x + (Math.random() - 0.5) * 20)),
        y: Math.max(80, Math.min(ROOM_H - 80, target.y + (Math.random() - 0.5) * 20)),
      };
    },
    [workstations]
  );

  // ── Message handler ─────────────────────────────────
  const handleMessage = useCallback(
    (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        console.warn("[LiveProvider] Invalid JSON:", event.data);
        return;
      }

      switch (msg.type) {
        case "AGENT_UPDATE":
          setAgents(prev =>
            prev.map(a => {
              if (a.id !== msg.agent.id) return a;
              const position = msg.agent.position || autoPosition(a.id, prev);
              return {
                ...a,
                status: msg.agent.status || a.status,
                currentTask: msg.agent.currentTask || a.currentTask,
                position,
              };
            })
          );
          break;

        case "COLLABORATION_START": {
          const { agent1Id, agent2Id } = msg;
          setAgents(prev =>
            prev.map(a => {
              if (a.id === agent1Id)
                return { ...a, status: "collaborating", position: { x: SYNC_CENTER.x - 50, y: SYNC_CENTER.y }, currentTask: `Syncing with ${prev.find(o => o.id === agent2Id)?.name || agent2Id}` };
              if (a.id === agent2Id)
                return { ...a, status: "collaborating", position: { x: SYNC_CENTER.x + 50, y: SYNC_CENTER.y }, currentTask: `Syncing with ${prev.find(o => o.id === agent1Id)?.name || agent1Id}` };
              return a;
            })
          );
          const a1 = agents.find(a => a.id === agent1Id);
          setCollabPairs([{ id1: agent1Id, id2: agent2Id, color: a1?.color || "#06b6d4" }]);
          break;
        }

        case "COLLABORATION_END": {
          const { agent1Id, agent2Id } = msg;
          setAgents(prev =>
            prev.map(a => {
              if (a.id === agent1Id || a.id === agent2Id)
                return { ...a, status: "idle" };
              return a;
            })
          );
          setCollabPairs([]);
          break;
        }

        case "LOG":
          setActivityLog(prev => [msg.message, ...prev].slice(0, 6));
          break;

        case "AGENT_REGISTER":
          setAgents(prev => {
            if (prev.find(a => a.id === msg.agent.id)) return prev;
            const pos = autoPosition(msg.agent.id, prev);
            return [
              ...prev,
              {
                ...msg.agent,
                position: pos,
                status: "idle",
                currentTask: "Coming online...",
                trail: [],
                initPos: pos,
                defaultTask: "Awaiting assignment",
              },
            ];
          });
          break;

        case "AGENT_DEREGISTER":
          setAgents(prev => prev.filter(a => a.id !== msg.agentId));
          break;

        default:
          console.warn("[LiveProvider] Unknown message type:", msg.type);
      }
    },
    [autoPosition, agents]
  );

  // ── WebSocket connection ────────────────────────────
  useEffect(() => {
    if (!url) return;

    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[LiveProvider] Connected to", url);
        setConnected(true);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        console.log("[LiveProvider] Disconnected. Reconnecting in", reconnectDelay, "ms");
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, reconnectDelay);
      };

      ws.onerror = (err) => {
        console.error("[LiveProvider] WebSocket error:", err);
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [url, reconnectDelay, handleMessage]);

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

  return {
    agents,
    collabPairs,
    activityLog,
    workstations,
    mode: "live",
    connected,
  };
}
