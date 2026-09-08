import {
  TrainFront,
  Menu,
  Lock,
  ShieldCheck,
  LogOut,
  UserCheck,
  ChevronDown,
  Radio,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "@/components/rail/LanguageSelector";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { t } = useTranslation();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const nav = [
    { key: "liveStatus", label: t("nav.liveStatus"), to: "/", hash: "tools" },
    { key: "between", label: t("nav.between"), to: "/", hash: "between" },
    { key: "pnrStatus", label: t("nav.pnrStatus"), to: "/pnr" },
    { key: "liveMap", label: t("nav.liveMap"), to: "/network" },
    { key: "controlRoom", label: t("nav.controlRoom"), to: "/control-room", isProtected: true },
  ];

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
              key={item.key}
              to={item.to}
              {...(item.hash ? { hash: item.hash } : {})}
              activeProps={{
                className: "bg-secondary font-semibold text-secondary-foreground",
              }}
              inactiveProps={{
                className: "text-muted-foreground hover:bg-secondary hover:text-foreground",
              }}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <span>{item.label}</span>
              {item.isProtected &&
                (isAuthenticated ? (
                  <span
                    className="flex size-2 rounded-full bg-emerald-500 animate-pulse"
                    title="Authorized Section Access"
                  />
                ) : (
                  <Lock className="size-3 text-muted-foreground/70" />
                ))}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full pl-2.5 pr-3 py-1 gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    <ShieldCheck className="size-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <Badge variant="secondary" className="text-[9px] font-mono px-1 py-0 h-3.5">
                      {user.badgeId}
                    </Badge>
                  </div>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <UserCheck className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{user.name}</p>
                      <p className="text-[11px] font-medium text-primary">{user.roleTitle}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground font-mono bg-muted p-1.5 rounded">
                    <div>Badge: {user.badgeId}</div>
                    <div>Zone: {user.zone}</div>
                    <div>Division: {user.division}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/control-room"
                    className="cursor-pointer text-xs font-medium flex items-center justify-between"
                  >
                    <span>Control Room Console</span>
                    <Radio className="size-3 text-emerald-500 animate-pulse" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-xs font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="size-3.5 mr-2" />
                  <span>Sign Out / Switch User</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={openAuthModal}
              className="hidden sm:inline-flex rounded-full px-5 font-semibold text-xs gap-1.5"
            >
              <Lock className="size-3.5" />
              <span>Authority Login</span>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button size="icon" variant="ghost" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <div className="mt-8 space-y-6">
                <nav className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      {...(item.hash ? { hash: item.hash } : {})}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      {item.isProtected &&
                        (isAuthenticated ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          >
                            Unlocked
                          </Badge>
                        ) : (
                          <Lock className="size-3.5 text-muted-foreground" />
                        ))}
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-border pt-4">
                  <LanguageSelector variant="mobile" />
                </div>

                <div className="pt-2">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-bold text-foreground">{user.name}</p>
                        <p className="text-[11px] text-primary">{user.roleTitle}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">
                          {user.badgeId} • {user.zone}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={logout}
                        className="w-full rounded-xl font-semibold text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <LogOut className="size-4 mr-2" /> Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={openAuthModal}
                      className="w-full rounded-xl font-semibold gap-1.5"
                    >
                      <Lock className="size-4" /> Authority Login
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
