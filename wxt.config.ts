import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    permissions: ['storage'],
    content_scripts: [
      {
        matches: ['*://*/*'],
        js: ['content-scripts/content.js'],
        run_at: 'document_idle',
      },
    ],
  }
});
