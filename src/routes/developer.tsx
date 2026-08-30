import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code,
  Terminal,
  Play,
  Copy,
  Check,
  Globe,
  Database,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/developer")({
  component: DeveloperPortal,
  head: () => ({
    meta: [
      { title: "Developer REST API & Interactive Sandbox | RailDristhi" },
      {
        name: "description",
        content:
          "Integrate real-time train tracking, ETA forecasts, delay classification, station boards, and PNR status into your applications with our high-speed REST API.",
      },
    ],
  }),
});

type ApiEndpoint = {
  id: string;
  name: string;
  method: "GET";
  path: string;
  description: string;
  defaultParams?: Record<string, string>;
  category: "Tracking" | "Timetable" | "Stations" | "Analytics" | "PNR & Booking";
};

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "trains-search",
    name: "Search Trains & Directory",
    method: "GET",
    path: "/api/v1/trains",
    description:
      "Search and filter trains by name, number, class (Superfast, Express, Rajdhani), or running state.",
    defaultParams: { q: "Rajdhani", type: "all", limit: "5" },
    category: "Tracking",
  },
  {
    id: "train-live",
    name: "Live Train Running Status & ETA",
    method: "GET",
    path: "/api/v1/train/12951/live",
    description:
      "Real-time GPS coordinates, speed, next scheduled halt, predicted ETA with confidence windows, and delay reason.",
    category: "Tracking",
  },
  {
    id: "train-timetable",
    name: "Train Timetable & Stops",
    method: "GET",
    path: "/api/v1/train/12951/timetable",
    description:
      "Complete sequence of halts, arrival/departure schedules, day count, distance in km, and coordinates.",
    category: "Timetable",
  },
  {
    id: "station-board",
    name: "Live Station Arrivals/Departures Board",
    method: "GET",
    path: "/api/v1/station/NDLS/board",
    description:
      "Live station board with incoming and departing services, platform assignments, and delay predictions.",
    defaultParams: { mode: "all" },
    category: "Stations",
  },
  {
    id: "stations-search",
    name: "Search Station Dictionary",
    method: "GET",
    path: "/api/v1/stations",
    description: "Query station names, IR station codes, and geographic coordinates across India.",
    defaultParams: { q: "DELHI", limit: "5" },
    category: "Stations",
  },
  {
    id: "between-stations",
    name: "Trains Between Stations",
    method: "GET",
    path: "/api/v1/between",
    description: "Find all direct services between source and destination stations.",
    defaultParams: { from: "NDLS", to: "KOTA" },
    category: "Timetable",
  },
  {
    id: "control-room",
    name: "Network Operations & Fleet KPIs",
    method: "GET",
    path: "/api/v1/control-room",
    description:
      "Network-wide fleet health metrics, active delay alerts, and delay classification breakdown.",
    category: "Analytics",
  },
  {
    id: "connecting-impact",
    name: "Connecting Train Transfer Feasibility",
    method: "GET",
    path: "/api/v1/connecting-impact",
    description:
      "Calculate transfer feasibility at junction stations based on incoming train ETA confidence margins.",
    defaultParams: { incoming: "12951", connecting: "12001", station: "NDLS" },
    category: "Analytics",
  },
  {
    id: "pnr-status",
    name: "10-Digit PNR Status & Coach Booking",
    method: "GET",
    path: "/api/v1/pnr/8421950247",
    description:
      "10-digit Indian Railways PNR validation with coach, berth assignment, and live train status.",
    category: "PNR & Booking",
  },
];

function DeveloperPortal() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[1]!);
  const [customPath, setCustomPath] = useState(ENDPOINTS[1]!.path);
  const [params, setParams] = useState<Record<string, string>>(ENDPOINTS[1]!.defaultParams || {});
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "js" | "python">("curl");

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setCustomPath(ep.path);
    setParams(ep.defaultParams || {});
    setResponseBody(null);
    setResponseStatus(null);
    setResponseTime(null);
  };

  const constructUrl = () => {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v.trim()) query.set(k, v.trim());
    }
    const qStr = query.toString();
    return customPath + (qStr ? `?${qStr}` : "");
  };

  const handleExecute = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const fullUrl = constructUrl();
      const res = await fetch(fullUrl);
      const data = await res.json();
      const duration = Math.round(performance.now() - start);
      setResponseStatus(res.status);
      setResponseTime(duration);
      setResponseBody(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setResponseStatus(500);
      setResponseTime(Math.round(performance.now() - start));
      setResponseBody(
        JSON.stringify(
          { error: true, message: err instanceof Error ? err.message : "Fetch error" },
          null,
          2,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const getCodeSnippet = () => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${constructUrl()}`
        : `http://localhost:3000${constructUrl()}`;
    if (activeCodeTab === "curl") {
      return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;
    }
    if (activeCodeTab === "js") {
      return `const response = await fetch("${fullUrl}");
const data = await response.json();
console.log(data);`;
    }
    if (activeCodeTab === "python") {
      return `import requests

response = requests.get("${fullUrl}")
data = response.json()
print(data)`;
    }
    return "";
  };

  const copyCode = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    toast.success(`Copied ${lang} snippet to clipboard`);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Header section */}
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> RailDristhi REST API v1
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Developer REST API & Live Sandbox
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Production-ready endpoints for live train tracking, ETA forecasts with uncertainty
              intervals, classified delay reasons, station timetable boards, and PNR verification.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/v1/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-card transition-colors hover:bg-secondary/70"
            >
              <Code className="size-4" /> View OpenAPI Schema
            </a>
            <Button onClick={handleExecute} className="rounded-xl px-5 gap-2">
              <Play className="size-4 fill-current" /> Run Test Request
            </Button>
          </div>
        </div>

        {/* Sandbox Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Endpoint selector sidebar */}
          <aside className="space-y-4">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              API Endpoints
            </h2>
            <div className="space-y-1 rounded-2xl border border-border bg-card p-2 shadow-card">
              {ENDPOINTS.map((ep) => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`flex w-full flex-col gap-1 rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 text-primary shadow-xs"
                        : "hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{ep.name}</span>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-mono font-semibold">
                        {ep.method}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground truncate">
                      {ep.path}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick stats box */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">API Specs</h3>
              <ul className="mt-3 space-y-2 text-xs">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Protocol</span>
                  <span className="font-semibold">HTTPS / JSON</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">CORS Support</span>
                  <span className="font-semibold text-rail-live">Enabled (*)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Rate Limit</span>
                  <span className="font-semibold">1,000 req/min</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-semibold font-mono">application/json</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Playground & Console */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedEndpoint.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedEndpoint.description}
                  </p>
                </div>
                <span className="rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-mono font-bold text-primary">
                  {selectedEndpoint.method} {constructUrl()}
                </span>
              </div>

              {/* Request URL Editor */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-muted-foreground uppercase">
                  Request Path
                </label>
                <div className="mt-1.5 flex gap-2">
                  <div className="flex h-10 w-16 items-center justify-center rounded-xl bg-secondary font-mono text-xs font-bold text-primary">
                    GET
                  </div>
                  <Input
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button onClick={handleExecute} disabled={loading} className="shrink-0 gap-2">
                    <Play className="size-3.5 fill-current" />
                    {loading ? "Sending…" : "Send"}
                  </Button>
                </div>
              </div>

              {/* Parameters Editor */}
              {selectedEndpoint.defaultParams &&
                Object.keys(selectedEndpoint.defaultParams).length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase">
                      Query Parameters
                    </label>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {Object.entries(params).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className="w-20 shrink-0 font-mono text-xs font-semibold text-muted-foreground">
                            {k}
                          </span>
                          <Input
                            value={v}
                            onChange={(e) => setParams({ ...params, [k]: e.target.value })}
                            className="h-9 font-mono text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Code snippets */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border bg-subtle-gradient px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="size-4 text-primary" />
                  <span className="text-xs font-semibold">Implementation Code</span>
                </div>
                <div className="flex items-center gap-1">
                  {(["curl", "js", "python"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                        activeCodeTab === tab
                          ? "bg-secondary text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode(getCodeSnippet(), activeCodeTab)}
                    className="ml-2 h-7 px-2 text-xs"
                  >
                    {copiedLang === activeCodeTab ? (
                      <Check className="size-3.5 text-rail-live" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground bg-secondary/30">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>

            {/* Response Console */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border bg-subtle-gradient px-4 py-3">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Response Inspector</h3>
                </div>
                {responseStatus !== null && (
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-semibold ${
                        responseStatus >= 200 && responseStatus < 300
                          ? "text-rail-live"
                          : "text-rail-alert"
                      }`}
                    >
                      Status: {responseStatus} {responseStatus === 200 ? "OK" : ""}
                    </span>
                    {responseTime !== null && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3" /> {responseTime} ms
                      </span>
                    )}
                  </div>
                )}
              </div>

              {responseBody ? (
                <pre className="max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground bg-secondary/20">
                  <code>{responseBody}</code>
                </pre>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  <Play className="mx-auto size-6 opacity-40 mb-2" />
                  Click <strong>Run Test Request</strong> or <strong>Send</strong> above to execute
                  a real live API call.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}
