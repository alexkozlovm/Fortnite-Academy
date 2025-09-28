import { resolve } from 'path';
import { defineConfig } from 'vite';
import { sync as globSync } from 'glob';
import customMarkdownPlugin from './vite-plugin-custom-markdown.js';

// A helper to get the current directory path in an ES module environment
const __dirname = new URL('.', import.meta.url).pathname;

// Find all HTML and blog markdown files to use as entry points for Vite.
// We use globSync which is the ES module equivalent of glob.sync.
const entryPoints = {
  ...Object.fromEntries(
    globSync('./*.html').map(file => [
      // Creates a clean name like 'index' or 'free-coaching' from './index.html'
      file.slice(2, file.length - '.html'.length),
      resolve(__dirname, file)
    ])
  ),
  ...Object.fromEntries(
    globSync('./blog/*.md').map(file => [
      // Creates a clean name like 'blog/how-to-vod-review' from './blog/how-to-vod-review.md'
      `blog/${file.slice('./blog/'.length, file.length - '.md'.length)}`,
      resolve(__dirname, file)
    ])
  )
};

export default defineConfig({
  // This tells Vite to copy the 'assets' folder directly to the
  // final build output. This is what makes your images and styles work on Vercel.
  publicDir: 'assets',

  plugins: [
    customMarkdownPlugin(),
  ],

  build: {
    rollupOptions: {
      // This tells Vite to build every page, not just index.html.
      // This is what fixes the 404 errors on Vercel.
      input: entryPoints,
    },
  },
});

