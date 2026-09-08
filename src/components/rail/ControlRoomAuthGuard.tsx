import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  UserCheck,
  Building2,
  ArrowRight,
  LogOut,
  Radio,
  SlidersHorizontal,
  Activity,
  AlertTriangle,
  BadgeAlert,
  Sparkles,
  TrainFront,
} from "lucide-react";
import { useAuth, PRESET_AUTHORITIES, type AuthorityUser } from "@/lib/auth";

interface ControlRoomAuthGuardProps {
  children: React.ReactNode;
}

export function ControlRoomAuthGuard({ children }: ControlRoomAuthGuardProps) {
  const { user, isAuthenticated, login, loginAsPreset, logout } = useAuth();
  const [badgeId, setBadgeId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await login(badgeId, pin);
      if (!res.success && res.error) {
        setError(res.error);
      }
    } catch {
      setError("Authentication error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If authenticated, render the authorized officer banner + full dashboard
  if (isAuthenticated && user) {
    return (
      <div className="space-y-6">
        {/* Active Authority Session Header Banner */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-primary/5 to-card p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 shrink-0">
                <ShieldCheck className="size-6" />
                <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-foreground">{user.name}</span>
                  <Badge
                    variant="outline"
                    className="font-mono bg-background text-[11px] border-primary/30 text-primary font-semibold"
                  >
                    {user.badgeId}
                  </Badge>
                  <Badge className="bg-emerald-600/90 text-white text-[10px] uppercase font-semibold">
                    Authorized Clearance
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                  <span className="font-medium text-foreground">{user.roleTitle}</span>
                  <span>•</span>
                  <span>{user.zone}</span>
                  <span>•</span>
                  <span>{user.division}</span>
                  {user.stationCode && (
                    <>
                      <span>•</span>
                      <span className="font-mono font-semibold text-primary">
                        Station: {user.stationCode}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <div className="text-right hidden md:block">
                <p className="text-[11px] text-muted-foreground">Session Active</p>
                <p className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                  <Radio className="size-3 animate-pulse" /> Live Telemetry Linked
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-xl border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 gap-1.5 text-xs font-medium"
              >
                <LogOut className="size-3.5" /> Switch Authority / Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* The full Control Room Dashboard */}
        {children}
      </div>
    );
  }

  // If unauthenticated, render the Restricted Access Guard UI
  return (
    <div className="py-6 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Warning & Security Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <Lock className="size-3.5" />
            <span>Restricted Operational Console — Level 3/4 Clearance Required</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Section Controller & Dispatcher Login
          </h2>

          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            The Central Control Room provides pan-India 16-zone telemetry, real-time fleet
            bottleneck alerts, and section precedence override dispatch controls. Access is
            restricted to authorized Indian Railways personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Security Information & Capabilities */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="pb-3 bg-secondary/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="size-4 text-primary" /> Control Room Capabilities
                </CardTitle>
                <CardDescription className="text-xs">
                  Operational features unlocked upon authentication:
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="size-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      16-Zone Congestion Telemetry
                    </span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Live fleet On-Time Performance (OTP %) and zonal delay distributions across
                      NR, WR, CR, SR, ER, etc.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="size-5 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="size-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Critical Bottleneck Interceptor
                    </span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Identifies trains running &gt;60 mins late with active root-cause analysis and
                      automated precedence advice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="size-5 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <SlidersHorizontal className="size-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Dispatch Priority Engine</span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Section controller tools for automated platform allocation and loop-line
                      bypass decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 text-[11px] text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <BadgeAlert className="size-3.5 text-primary" />
                <span>Smart India Hackathon 2026 Evaluation Note</span>
              </div>
              <p>
                Judges and evaluators can use the <strong>Quick Demo Profiles</strong> tab to
                instantly log in as a Chief Section Controller, Chief Dispatch Officer, or Station
                Director.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Login Card */}
          <div className="lg:col-span-7">
            <Card className="border-border shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-primary/95 to-slate-900 p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                    <TrainFront className="size-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Authority Access Gateway</h3>
                    <p className="text-xs text-white/80">
                      Ministry of Railways • Section Operations & Dispatch
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-5 sm:p-6">
                <Tabs defaultValue="presets" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-5">
                    <TabsTrigger value="presets" className="text-xs font-semibold gap-1.5">
                      <Sparkles className="size-3.5 text-amber-500" /> Quick Demo Profiles
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="text-xs font-semibold gap-1.5">
                      <KeyRound className="size-3.5" /> Staff Badge & PIN
                    </TabsTrigger>
                  </TabsList>

                  {/* Quick Select Preset Officers */}
                  <TabsContent value="presets" className="space-y-3 mt-0">
                    <p className="text-xs text-muted-foreground">
                      Click any official authority profile below to log in directly:
                    </p>

                    <div className="space-y-2.5">
                      {PRESET_AUTHORITIES.map((auth) => (
                        <button
                          key={auth.id}
                          onClick={() => loginAsPreset(auth)}
                          className="w-full text-left rounded-xl border border-border bg-background p-3.5 transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 hover:shadow-md group flex items-center justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              <UserCheck className="size-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                  {auth.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] font-mono py-0 h-4"
                                >
                                  {auth.badgeId}
                                </Badge>
                              </div>
                              <p className="text-xs text-primary font-medium">{auth.roleTitle}</p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Building2 className="size-3" /> {auth.zone} • {auth.division}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-all">
                            <span className="hidden sm:inline">Access</span>
                            <ArrowRight className="size-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Manual Form Login */}
                  <TabsContent value="manual" className="space-y-4 mt-0">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                          <ShieldAlert className="size-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="guardBadgeId"
                          className="text-xs font-semibold flex items-center gap-1.5"
                        >
                          <UserCheck className="size-3.5 text-muted-foreground" /> Railway Staff
                          Badge ID
                        </Label>
                        <Input
                          id="guardBadgeId"
                          placeholder="e.g. IR-CTRL-782"
                          value={badgeId}
                          onChange={(e) => setBadgeId(e.target.value)}
                          className="font-mono uppercase text-sm"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Example badge:{" "}
                          <code className="bg-muted px-1 rounded text-primary font-semibold">
                            IR-CTRL-782
                          </code>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="guardPin"
                          className="text-xs font-semibold flex items-center gap-1.5"
                        >
                          <KeyRound className="size-3.5 text-muted-foreground" /> Security PIN /
                          Password
                        </Label>
                        <Input
                          id="guardPin"
                          type="password"
                          placeholder="Enter security PIN"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="text-sm"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Default PIN:{" "}
                          <code className="bg-muted px-1 rounded text-primary font-semibold">
                            rail2026
                          </code>
                        </p>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded-xl font-bold h-11 gap-2 text-sm shadow-md"
                        >
                          {isSubmitting ? (
                            "Verifying Security Clearance..."
                          ) : (
                            <>
                              <Lock className="size-4" /> Authenticate & Access Control Room
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
