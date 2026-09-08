import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  UserCheck,
  Building2,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useAuth, PRESET_AUTHORITIES, type AuthorityUser } from "@/lib/auth";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, loginAsPreset } = useAuth();
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
      } else {
        setBadgeId("");
        setPin("");
      }
    } catch {
      setError("Authentication error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (preset: AuthorityUser) => {
    loginAsPreset(preset);
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border bg-card shadow-2xl">
        {/* Header with Railway Security Header */}
        <div className="bg-gradient-to-r from-slate-900 via-primary/90 to-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
            <ShieldAlert className="size-6 text-amber-400" />
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Indian Railways Authority Portal
          </DialogTitle>

          <DialogDescription className="text-xs text-white/80 mt-1 max-w-sm mx-auto">
            Restricted Access Control — Ministry of Railways / Section Operations & Dispatch Console
          </DialogDescription>

          <div className="mt-3 flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="bg-white/10 text-white border-white/20 text-[10px] uppercase tracking-wider py-0.5 px-2"
            >
              SIH 2026 Authorized Access
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-5">
              <TabsTrigger value="presets" className="text-xs font-medium">
                ⚡ Quick Demo Profiles
              </TabsTrigger>
              <TabsTrigger value="manual" className="text-xs font-medium">
                🔑 Badge ID & PIN
              </TabsTrigger>
            </TabsList>

            {/* Quick Demo Profiles for SIH Evaluation */}
            <TabsContent value="presets" className="space-y-3 mt-0">
              <div className="rounded-lg bg-secondary/50 p-2.5 text-xs text-muted-foreground flex items-start gap-2 border border-border/50">
                <Info className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Select any pre-verified Indian Railways authority profile below to instantly
                  authenticate into the Control Room.
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {PRESET_AUTHORITIES.map((auth) => (
                  <button
                    key={auth.id}
                    onClick={() => handleSelectPreset(auth)}
                    className="w-full text-left rounded-xl border border-border bg-background p-3.5 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/40 hover:shadow-md group flex items-center justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                        <UserCheck className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {auth.name}
                          </span>
                          <Badge variant="secondary" className="text-[10px] font-mono py-0 h-4">
                            {auth.badgeId}
                          </Badge>
                        </div>
                        <p className="text-xs text-primary font-medium">{auth.roleTitle}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="size-3" /> {auth.zone} • {auth.division}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
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
                    htmlFor="badgeId"
                    className="text-xs font-medium flex items-center gap-1.5"
                  >
                    <UserCheck className="size-3.5 text-muted-foreground" /> Official Railway Staff
                    / Badge ID
                  </Label>
                  <Input
                    id="badgeId"
                    placeholder="e.g. IR-CTRL-782"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="font-mono uppercase text-sm"
                    autoFocus
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Try{" "}
                    <code className="bg-muted px-1 rounded text-primary font-semibold">
                      IR-CTRL-782
                    </code>{" "}
                    or{" "}
                    <code className="bg-muted px-1 rounded text-primary font-semibold">
                      IR-DISP-409
                    </code>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pin" className="text-xs font-medium flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-muted-foreground" /> 4-Digit Security PIN /
                    Password
                  </Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter security PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Demo PIN:{" "}
                    <code className="bg-muted px-1 rounded text-primary font-semibold">
                      rail2026
                    </code>
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-semibold gap-2"
                  >
                    {isSubmitting ? (
                      "Verifying Security Clearance..."
                    ) : (
                      <>
                        <Lock className="size-4" /> Authenticate & Access Console
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Security Notice Footer */}
          <div className="mt-5 pt-4 border-t border-border/60 text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
            <span>Encrypted Session with 256-bit Ministry of Railways TLS token.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
