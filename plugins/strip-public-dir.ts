/*
 * @Author: xiongman
 * @Date: 2023-11-15 13:37:23
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-15 13:37:23
 * @Description:
 */

import fs from "fs"
import path from "path"

export default function stripPublicDir(options: { remainList?: string[] }): any {
  const { remainList } = options
  return {
    name: "strip-dev-css",
    resolveId(source: string) {
      return source === "virtual-module" ? source : null
    },
    renderStart(outputOptions: { dir: string }) {
      const outDir = outputOptions.dir
      if (!remainList?.length) {
        return dealDelete(outDir, "stationSvg")
      }
      fs.readdir(outDir, (err, files) => {
        if (err) return
        files.forEach((theName) => {
          if (remainList.includes(theName)) return
          dealDelete(outDir, theName)
        })
      })
    },
  }
}

function dealDelete(pathName: string, name: string) {
  const delDir = path.resolve(pathName, name)
  fs.rm(delDir, { recursive: true }, () => console.log(`Deleted ${delDir}`))
}
