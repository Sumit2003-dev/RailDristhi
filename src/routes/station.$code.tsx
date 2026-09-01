import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowDownUp, Clock } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { EtaConfidenceBadge } from "@/components/rail/EtaConfidenceBadge";
import { DelayReasonTag } from "@/components/rail/DelayReasonTag";
import { useLiveClock } from "@/components/rail/useLiveClock";
import { trainRoutes } from "@/data/trains";
import { computeLiveStatus, fmtMinutes } from "@/lib/liveStatus";
import { stations } from "@/data/rail";
import { stationFor } from "@/data/generated/stations";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/station/$code")({
  loader: ({ params }) => {
    const code = params.code.toUpperCase();
    const stationInfo = stationFor(code);
    const hardcodedStation = stations.find(([, c]) => c === code);
    let name = stationInfo?.name || hardcodedStation?.[0];
    if (!name) {
      for (const t of trainRoutes) {
        const foundHalt = t.halts.find((h) => h.code.toUpperCase() === code);
        if (foundHalt) {
          name = foundHalt.name;
          break;
        }
      }
    }
    if (!name && !stationInfo) throw notFound();
    return { code, name: name ?? code };
  },
  head: ({ loaderData }) => {
    const code = loaderData?.code;
    const name = loaderData?.name;
    return {
      meta: [
        { title: `${name ? `${name} (${code})` : "Station"} — Station Board | RailDristhi` },
        {
          name: "description",
          content: `Live arrivals and departures with predicted times and platforms at ${name ?? ""} (${code ?? ""}), from the RailDristhi ETA forecasting model.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: StationNotFound,
  component: StationBoard,
});

function StationNotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">{t("station.notFoundTitle")}</h1>
        <p className="mt-3 text-muted-foreground">{t("station.notFoundMsg")}</p>
        <Link to="/" className="mt-6 inline-block text-primary underline">
          {t("station.backToBoard")}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

type BoardRow = {
  t: (typeof trainRoutes)[number];
  halt: (typeof trainRoutes)[number]["halts"][number];
  status: ReturnType<typeof computeLiveStatus> | null;
  type: string;
  scheduled: string;
};

function StationBoard() {
  const { code, name } = Route.useLoaderData();
  const { t } = useTranslation();
  const now = useLiveClock(4000);

  const rows: BoardRow[] = trainRoutes
    .map((tr) => {
      const idx = tr.halts.findIndex((h) => h.code === code);
      if (idx === -1) return null;
      const status = now ? computeLiveStatus(tr, now) : null;
      const halt = tr.halts[idx]!;
      const isArrival = idx > 0;
      const isFirst = idx === 0;
      const isLast = idx === tr.halts.length - 1;
      const type = isFirst ? "Departure" : isLast ? "Terminal" : isArrival ? "Arrival" : "Pass";
      const scheduled = fmtMinutes(tr.startsAt + halt.arr);
      return { t: tr, halt, status, type, scheduled };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => (a.status?.forecast?.etaMin ?? 0) - (b.status?.forecast?.etaMin ?? 0));

  const arrivals = rows.filter(
    (r) => r.type === "Arrival" || r.type === "Terminal" || r.type === "Pass",
  );
  const departures = rows.filter((r) => r.type === "Departure" || r.type === "Pass");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {t("station.liveBoard")}
        </Link>

        <div className="mt-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-bold">{name}</h1>
            <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-0.5 text-sm font-semibold text-muted-foreground">
              {code}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("station.subtitle")}</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BoardTable
            title={t("station.arrivals")}
            icon={<ArrowDownUp className="size-4" />}
            rows={arrivals}
          />
          <BoardTable
            title={t("station.departures")}
            icon={<ArrowDownUp className="size-4" />}
            rows={departures}
          />
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}

function BoardTable({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: BoardRow[];
}) {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2 border-b border-border bg-subtle-gradient px-5 py-3">
        {icon}
        <h2 className="text-sm font-semibold">{title}</h2>
        <Clock className="ml-auto size-4 text-muted-foreground" />
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          {t("station.noServices")}
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map(({ t: tr, halt, status, type, scheduled }) => {
            const predicted = status?.haltStatus?.find((h) => h.halt.code === halt.code)?.forecast
              ?.eta;
            const forecast = status?.haltStatus?.find((h) => h.halt.code === halt.code)?.forecast;
            return (
              <li key={tr.number} className="px-5 py-3">
                <Link
                  to="/train/$number"
                  params={{ number: tr.number }}
                  className="flex items-center justify-between gap-3"
                >
                  <span>
                    <span className="block text-sm font-semibold">
                      <span className="text-muted-foreground">{tr.number}</span> {tr.name}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-semibold">
                        {type}
                      </span>
                      <span>{t("station.platform", { p: halt.platform })}</span>
                      {forecast && forecast.delayMin > 2 && (
                        <DelayReasonTag reason={forecast.reason} />
                      )}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold">
                      <span className="text-muted-foreground line-through">{scheduled}</span> →{" "}
                      {predicted ?? scheduled}
                    </span>
                    {forecast && (
                      <EtaConfidenceBadge confidence={forecast.confidence} className="mt-1" />
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
