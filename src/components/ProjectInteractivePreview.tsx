import React, { useState } from 'react';
import { Check, Lock, RotateCcw, ShieldCheck } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { IndoorNavLab } from './IndoorNavLab';

interface PreviewProps {
  projectId: ProjectItem['id'];
  interactive?: boolean;
}

const PPE_CONDITIONS = {
  standard: {
    label: 'Standard Lighting',
    bgClass: 'bg-[#16191D]',
    overlayOpacity: 'opacity-100',
    detections: [
      { name: 'Hardhat', conf: '0.97', x: 138, y: 34, w: 66, h: 42 },
      { name: 'Safety Vest', conf: '0.96', x: 122, y: 92, w: 98, h: 86 },
      { name: 'Safety Boots', conf: '0.95', x: 130, y: 192, w: 82, h: 36 },
    ],
  },
  lowlight: {
    label: 'Low-Light Shift',
    bgClass: 'bg-[#0C0E12]',
    overlayOpacity: 'opacity-80',
    detections: [
      { name: 'Hardhat', conf: '0.95', x: 138, y: 34, w: 66, h: 42 },
      { name: 'Safety Vest', conf: '0.96', x: 122, y: 92, w: 98, h: 86 },
      { name: 'Safety Boots', conf: '0.92', x: 130, y: 192, w: 82, h: 36 },
    ],
  },
  glare: {
    label: 'Factory Glare',
    bgClass: 'bg-[#22262D]',
    overlayOpacity: 'opacity-90',
    detections: [
      { name: 'Hardhat', conf: '0.94', x: 138, y: 34, w: 66, h: 42 },
      { name: 'Safety Vest', conf: '0.95', x: 122, y: 92, w: 98, h: 86 },
      { name: 'Safety Boots', conf: '0.91', x: 130, y: 192, w: 82, h: 36 },
    ],
  },
} as const;

export const SafetyKitPreview: React.FC<{ interactive?: boolean }> = ({
  interactive = false,
}) => {
  const [condition, setCondition] =
    useState<keyof typeof PPE_CONDITIONS>('standard');
  const active = PPE_CONDITIONS[condition];

  return (
    <div className="space-y-3">
      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#525866]">
            Simulate Environment Condition
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-[#F3F4F6] p-1">
            {(
              Object.keys(PPE_CONDITIONS) as Array<keyof typeof PPE_CONDITIONS>
            ).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCondition(key)}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  condition === key
                    ? 'bg-white text-[#111315] shadow-xs'
                    : 'text-[#525866] hover:text-[#111315]'
                }`}
              >
                {PPE_CONDITIONS[key].label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`overflow-hidden rounded-xl border border-[#2A2F38] ${active.bgClass} transition-colors duration-200`}
      >
        <svg
          viewBox="0 0 340 245"
          className="h-auto w-full select-none"
          role="img"
          aria-label="YOLOv8 PPE detection bounding boxes over worker silhouette"
        >
          <defs>
            <pattern
              id="visionGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.05"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="340" height="245" fill="url(#visionGrid)" />

          {condition === 'glare' && (
            <circle cx="290" cy="36" r="68" fill="#FFFFFF" fillOpacity="0.08" />
          )}

          {/* Stylized industrial worker silhouette */}
          <g className={active.overlayOpacity}>
            <path
              d="M148 58 C148 44, 194 44, 194 58 L194 68 L148 68 Z"
              fill="#F59E0B"
            />
            <circle cx="171" cy="76" r="13" fill="#9CA3AF" />
            <rect x="134" y="96" width="74" height="78" rx="8" fill="#374151" />
            <path
              d="M142 98 L160 98 L160 172 L142 172 Z M182 98 L200 98 L200 172 L182 172 Z"
              fill="#D97706"
              fillOpacity="0.85"
            />
            <rect x="142" y="174" width="24" height="44" rx="4" fill="#4B5563" />
            <rect x="176" y="174" width="24" height="44" rx="4" fill="#4B5563" />
          </g>

          {/* YOLOv8 Bounding Boxes */}
          {active.detections.map((box) => (
            <g key={box.name}>
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.5"
              />
              <rect
                x={box.x}
                y={box.y - 14}
                width={box.name.length * 5.8 + 34}
                height="14"
                fill="#990000"
              />
              <text
                x={box.x + 4}
                y={box.y - 4}
                className="fill-white font-mono text-[8.5px] font-medium"
              >
                {box.name} {box.conf}
              </text>
            </g>
          ))}

          <text
            x="14"
            y="22"
            className="fill-[#9CA3AF] font-mono text-[9.5px]"
          >
            YOLOv8n-PPE · {active.label.toUpperCase()} · 96.0% mAP
          </text>
        </svg>
      </div>
    </div>
  );
};

const DEFAULT_PATTERN = [1, 5, 9, 10];

export const GridAuthPreview: React.FC<{ interactive?: boolean }> = ({
  interactive = false,
}) => {
  const [savedPattern, setSavedPattern] = useState<number[]>(DEFAULT_PATTERN);
  const [selectedCells, setSelectedCells] = useState<number[]>(DEFAULT_PATTERN);
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Pattern verified — Flask session token issued'
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  const toggleCell = (idx: number) => {
    if (!interactive) return;
    setSelectedCells((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const handleAction = () => {
    if (selectedCells.length < 3) {
      setIsSuccess(false);
      setStatusMessage('Select at least 3 grid coordinates');
      return;
    }
    if (mode === 'enroll') {
      setSavedPattern(selectedCells);
      setMode('verify');
      setSelectedCells([]);
      setIsSuccess(true);
      setStatusMessage(
        `Saved ${selectedCells.length}-node spatial credential to SQLite`
      );
      return;
    }

    const matches =
      selectedCells.length === savedPattern.length &&
      selectedCells.every((val, index) => val === savedPattern[index]);

    setIsSuccess(matches);
    setStatusMessage(
      matches
        ? '200 OK · Coordinate hash matched · Session active'
        : '401 Unauthorized · Coordinate sequence mismatch'
    );
  };

  const handleReset = () => {
    setSelectedCells([]);
    setIsSuccess(true);
    setStatusMessage(
      mode === 'enroll'
        ? 'Click 3+ cells in order to enroll a new pattern'
        : 'Enter your 4-cell pattern to verify'
    );
  };

  return (
    <div className="rounded-xl border border-[#E4E6EB] bg-[#FAFAFB] p-4">
      <div className="flex items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#111315]">
          <Lock className="h-3.5 w-3.5 text-[#990000]" aria-hidden="true" />
          <span>4×4 Coordinate Grid Auth</span>
        </div>
        {interactive && (
          <div className="flex items-center gap-1 rounded-md bg-[#ECEEF2] p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setMode('verify');
                setSelectedCells([]);
                setStatusMessage('Click cells in enrolled order to verify');
              }}
              className={`whitespace-nowrap shrink-0 rounded px-2 py-0.5 font-medium transition-colors ${
                mode === 'verify'
                  ? 'bg-white text-[#111315] shadow-xs'
                  : 'text-[#525866]'
              }`}
            >
              Verify
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('enroll');
                setSelectedCells([]);
                setStatusMessage('Select new coordinate sequence to enroll');
              }}
              className={`whitespace-nowrap shrink-0 rounded px-2 py-0.5 font-medium transition-colors ${
                mode === 'enroll'
                  ? 'bg-white text-[#111315] shadow-xs'
                  : 'text-[#525866]'
              }`}
            >
              Enroll
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-[232px] grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((_, idx) => {
          const orderIndex = selectedCells.indexOf(idx);
          const isSelected = orderIndex !== -1;

          return (
            <button
              key={idx}
              type="button"
              disabled={!interactive}
              onClick={() => toggleCell(idx)}
              className={`flex aspect-square items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors ${
                isSelected
                  ? 'border-[#990000] bg-[#990000] text-white'
                  : 'border-[#DCE0E8] bg-white text-[#646B78] hover:border-[#9BA3B0]'
              } ${!interactive ? 'cursor-default' : 'cursor-pointer'}`}
              aria-label={`Grid cell row ${Math.floor(idx / 4) + 1} column ${(idx % 4) + 1}`}
            >
              {isSelected ? orderIndex + 1 : `${Math.floor(idx / 4)},${idx % 4}`}
            </button>
          );
        })}
      </div>

      {interactive ? (
        <div className="mt-4 space-y-2.5 border-t border-[#E4E6EB] pt-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 rounded-md border border-[#E4E6EB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#3F4552] hover:bg-[#F3F4F6]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Clear
            </button>
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-[#111315] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#272B33]"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {mode === 'enroll' ? 'Save Pattern' : 'Authenticate'}
            </button>
          </div>
          <p
            className={`flex items-center gap-1.5 font-mono text-[11px] ${
              isSuccess ? 'text-[#166534]' : 'text-[#990000]'
            }`}
          >
            {isSuccess && <Check className="h-3 w-3 shrink-0" aria-hidden="true" />}
            <span>{statusMessage}</span>
          </p>
        </div>
      ) : (
        <p className="mt-3 text-center font-mono text-[11px] text-[#646B78]">
          Sequence [{DEFAULT_PATTERN.join(' → ')}] · 93.7% verification accuracy
        </p>
      )}
    </div>
  );
};

export const ProjectInteractivePreview: React.FC<PreviewProps> = ({
  projectId,
  interactive = false,
}) => {
  if (projectId === 'indoor-nav') {
    if (interactive) {
      return <IndoorNavLab />;
    }
    return (
      <div className="overflow-hidden rounded-xl border border-[#ECEEF2] bg-[#FAFAFB] p-4">
        <svg
          viewBox="0 0 420 155"
          className="h-auto w-full"
          role="img"
          aria-label="Multi-floor BLE RSSI indoor navigation graph schematic"
        >
          <text x="8" y="16" className="fill-[#646B78] font-mono text-[9px]">
            8-FLOOR GRAPH · BLE RSSI FINGERPRINTING + DIJKSTRA
          </text>
          {[
            [40, 56, 140, 56, true],
            [140, 56, 250, 56, false],
            [40, 56, 95, 118, false],
            [140, 56, 195, 118, true],
            [195, 118, 305, 118, true],
            [250, 56, 365, 56, false],
            [305, 118, 365, 56, true],
          ].map(([x1, y1, x2, y2, active], idx) => (
            <line
              key={idx}
              x1={Number(x1)}
              y1={Number(y1)}
              x2={Number(x2)}
              y2={Number(y2)}
              stroke={active ? '#990000' : '#CBD1DC'}
              strokeWidth={active ? 2.5 : 1.5}
            />
          ))}
          {[
            [40, 56, 'A', true],
            [140, 56, 'B', true],
            [250, 56, 'C', false],
            [365, 56, 'F', true],
            [95, 118, 'D', false],
            [195, 118, 'E', true],
            [305, 118, 'H', true],
          ].map(([cx, cy, label, active]) => (
            <g key={String(label)}>
              <circle
                cx={Number(cx)}
                cy={Number(cy)}
                r={11}
                fill={
                  label === 'A'
                    ? '#111315'
                    : label === 'F'
                      ? '#990000'
                      : '#FFFFFF'
                }
                stroke={active ? '#990000' : '#9BA3B0'}
                strokeWidth="1.8"
              />
              <text
                x={Number(cx)}
                y={Number(cy) + 3.5}
                textAnchor="middle"
                className={`font-mono text-[9.5px] font-semibold ${
                  label === 'A' || label === 'F' ? 'fill-white' : 'fill-[#111315]'
                }`}
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (projectId === 'safety-kit') {
    return <SafetyKitPreview interactive={interactive} />;
  }

  return <GridAuthPreview interactive={interactive} />;
};
