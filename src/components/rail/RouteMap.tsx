import type { Halt } from "@/data/trains";

const BOX = { minLat: 7.5, maxLat: 35.5, minLng: 67.5, maxLng: 90.5 };
const W = 640;
const H = 720;

function project(lat: number, lng: number) {
  const x = ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * W;
  const y = ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * H;
  return { x, y };
}

/** Total polyline length. */
function totalLen(pts: { x: number; y: number }[]) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  }
  return acc;
}

/** Closest point on the path to a projected location, with its distance & heading. */
function snapToPath(
  pts: { x: number; y: number }[],
  p: { x: number; y: number },
): { x: number; y: number; d: number; angle: number } {
  let best = { x: p.x, y: p.y, d: 0, angle: 0 };
  let bestDist = Infinity;
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
    t = Math.max(0, Math.min(1, t));
    const cx = a.x + dx * t;
    const cy = a.y + dy * t;
    const d = Math.hypot(p.x - cx, p.y - cy);
    if (d < bestDist) {
      bestDist = d;
      best = { x: cx, y: cy, d: acc + len * t, angle: Math.atan2(dy, dx) };
    }
    acc += len;
  }
  return best;
}

/** Railway sleepers placed along the polyline, oriented perpendicular to each segment. */
function buildTies(pts: { x: number; y: number }[], spacing: number) {
  const ties: { x: number; y: number; angle: number; d: number }[] = [];
  const total = totalLen(pts);
  for (let d = 0; d <= total; d += spacing) {
    let s = 0;
    let rem = d;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1]!.x - pts[i]!.x, pts[i + 1]!.y - pts[i]!.y) || 1;
      if (rem <= l) {
        s = i;
        break;
      }
      rem -= l;
    }
    const a = pts[s]!;
    const b = pts[s + 1]!;
    const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const t = l ? rem / l : 0;
    ties.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
      d,
    });
  }
  return ties;
}

function TrainGlyph({ isMoving = false }: { isMoving?: boolean }) {
  return (
    <>
      {/* Dynamic Blinking / Radar Halo when train is actively running */}
      {isMoving && (
        <>
          <circle r={22} className="fill-none stroke-primary/50 animate-ping" strokeWidth={1} />
          <circle r={16} className="fill-primary/25 animate-rail-pulse" />
        </>
      )}
      {/* Calm stationary backdrop when train is halted / static */}
      <circle r={isMoving ? 10 : 8} className={isMoving ? "fill-primary/30" : "fill-primary/20"} />

      {/* Train Locomotive Engine Body */}
      <path
        d="M-21 6 L12 6 Q15 6 16 3 L16.5 -1 Q17 -6 12 -6 L-21 -6 L-24 -2 L-24 2 L-21 6 Z"
        fill="var(--primary)"
        stroke="var(--card)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 -5 L13 -5 Q15 -5 15 -3 L14 -1.5 L8 -1.5 Z"
        fill="var(--primary-foreground)"
        opacity="0.92"
      />
      <rect
        x="-17"
        y="-5"
        width="5"
        height="3.5"
        rx="1"
        fill="var(--primary-foreground)"
        opacity="0.85"
      />
      <rect
        x="-9"
        y="-5"
        width="5"
        height="3.5"
        rx="1"
        fill="var(--primary-foreground)"
        opacity="0.85"
      />
      <rect
        x="-1"
        y="-5"
        width="5"
        height="3.5"
        rx="1"
        fill="var(--primary-foreground)"
        opacity="0.85"
      />
      <circle cx="15" cy="2.4" r="1.7" fill="#fff" />
      <circle
        cx="-18"
        cy="7"
        r="2.4"
        fill="var(--card)"
        stroke="var(--primary)"
        strokeWidth="1.6"
      />
      <circle cx="0" cy="7" r="2.4" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.6" />
      <circle cx="12" cy="7" r="2.4" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.6" />
    </>
  );
}

type Props = {
  halts: Halt[];
  position?: { lat: number; lng: number } | null;
  className?: string;
  isMoving?: boolean;
};

export function RouteMap({ halts, position, className = "", isMoving = false }: Props) {
  const pts = halts.map((h) => project(h.lat, h.lng));
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Perpendicular railway sleeper cross-ties spaced along the track
  const ties = buildTies(pts, 9);
  const tieLen = 9;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  pts.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const pad = 42;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(W, maxX + pad);
  maxY = Math.min(H, maxY + pad);
  const vw = Math.max(120, maxX - minX);
  const vh = Math.max(120, maxY - minY);

  const marker = position ? snapToPath(pts, project(position.lat, position.lng)) : null;
  const markerDist = marker ? marker.d : -1;

  // Cumulative distance to each halt along the route
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1]! + Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y));
  }

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
      </defs>

      <rect x={minX} y={minY} width={vw} height={vh} fill="url(#rail-grid)" />

      {/* Ballast bed — broad muted corridor so the route reads as track, not a line. */}
      <polyline
        points={line}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.12"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cross-ties (sleepers) perpendicular to the track direction. */}
      {ties.map((t, i) => {
        const traveled = markerDist >= 0 && t.d <= markerDist;
        const perp = t.angle + Math.PI / 2;
        const dx = Math.cos(perp) * (tieLen / 2);
        const dy = Math.sin(perp) * (tieLen / 2);
        return (
          <line
            key={`tie-${i}`}
            x1={t.x - dx}
            y1={t.y - dy}
            x2={t.x + dx}
            y2={t.y + dy}
            stroke="var(--primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity={traveled ? 0.65 : 0.3}
          />
        );
      })}

      {/* Thin center rail connecting the route. */}
      <polyline
        points={line}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray="2 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Station markers at their real positions. */}
      {pts.map((p, i) => {
        const done = markerDist >= 0 && cum[i]! <= markerDist;
        return (
          <g key={halts[i]!.code}>
            <circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              className="fill-card stroke-primary"
              strokeWidth="1.5"
              strokeOpacity={done ? 0.9 : 0.4}
            />
            <text x={p.x + 8} y={p.y + 4} className="fill-muted-foreground" fontSize="10">
              {halts[i]!.code}
            </text>
          </g>
        );
      })}

      {/* Train marker — animated blinking radar when running, stationary when halted */}
      {marker && (
        <g transform={`translate(${marker.x.toFixed(1)}, ${marker.y.toFixed(1)})`}>
          <g transform={`rotate(${((marker.angle * 180) / Math.PI).toFixed(1)})`}>
            <TrainGlyph isMoving={isMoving} />
          </g>
        </g>
      )}
    </svg>
  );
}
