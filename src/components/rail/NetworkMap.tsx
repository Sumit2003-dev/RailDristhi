import { Link } from "@tanstack/react-router";
import { trainRoutes } from "@/data/trains";
import { computeLiveStatus } from "@/lib/liveStatus";
import { useLiveClock } from "@/components/rail/useLiveClock";

const BOX = { minLat: 7.5, maxLat: 35.5, minLng: 67.5, maxLng: 90.5 };
const W = 820;
const H = 720;

function project(lat: number, lng: number) {
  const x = ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * W;
  const y = ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * H;
  return { x, y };
}

type Props = {
  className?: string;
};

export function NetworkMap({ className }: Props) {
  const now = useLiveClock(4000);
  const positions = now
    ? new Map(
        trainRoutes.map((t) => {
          const s = computeLiveStatus(t, now);
          return [t.number, { x: project(s.lat, s.lng).x, y: project(s.lat, s.lng).y, s }];
        }),
      )
    : null;

  const routes = trainRoutes.map((t) => t.halts.map((h) => project(h.lat, h.lng)));
  const xs = routes.flat().map((p) => p.x);
  const ys = routes.flat().map((p) => p.y);
  const pad = 60;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className={className}
      role="img"
      aria-label="Live Indian Railways network map"
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

      <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="url(#rail-grid)" />

      {trainRoutes.map((t) => {
        const pts = t.halts.map((h) => project(h.lat, h.lng));
        const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
        const pos = positions?.get(t.number);
        const forecastMin = pos?.s.forecast?.delayMin ?? 0;
        const isLate = pos?.s.forecast ? pos.s.forecast.delayMin > 2 : false;
        return (
          <Link key={t.number} to="/train/$number" params={{ number: t.number }} className="group">
            <g>
              <polyline
                points={line}
                fill="none"
                stroke="url(#rail-line)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
                className="group-hover:opacity-100"
              />
              {pos && (
                <g>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={10}
                    className={
                      isLate
                        ? "fill-rail-alert/30 animate-rail-pulse"
                        : "fill-primary/30 animate-rail-pulse"
                    }
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={4.5}
                    className={isLate ? "fill-rail-alert" : "fill-primary"}
                  />
                  {isLate && (
                    <text
                      x={pos.x + 8}
                      y={pos.y - 8}
                      fontSize="10"
                      fontWeight="bold"
                      className={
                        pos.s.delayReason === "weather"
                          ? "fill-sky-500"
                          : pos.s.delayReason === "signal-failure"
                            ? "fill-red-500"
                            : "fill-amber-500"
                      }
                    >
                      ▲
                    </text>
                  )}
                </g>
              )}
              <title>{`${t.number} ${t.name}${forecastMin > 0 ? ` · predicted ${forecastMin} min late · ${pos?.s.delayReason ?? ""}` : " · on time"}`}</title>
            </g>
          </Link>
        );
      })}

      {positions && (
        <g className="pointer-events-none">
          {[...positions.values()].map((p, i) => (
            <text key={i} x={p.x + 9} y={p.y + 4} className="fill-muted-foreground" fontSize="9">
              {p.s.lastHalt.code}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
