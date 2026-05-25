import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(() => {
    return {
        plugins: [react()],
        resolve: {
            tsconfigPaths: true,
        },
        server: {
            proxy: {
                '/api': {
                    target: process.env.HAFFA_BACKEND_URL || 'http://localhost:4000',
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: 'build',
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['src/setupTests.ts'],
        },
    }
})
