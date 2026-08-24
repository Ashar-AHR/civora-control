import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isProduction = mode === 'production';

  if (isProduction && env.VITE_USE_FIREBASE_EMULATORS === 'true') {
    throw new Error('Production build cannot enable Firebase emulators.');
  }

  return {
    plugins: [react()],
    base: '/civora-control/',
    build: {
      sourcemap: false,
      target: 'es2022',
    },
  };
});
