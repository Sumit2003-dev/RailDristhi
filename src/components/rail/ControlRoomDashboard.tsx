import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, TrendingUp, ShieldCheck, PauseCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { trainRoutes } from "@/data/trains";
import { computeLiveStatus } from "@/lib/liveStatus";
import { useLiveClock } from "./useLiveClock";
import { EtaConfidenceBadge } from "./EtaConfidenceBadge";
import { DelayReasonTag } from "./DelayReasonTag";
import { DELAY_REASONS } from "@/lib/delayReasons";
import type { DelayReason } from "@/lib/delayReasons";

const reasonColors: Record<DelayReason, string> = {
  weather: "#38bdf8",
  congestion: "#f59e0b",
  "track-work": "#fb923c",
  "signal-failure": "#ef4444",
  technical: "#a855f7",
  unknown: "#94a3b8",
};

export function ControlRoomDashboard() {
  const now = useLiveClock(4000);
  const statuses = useMemo(
    () => (now ? trainRoutes.map((t) => ({ t, s: computeLiveStatus(t, now) })) : []),
    [now],
  );

  const fleet = useMemo(() => {
    const running = statuses.filter((x) => x.s.state === "running" || x.s.state === "halted");
    const onTime = running.filter((x) => (x.s.forecast?.delayMin ?? 0) <= 2).length;
    const late = running.length - onTime;
    const halted = running.filter((x) => x.s.state === "halted").length;
    const highConf = running.filter((x) => (x.s.forecast?.confidence ?? 0) >= 0.7).length;
    return { running: running.length, onTime, late, halted, highConf };
  }, [statuses]);

  const reasonBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { s } of statuses) {
      if ((s.forecast?.delayMin ?? 0) > 2) {
        counts[s.delayReason] = (counts[s.delayReason] ?? 0) + 1;
      }
    }
    return (Object.keys(DELAY_REASONS) as DelayReason[])
      .filter((r) => (counts[r] ?? 0) > 0)
      .map((r) => ({
        reason: r,
        label: DELAY_REASONS[r].short,
        count: counts[r] ?? 0,
      }));
  }, [statuses]);

  const alerts = useMemo(
    () =>
      statuses
        .filter(({ s }) => (s.forecast?.delayMin ?? 0) > 15)
        .sort((a, b) => (b.s.forecast?.delayMin ?? 0) - (a.s.forecast?.delayMin ?? 0)),
    [statuses],
  );

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<TrendingUp className="size-4" />}
          label="Trains running"
          value={fleet.running}
          sub={`${fleet.onTime} on time`}
        />
        <Kpi
          icon={<AlertTriangle className="size-4" />}
          label="Running late"
          value={fleet.late}
          sub="predicted by model"
          alert={fleet.late > 0}
        />
        <Kpi
          icon={<PauseCircle className="size-4" />}
          label="Halted at stations"
          value={fleet.halted}
          sub="currently stationary"
        />
        <Kpi
          icon={<ShieldCheck className="size-4" />}
          label="High-confidence forecasts"
          value={fleet.highConf}
          sub="≥ 70% confidence"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Delay reason breakdown */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold">Delay cause distribution</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Classified causes for trains the model predicts as late.
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {reasonBreakdown.map((r) => (
                    <Cell key={r.reason} fill={reasonColors[r.reason]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Active alerts */}
        <section className="rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h3 className="text-sm font-semibold">Active delay alerts</h3>
            <span className="text-xs text-muted-foreground">
              {alerts.length} · &gt;15 min predicted
            </span>
          </div>
          {alerts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No trains are predicted to run more than 15 minutes late right now.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {alerts.map(({ t, s }) => (
                <li key={t.number} className="px-5 py-3">
                  <Link
                    to="/train/$number"
                    params={{ number: t.number }}
                    className="flex items-center justify-between gap-3"
                  >
                    <span>
                      <span className="block text-sm font-semibold">
                        <span className="text-muted-foreground">{t.number}</span> {t.name}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2">
                        <DelayReasonTag reason={s.delayReason} />
                        <span className="text-xs text-muted-foreground">
                          {s.nextHalt?.code ?? "destination"}
                        </span>
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block text-base font-semibold text-rail-alert">
                        +{s.forecast?.delayMin ?? s.delay} min
                      </span>
                      <EtaConfidenceBadge confidence={s.forecast?.confidence ?? 0} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${alert ? "text-rail-alert" : "text-foreground"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
