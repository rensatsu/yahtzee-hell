import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        port: process.env.HTTP_PORT ?? 7500
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src")
        }
    },
    // allowNodeBuiltins: ["pouchdb", "pouchdb-browser", "pouchdb-utils"],
    define: {
        global: "window",
        // process: { env: {} }
    }
});
