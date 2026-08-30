import type { Halt } from "@/data/trains";

const BOX = { minLat: 7.5, maxLat: 35.5, minLng: 67.5, maxLng: 90.5 };
const W = 640;
const H = 720;

function project(lat: number, lng: number) {
  const x = ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * W;
  const y = ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * H;
  return { x, y };
}

type Props = {
  halts: Halt[];
  position?: { lat: number; lng: number } | null;
  className?: string;
};

export function RouteMap({ halts, position, className }: Props) {
  const pts = halts.map((s) => project(s.lat, s.lng));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const pad = 70;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const vw = Math.max(Math.max(...xs) - minX + pad, 200);
  const vh = Math.max(Math.max(...ys) - minY + pad, 200);
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const marker = position ? project(position.lat, position.lng) : null;

  return (
    <svg
      viewBox={`${minX} ${minY} ${vw} ${vh}`}
      className={className}
      role="img"
      aria-label="Train route map"
    >
      <defs>
        <pattern id="rail-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M24 0H0V24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border"
          />
        </pattern>
        <linearGradient id="rail-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      <rect x={minX} y={minY} width={vw} height={vh} fill="url(#rail-grid)" />

      <polyline
        points={line}
        fill="none"
        stroke="url(#rail-line)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {pts.map((p, i) => (
        <g key={halts[i]!.code}>
          <circle cx={p.x} cy={p.y} r={4} className="fill-card stroke-primary" strokeWidth="2.5" />
          <text x={p.x + 8} y={p.y + 4} className="fill-muted-foreground" fontSize="10">
            {halts[i]!.code}
          </text>
        </g>
      ))}

      {marker && (
        <g>
          <circle
            cx={marker.x}
            cy={marker.y}
            r={11}
            className="fill-primary/20 animate-rail-pulse"
          />
          <circle cx={marker.x} cy={marker.y} r={5.5} className="fill-primary" />
        </g>
      )}
    </svg>
  );
}
