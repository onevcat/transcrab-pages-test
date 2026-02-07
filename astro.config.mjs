import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages deployment (repo pages)
  site: 'https://onevcat.github.io',
  base: '/transcrab-pages-test',
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
