import { TrainFront, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { label: "Live Status", to: "/", hash: "tools" },
  { label: "Between", to: "/", hash: "between" },
  { label: "PNR Status", to: "/pnr" },
  { label: "Live Map", to: "/network" },
  { label: "Control Room", to: "/control-room" },
  { label: "API Docs", to: "/developer" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground shadow-float">
            <TrainFront className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Rail<span className="text-primary">Dristhi</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...(item.hash ? { hash: item.hash } : {})}
              activeProps={{
                className: "bg-secondary font-semibold text-secondary-foreground",
              }}
              inactiveProps={{
                className: "text-muted-foreground hover:bg-secondary hover:text-foreground",
              }}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-full px-5">
            Sign in
          </Button>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button size="icon" variant="ghost" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="mt-10 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    {...(item.hash ? { hash: item.hash } : {})}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
