import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { NetworkMap } from "@/components/rail/NetworkMap";

export const Route = createFileRoute("/network")({
  component: NetworkPage,
  head: () => ({
    meta: [
      { title: "Live network map — RailDristhi" },
      {
        name: "description",
        content: "See every tracked train across the Indian Railways network on one live GPS map.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NetworkPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Live network map</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every tracked train positioned in real time across the Indian Railways network.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-3 shadow-card">
          <NetworkMap className="h-[520px] w-full lg:h-[640px]" />
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}
