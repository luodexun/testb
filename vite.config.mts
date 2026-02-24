/*
 * @Author: chenmeifeng
 * @Date: 2023-11-15 14:33:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-09 16:18:40
 * @Description:
 */
// import react from "@vitejs/plugin-react"
// import path from "path"
import { defineConfig } from "vite"

// import VitePluginCompression from "vite-plugin-compression"
// import svgr from "vite-plugin-svgr"
// import stripPublicDir from "./plugins/strip-public-dir"
import { configDefine, configEnv, configPlugins, configRenderBuild, configResolve } from "./vite-options"

// function resolvePath(dir = "./src") {
//   return path.resolve(__dirname, dir)
// }
//
// const env = loadEnv(process.env.MODE!, process.cwd(), "")

// https://vitejs.dev/config/
export default defineConfig({
  build: configRenderBuild,
  // {
  //   outDir: "dist/renderer",
  //   rollupOptions: {
  //     output: {
  //       chunkFileNames: "assets/js/[name]-[hash].js",
  //       assetFileNames: "assets/[ext]/[name]-[hash][extname]",
  //     },
  //   },
  //   minify: "terser",
  //   terserOptions: {
  //     compress: {
  //       drop_console: env.NODE_ENV !== "development",
  //       drop_debugger: true,
  //     },
  //   },
  // },
  define: configDefine,
  //  {
  //   "process.env": env,
  // },
  plugins: configPlugins,
  //  [
  //   react(),
  //   svgr(),
  //   VitePluginCompression({ deleteOriginFile: false }),
  //   stripPublicDir({ remainList: ["favicon.ico", "icon.png", "images", "model", "mqtt-client"] }),
  // ],
  resolve: configResolve,
  // {
  //   alias: {
  //     "@": resolvePath(),
  //     "@pages": resolvePath("./src/pages"),
  //     "@configs": resolvePath("./src/configs"),
  //     "@hooks": resolvePath("./src/hooks"),
  //     "@store": resolvePath("./src/store"),
  //     "@utils": resolvePath("./src/utils"),
  //   },
  // },

  server: {
    port: Number(configEnv.VITE_DEV_PORT),
    open: false,
    proxy: {
      "/ness": {
        target: `${configEnv.VITE_API_HOST}:${configEnv.VITE_API_PORT}`,
        changeOrigin: true,
        cookieDomainRewrite: "",
        secure: false,
      },
      "/rule": {
        target: `${configEnv.VITE_API_HOST}:18090`,
        changeOrigin: false,
        cookieDomainRewrite: "",
        secure: false,
        // rewrite: (path) => path.replace(/^\/gg/, "/"),
      },
    },
  },
})
