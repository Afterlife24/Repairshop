import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '63749e269cfc.ngrok-free.app' // Add your ngrok host here
    ]
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});