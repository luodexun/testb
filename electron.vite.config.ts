import { resolve } from "node:path"

import { defineConfig, externalizeDepsPlugin, splitVendorChunkPlugin } from "electron-vite"

import { configDefine, configPlugins, configRenderBuildEle, configResolve } from "./vite-options"

export default defineConfig({
  main: {
    build: {
      outDir: "dist/main",
      rollupOptions: {
        input: {
          index: resolve(__dirname, "electron/main/index.ts"),
        },
      },
    },
    plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()],
  },
  preload: {
    build: {
      outDir: "dist/preload",
      rollupOptions: {
        input: { index: resolve(__dirname, "electron/preload/index.ts") },
      },
    },
    plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()],
  },
  renderer: {
    root: ".",
    build: configRenderBuildEle,
    define: configDefine,
    plugins: configPlugins,
    resolve: configResolve,
  },
})
