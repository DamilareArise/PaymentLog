import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Skip the proxy for browser page navigations (Accept: text/html).
// This prevents routes like /staff/payments from being forwarded to the
// backend when the user refreshes the page, while still proxying real API calls.
const bypassHtml = (req) => {
  if (req.headers.accept?.includes('text/html')) return req.url;
};

const proxyTarget = { target: 'http://localhost:3000', changeOrigin: true, bypass: bypassHtml };

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':      proxyTarget,
      '/pay':       proxyTarget,
      '/students':  proxyTarget,
      '/staff':     proxyTarget,
      '/subjects':  proxyTarget,
      '/dashboard': proxyTarget,
    },
  },
});
