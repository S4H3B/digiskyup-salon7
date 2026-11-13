import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, forward /api calls to the Express server so no env file is needed.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
});
