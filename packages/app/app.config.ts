import { defineConfig } from "@solidjs/start/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  vite: {
    plugins: [vanillaExtractPlugin()],
  },
});
