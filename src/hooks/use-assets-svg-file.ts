/*
 * @Author: xiongman
 * @Date: 2023-11-24 16:02:24
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-24 16:02:24
 * @Description:
 */

import { validResErr } from "@utils/util-funs.tsx"
import { useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs.ts"

interface IParams {
  importPath: string
}
export default function useAssetsSvgFile(params: IParams) {
  const { importPath } = params
  const [fileContent, setFileContent] = useState<string>()
  useEffect(() => {
    ;(async function () {
      const fileData = await doBaseServer<{ filePath: string }>("getAssetsFile", { filePath: importPath })
      if (validResErr(fileData)) return
      setFileContent(fileData)
    })()
  }, [importPath])

  return { fileContent }
}

interface IChgSvgStyleParams {
  svg: string
  value: string
  attr?: string | RegExp
}
export function changeSvgStyle(params: IChgSvgStyleParams) {
  const { svg, value, attr = "inherit" } = params
  if (!svg) return
  return svg.replace(attr, value)
}
