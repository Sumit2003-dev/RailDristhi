import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      server: {
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        entry: "server",
      },
    }),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
});

