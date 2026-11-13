import React, { useMemo, useState } from 'react';
import { Volume2, Navigation, ShieldAlert, Radio } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isBeacon?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

const NODES: GraphNode[] = [
  { id: 'A', label: 'Elevator Lobby', x: 56, y: 60, isBeacon: true },
  { id: 'B', label: 'Atrium Hub', x: 180, y: 60, isBeacon: true },
  { id: 'C', label: 'Vision Lab', x: 320, y: 60 },
  { id: 'D', label: 'North Corridor', x: 118, y: 145 },
  { id: 'E', label: 'Central Junction', x: 248, y: 145, isBeacon: true },
  { id: 'F', label: 'Robotics Bay', x: 374, y: 145 },
  { id: 'G', label: 'Stairwell West', x: 56, y: 228 },
  { id: 'H', label: 'Seminar Hall', x: 180, y: 228, isBeacon: true },
  { id: 'I', label: 'Research Wing', x: 320, y: 228 },
];

const EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 12 },
  { from: 'B', to: 'C', weight: 14 },
  { from: 'A', to: 'D', weight: 10 },
  { from: 'B', to: 'D', weight: 10 },
  { from: 'B', to: 'E', weight: 11 },
  { from: 'C', to: 'E', weight: 11 },
  { from: 'C', to: 'F', weight: 10 },
  { from: 'D', to: 'E', weight: 13 },
  { from: 'E', to: 'F', weight: 12 },
  { from: 'D', to: 'G', weight: 10 },
  { from: 'D', to: 'H', weight: 10 },
  { from: 'E', to: 'H', weight: 11 },
  { from: 'E', to: 'I', weight: 11 },
  { from: 'F', to: 'I', weight: 10 },
  { from: 'G', to: 'H', weight: 12 },
  { from: 'H', to: 'I', weight: 14 },
];

function computeDijkstra(
  startId: string,
  endId: string,
  blockedNodeId: string | null
): { path: string[]; totalMeters: number } {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const node of NODES) {
    if (node.id === blockedNodeId && node.id !== startId && node.id !== endId) {
      continue;
    }
    distances[node.id] = node.id === startId ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }

  while (unvisited.size > 0) {
    let current: string | null = null;
    let smallest = Infinity;
    for (const id of unvisited) {
      if (distances[id] < smallest) {
        smallest = distances[id];
        current = id;
      }
    }

    if (current === null || current === endId || smallest === Infinity) {
      break;
    }

    unvisited.delete(current);

    for (const edge of EDGES) {
      const neighbor =
        edge.from === current ? edge.to : edge.to === current ? edge.from : null;
      if (!neighbor || !unvisited.has(neighbor)) continue;

      const alt = distances[current] + edge.weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  const path: string[] = [];
  let step: string | null = endId;
  if (distances[endId] === Infinity || distances[endId] === undefined) {
    return { path: [], totalMeters: 0 };
  }
  while (step) {
    path.unshift(step);
    step = previous[step];
  }
  return { path, totalMeters: distances[endId] };
}

export const IndoorNavLab: React.FC = () => {
  const [floor, setFloor] = useState<number>(4);
  const [startId, setStartId] = useState<string>('A');
  const [endId, setEndId] = useState<string>('I');
  const [obstacleEnabled, setObstacleEnabled] = useState<boolean>(true);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('end');

  const blockedNode = obstacleEnabled ? 'E' : null;

  const { path, totalMeters } = useMemo(
    () => computeDijkstra(startId, endId, blockedNode),
    [startId, endId, blockedNode]
  );

  const handleNodeClick = (id: string) => {
    if (id === blockedNode) return;
    if (selectionMode === 'start') {
      if (id !== endId) setStartId(id);
      setSelectionMode('end');
    } else {
      if (id !== startId) setEndId(id);
    }
  };

  const pathEdges = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      set.add(`${a}-${b}`);
      set.add(`${b}-${a}`);
    }
    return set;
  }, [path]);

  const ttsCue = useMemo(() => {
    if (path.length < 2) return 'Select two reachable nodes to compute route.';
    const nextNode = NODES.find((n) => n.id === path[1]);
    const destNode = NODES.find((n) => n.id === endId);
    const obstacleSuffix = obstacleEnabled
      ? ' Obstacle detected near Central Junction — rerouted via Corridor.'
      : '';
    return `Floor ${floor}: Proceed ${totalMeters}m toward ${nextNode?.label ?? 'next waypoint'}, continuing to ${destNode?.label ?? 'destination'}.${obstacleSuffix}`;
  }, [path, floor, totalMeters, endId, obstacleEnabled]);

  const startLabel = NODES.find((n) => n.id === startId)?.label ?? startId;
  const endLabel = NODES.find((n) => n.id === endId)?.label ?? endId;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#E4E6EB] bg-white p-5 sm:p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECEEF2] pb-4">
          <div>
            <p className="text-xs font-medium text-[#646B78]">
              Interactive Navigation Demo · Dijkstra + BLE RSSI + YOLOv8
            </p>
            <h2 className="mt-0.5 text-base font-semibold tracking-tight text-[#111315]">
              Multi-Floor Spatial Graph Simulator
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[#F3F4F6] p-1">
            {[1, 2, 4, 6, 8].map((fl) => (
              <button
                key={fl}
                type="button"
                onClick={() => setFloor(fl)}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                  floor === fl
                    ? 'bg-white text-[#111315] shadow-xs'
                    : 'text-[#525866] hover:text-[#111315]'
                }`}
              >
                F{fl}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectionMode('start')}
              className={`whitespace-nowrap shrink-0 rounded-md border px-2.5 py-1.5 font-medium transition-colors ${
                selectionMode === 'start'
                  ? 'border-[#111315] bg-[#111315] text-white'
                  : 'border-[#E4E6EB] bg-white text-[#3F4552] hover:bg-[#F7F7F8]'
              }`}
            >
              Origin: {startLabel}
            </button>
            <button
              type="button"
              onClick={() => setSelectionMode('end')}
              className={`whitespace-nowrap shrink-0 rounded-md border px-2.5 py-1.5 font-medium transition-colors ${
                selectionMode === 'end'
                  ? 'border-[#990000] bg-[#990000] text-white'
                  : 'border-[#E4E6EB] bg-white text-[#3F4552] hover:bg-[#F7F7F8]'
              }`}
            >
              Target: {endLabel}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setObstacleEnabled((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border px-2.5 py-1.5 font-medium transition-colors ${
              obstacleEnabled
                ? 'border-[#990000]/30 bg-[#990000]/8 text-[#990000]'
                : 'border-[#E4E6EB] bg-white text-[#525866] hover:text-[#111315]'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            {obstacleEnabled ? 'YOLOv8 Obstacle Active' : 'Simulate Obstacle'}
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[#ECEEF2] bg-[#FAFAFB]">
          <svg
            viewBox="0 0 430 278"
            className="h-auto w-full select-none"
            role="img"
            aria-label="Interactive floor graph showing BLE beacon nodes, Dijkstra shortest path, and YOLOv8 obstacle detection"
          >
            <defs>
              <pattern
                id="floorGrid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="#E8EAEE"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="430" height="278" fill="url(#floorGrid)" />

            <text
              x="16"
              y="22"
              className="fill-[#7A818E] font-mono text-[10px]"
            >
              FLOOR 0{floor} · CLICK ANY NODE TO SET {selectionMode.toUpperCase()}
            </text>

            {EDGES.map((edge) => {
              const fromNode = NODES.find((n) => n.id === edge.from)!;
              const toNode = NODES.find((n) => n.id === edge.to)!;
              const isActive = pathEdges.has(`${edge.from}-${edge.to}`);
              const isBlocked =
                blockedNode &&
                (edge.from === blockedNode || edge.to === blockedNode);

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={
                      isActive
                        ? '#990000'
                        : isBlocked
                          ? '#E5E7EB'
                          : '#CBD1DC'
                    }
                    strokeWidth={isActive ? 3 : 1.5}
                    strokeDasharray={isBlocked ? '4 4' : undefined}
                    className="transition-all duration-200"
                  />
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 4}
                    textAnchor="middle"
                    className={`font-mono text-[9px] ${
                      isActive ? 'fill-[#990000] font-medium' : 'fill-[#8D95A3]'
                    }`}
                  >
                    {edge.weight}m
                  </text>
                </g>
              );
            })}

            {NODES.map((node) => {
              const isStart = node.id === startId;
              const isEnd = node.id === endId;
              const isOnPath = path.includes(node.id);
              const isBlocked = node.id === blockedNode;

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className={isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                >
                  {node.isBeacon && !isBlocked && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={18}
                      fill="none"
                      stroke="#990000"
                      strokeOpacity="0.16"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  )}

                  {isBlocked ? (
                    <g>
                      <rect
                        x={node.x - 16}
                        y={node.y - 16}
                        width="32"
                        height="32"
                        rx="4"
                        fill="#FEF2F2"
                        stroke="#990000"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      <text
                        x={node.x}
                        y={node.y - 21}
                        textAnchor="middle"
                        className="fill-[#990000] font-mono text-[8.5px] font-medium"
                      >
                        OBSTACLE 0.96
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 3}
                        textAnchor="middle"
                        className="fill-[#990000] font-mono text-[9px] font-semibold"
                      >
                        YOLO
                      </text>
                    </g>
                  ) : (
                    <g>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isStart || isEnd ? 13 : 10}
                        fill={
                          isStart
                            ? '#111315'
                            : isEnd
                              ? '#990000'
                              : isOnPath
                                ? '#FFFFFF'
                                : '#FFFFFF'
                        }
                        stroke={
                          isStart
                            ? '#111315'
                            : isEnd
                              ? '#990000'
                              : isOnPath
                                ? '#990000'
                                : '#9BA3B0'
                        }
                        strokeWidth={isOnPath ? 2.2 : 1.5}
                      />
                      <text
                        x={node.x}
                        y={node.y + 3.5}
                        textAnchor="middle"
                        className={`font-mono text-[10px] font-semibold ${
                          isStart || isEnd ? 'fill-white' : 'fill-[#111315]'
                        }`}
                      >
                        {node.id}
                      </text>
                    </g>
                  )}

                  <text
                    x={node.x}
                    y={node.y + 26}
                    textAnchor="middle"
                    className={`text-[9.5px] font-medium ${
                      isOnPath ? 'fill-[#111315]' : 'fill-[#646B78]'
                    }`}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-[#ECEEF2] pt-4">
        <div className="flex items-start gap-2.5 text-xs text-[#3F4552]">
          <Volume2
            className="mt-0.5 h-4 w-4 shrink-0 text-[#990000]"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            <span className="font-semibold text-[#111315]">TTS Guidance: </span>
            {ttsCue}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-[#ECEEF2] pt-3 font-mono text-xs">
          <div>
            <span className="block text-[11px] text-[#646B78]">Route Hops</span>
            <span className="mt-0.5 flex items-center gap-1 font-medium text-[#111315]">
              <Navigation className="h-3 w-3 text-[#990000]" aria-hidden="true" />
              {path.join(' → ')}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-[#646B78]">Path Cost</span>
            <span className="mt-0.5 block font-medium text-[#111315]">
              {totalMeters} meters
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-[#646B78]">BLE Confidence</span>
            <span className="mt-0.5 flex items-center gap-1 font-medium text-[#111315]">
              <Radio className="h-3 w-3 text-[#990000]" aria-hidden="true" />
              98.0% RSSI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
