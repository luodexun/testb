/*
 * @Author: xiongman
 * @Date: 2023-01-31 11:31:08
 * @LastEditors: xiongman
 * @LastEditTime: 2023-01-31 11:31:08
 * @Description: 处理文件导入导出的方法们
 */

import { AxiosResponse } from "axios"

// import { utils as xlsUtils, writeFile as xlsxWriteFile } from "xlsx-js-style"
import { DOWNLOAD_ERROR, DOWNLOAD_SUCCESS } from "@/configs/text-constant.ts"

import { createUUID, showMsg } from "./util-funs"

// 生成formdata对象并赋值参数
export function getFormData(data?: Record<string, any>) {
  const fd = new FormData()
  if (data) {
    Object.entries(data).forEach(([key, val]) => fd.append(key, val))
  }
  return fd
}

// 处理文件导出
export function dealExportDownload(blob: Blob | null, fileName?: string) {
  if (!blob || !blob.size) {
    showMsg(DOWNLOAD_ERROR, "error", { key: "updatable" }).then(() => {})
    return
  }
  try {
    // 创建a标签 添加download属性下载
    const link = document.createElement("a")
    const href = URL.createObjectURL(blob)
    link.style.display = "none" // 创建一个隐藏的a标签
    link.href = href
    if (fileName) {
      link.download = fileName //下载后文件名
    }
    document.body.appendChild(link)
    link.click() //点击下载
    document.body.removeChild(link) //下载完成移除元素
    window.URL.revokeObjectURL(href) //释放掉blob对象
    showMsg(DOWNLOAD_SUCCESS, "success", { key: "updatable" }).then(() => {})
  } catch {
    showMsg(DOWNLOAD_ERROR, "error", { key: "updatable" }).then(() => {})
  }
}

// 导出信息，从响应头中获取文件名称
export function dealDownload4Response(response: AxiosResponse | null, defName = createUUID()) {
  const { headers, data } = response || { headers: { "Content-Disposition": "" }, data: null }
  const fields = ["Content-Disposition", "content-disposition", "Content-disposition"] as (keyof typeof headers)[]
  let contentDisposition: string = ""
  fields.forEach((field) => {
    if ((headers || {})[field]) contentDisposition = (headers || {})[field] as string
  })
  let fileName: string = defName
  if (contentDisposition.includes("filename=")) {
    fileName = contentDisposition.split("filename=").pop()!
    fileName = fileName ? decodeURIComponent(fileName) : defName
  }
  dealExportDownload(data, fileName)
}

// export function exportTableData(data: (string | number | boolean | null)[][], options: any, fileName: string) {
//   const worksheet = xlsUtils.aoa_to_sheet(data)
//   if (options && options["cols"]) worksheet["!cols"] = options["cols"] // 设置每列的列宽，10代表10个字符，注意中文占2个字符
//   if (options && options["merges"]) worksheet["!merges"] = options["merges"] //[{ e: { c: 1, r: 1 }, s: { c: 0, r: 0 } }]; //合并单元格
//   if (options && options["styles"]) {
//     options["styles"].forEach((style: any) => {
//       worksheet[xlsUtils.encode_cell(style.cell)].s = style.style
//     })
//   }
//
//   // 新建一个工作簿
//   const workbook = xlsUtils.book_new() //创建虚拟workbook
//   /* 将工作表添加到工作簿,生成xlsx文件(book,sheet数据,sheet命名)*/
//   xlsUtils.book_append_sheet(workbook, worksheet, "Sheet1")
//   /* 输出工作表， 由文件名决定的输出格式(book,xlsx文件名称)*/
//   xlsxWriteFile(workbook, fileName)
// }
