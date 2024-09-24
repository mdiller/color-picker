import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

/** @type {import("vite").UserConfig} */
export default defineConfig({
	base: "./",
	plugins: [
		vue()
	],
	root: "src",
	build: {
		minify: false,
		outDir: resolve(__dirname, "build"),
		emptyOutDir: true
	},
	server: {
		open: true
	}
})
