import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [solidJs(), mdx()],
  output: 'server',
  adapter: netlify(),
  vite: {
    build: {
      cssCodeSplit: true
    }
  }
});
