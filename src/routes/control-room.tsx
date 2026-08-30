import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { ControlRoomDashboard } from "@/components/rail/ControlRoomDashboard";

export const Route = createFileRoute("/control-room")({
  component: ControlRoomPage,
  head: () => ({
    meta: [
      { title: "Control room — RailDristhi" },
      {
        name: "description",
        content:
          "Control-room dashboard: predicted ETA, delay causes and network-wide alerts from the RailDristhi forecasting model.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ControlRoomPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Control room</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Network-wide ETA forecasts, delay causes and alerts from the prediction model.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <ControlRoomDashboard />
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}
