import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"

/** @type {import("vite").UserConfig} */
export default defineConfig({
	base: "./",
	plugins: [
		vue(),
		svgLoader()
	],
	root: "src",
	build: {
		minify: false,
		outDir: resolve(__dirname, "build"),
		emptyOutDir: true,
		rollupOptions: {
			output: {
				
				sourcemapBaseUrl: "https://example.com"
			}
		}
	},
	server: {
		open: true
	}
})
