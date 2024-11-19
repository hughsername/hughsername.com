import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [solidJs()],
  output: 'server',
  adapter: netlify(),
  vite: {
    build: {
      cssCodeSplit: true
    }
  }
});
