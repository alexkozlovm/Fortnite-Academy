import { resolve } from 'path';
import { defineConfig } from 'vite';
import { sync as globSync } from 'glob';
import customMarkdownPlugin from './vite-plugin-custom-markdown.js';

const __dirname = new URL('.', import.meta.url).pathname;

// The build process now only needs to know about the main HTML files.
// Our custom plugin will handle generating the blog pages.
const entryPoints = {
  ...Object.fromEntries(
    globSync('./*.html').map(file => [
      file.slice(2, file.length - '.html'.length),
      resolve(__dirname, file)
    ])
  )
};

export default defineConfig({
  publicDir: 'assets',

  plugins: [
    customMarkdownPlugin(),
  ],

  build: {
    rollupOptions: {
      input: entryPoints,
    },
  },
});

