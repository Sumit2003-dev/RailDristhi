import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { features, networks, locals, stations, faqs } from "@/data/rail";

export function Features() {
  return (
    <section id="tools" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-bold sm:text-3xl">Everything on one radar</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        ETA forecasting, delay intelligence and raw data endpoints, built on the same live feed.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-1"
          >
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ApiBanner() {
  return (
    <section id="api" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground shadow-float sm:p-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-primary-foreground/10 blur-2xl animate-rail-slide" />
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
          <Sparkles className="size-3.5" /> For developers
        </p>
        <h2 className="mt-4 max-w-xl text-2xl font-bold sm:text-3xl">
          Predicted ETA and delay data behind one REST API
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85">
          Predicted arrival times with confidence windows, classified delay causes, live running
          status, timetables and dense GeoJSON route geometry. Start on a free sandbox with 1,000
          requests a month.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/developer"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground shadow-xs hover:bg-secondary/90 transition-colors"
          >
            Developer Sandbox
          </Link>
          <a
            href="/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/40 bg-transparent px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground transition-colors"
          >
            OpenAPI Schema <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Networks() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Premium networks</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {networks.map((n) => (
              <button
                key={n.name}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left shadow-card transition-colors hover:border-primary/40"
              >
                <span className="text-sm font-semibold">{n.name}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-rail-live animate-rail-pulse" />
                  {n.active} active
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Suburban locals</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {locals.map((l) => (
              <button
                key={l.city}
                className="rounded-xl border border-border bg-card px-4 py-3 text-left shadow-card transition-colors hover:border-primary/40"
              >
                <span className="block text-sm font-semibold">{l.city} local trains</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {l.active.toLocaleString("en-IN")} services running
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stations() {
  return (
    <section id="stations" className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="text-xl font-bold">Major stations</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Select a station to view live arrivals, departures, and platform assignments.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {stations.map(([name, code]) => {
          if (!code) return null;
          return (
            <Link
              key={code}
              to="/station/$code"
              params={{ code }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-card transition-colors hover:border-primary/40 hover:text-primary"
            >
              {name} <span className="text-muted-foreground">({code})</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20">
      <h2 className="text-2xl font-bold">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="mt-6">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <p className="font-display font-bold text-foreground">RailDristhi</p>
        <p className="mt-2 max-w-2xl">
          An independent transit technology project. Not affiliated with the Ministry of Railways,
          IRCTC or Indian Railways. Timings shown are estimates derived from crowdsourced telemetry.
        </p>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} RailDristhi</p>
      </div>
    </footer>
  );
}
