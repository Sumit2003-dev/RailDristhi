import { CloudRain, TrainFront, Wrench, TriangleAlert, Signal, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DelayReason } from "@/lib/delayReasons";

const reasonIcon: Record<DelayReason, LucideIcon> = {
  weather: CloudRain,
  congestion: TrainFront,
  "track-work": Wrench,
  "signal-failure": Signal,
  technical: TriangleAlert,
  unknown: HelpCircle,
};

const reasonTone: Record<DelayReason, string> = {
  weather: "text-sky-600",
  congestion: "text-amber-600",
  "track-work": "text-orange-600",
  "signal-failure": "text-red-600",
  technical: "text-purple-600",
  unknown: "text-muted-foreground",
};

const reasonLabel: Record<DelayReason, string> = {
  weather: "Weather",
  congestion: "Congestion",
  "track-work": "Track work",
  "signal-failure": "Signal",
  technical: "Technical",
  unknown: "Unknown",
};

export function DelayReasonTag({ reason, className }: { reason: DelayReason; className?: string }) {
  const Icon = reasonIcon[reason] ?? HelpCircle;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-semibold",
        reasonTone[reason],
        className,
      )}
    >
      <Icon className="size-3" />
      {reasonLabel[reason]}
    </span>
  );
}
