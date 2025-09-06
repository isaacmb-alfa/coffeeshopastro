// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [
            tailwindcss(),
        ]
    },
    image: {
        domains: ['localhost:8080'],
        remotePatterns: [{
            protocol: 'http',
            hostname: 'localhost',
            port: '8080',
            pathname: '/wp-content/uploads/**'
        }]
    },
});
