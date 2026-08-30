import { cn } from "@/lib/utils";
import { confidenceTier } from "@/lib/liveStatus";

export function EtaConfidenceBadge({
  confidence,
  className,
}: {
  confidence: number;
  className?: string;
}) {
  const tier = confidenceTier(confidence);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-semibold",
        tier.tone,
        className,
      )}
      title={`Prediction confidence: ${Math.round(confidence * 100)}%`}
    >
      {tier.label} · {Math.round(confidence * 100)}%
    </span>
  );
}
