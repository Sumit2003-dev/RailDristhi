import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { features, networks, locals, stations, faqs } from "@/data/rail";
import { useTranslation } from "@/lib/i18n";

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="tools" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-bold sm:text-3xl">{t("home.featuresHeading")}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("home.featuresSubheading")}</p>
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
  const { t } = useTranslation();

  return (
    <section id="api" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground shadow-float sm:p-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-primary-foreground/10 blur-2xl animate-rail-slide" />
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
          <Sparkles className="size-3.5" /> {t("home.forDevelopers")}
        </p>
        <h2 className="mt-4 max-w-xl text-2xl font-bold sm:text-3xl">{t("home.apiHeading")}</h2>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85">
          {t("home.apiSubheading")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/developer"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground shadow-xs hover:bg-secondary/90 transition-colors"
          >
            {t("home.devSandbox")}
          </Link>
          <a
            href="/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/40 bg-transparent px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground transition-colors"
          >
            {t("home.openApiSchema")} <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Networks() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">{t("home.premiumNetworks")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {networks.map((n) => (
              <button
                key={n.name}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left shadow-card transition-colors hover:border-primary/40"
              >
                <span className="text-sm font-semibold">{n.name}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-rail-live animate-rail-pulse" />
                  {t("home.activeCount", { count: n.active })}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{t("home.suburbanLocals")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {locals.map((l) => (
              <button
                key={l.city}
                className="rounded-xl border border-border bg-card px-4 py-3 text-left shadow-card transition-colors hover:border-primary/40"
              >
                <span className="block text-sm font-semibold">{l.city}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t("home.servicesRunning", { count: l.active.toLocaleString("en-IN") })}
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
  const { t } = useTranslation();

  return (
    <section id="stations" className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="text-xl font-bold">{t("home.majorStations")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("home.majorStationsSub")}</p>
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
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-3xl px-4 pb-20">
      <h2 className="text-2xl font-bold">{t("home.faqHeading")}</h2>
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
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <p className="font-display font-bold text-foreground">RailDristhi</p>
        <p className="mt-2 max-w-2xl">{t("home.footerDisclaimer")}</p>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} RailDristhi</p>
      </div>
    </footer>
  );
}
