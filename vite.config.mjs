import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ["resources/js/App.css", "resources/js/main.jsx"],
            // input: [
            //     "public/build/assets/App-344b9aaa.css",
            //     "public/build/assets/App-18cc471d.js",
            // ],
            refresh: true,
        }),
        // tailwindcss(),
    ],
    
});
