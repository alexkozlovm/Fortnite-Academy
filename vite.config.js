import { defineConfig } from 'vite';
import customMarkdownPlugin from './vite-plugin-custom-markdown.js';

export default defineConfig({
  plugins: [
    // We are still using our custom plugin, but its internal logic is now correct.
    customMarkdownPlugin()
  ],
  // We no longer need the complex build options for the dev server.
});

