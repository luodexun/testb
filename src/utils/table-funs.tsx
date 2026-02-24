/*
 * @Author: xiongman
 * @Date: 2022-12-01 16:01:20
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-18 11:05:26
 * @Description: 页面表格操作方法们-查询、导出
 */

import { TEXT_ACTION } from "@configs/text-constant.ts"
import { ColumnsType } from "antd/es/table"

import ActionButtons from "@/components/action-buttons"
import { IActBtnProps, IActInfo } from "@/components/action-buttons/types.ts"
import { IPageInfo } from "@/types/i-table.ts"

export type TSearchFuns<TForm = any, TData = any> = {
  setTotal?: (t: number) => void
  setDataSource?: (t: TData[]) => void
  setLoading?: (t: boolean) => void
  setColumns?: (col: ColumnsType<any>) => void
  serveFun: (p: IPageInfo, t: TForm) => Promise<{ records: TData[]; total?: number; columns?: ColumnsType<any> } | null>
  dealRecords?: (data: TData[]) => TData[]
}
export async function commonSearch<TForm = any, TData = any>(
  pageInfo: IPageInfo,
  formData: TForm,
  funs: TSearchFuns<TForm, TData>,
): Promise<void> {
  const { setTotal, setDataSource, setLoading, serveFun, setColumns, dealRecords } = funs
  setLoading && setLoading(true)
  setDataSource && setDataSource([])
  const data = await serveFun(pageInfo, formData)
  const { records, total, columns } = data || { records: [], total: 0 }
  addTableIndex(records, pageInfo)
  const dataSource = dealRecords ? dealRecords(records) : records
  setDataSource && setDataSource(dataSource)
  setTotal && setTotal(total || 0)
  setColumns && setColumns(columns || [])
  return setLoading && setLoading(false)
}

// 表格数据添加序号字段数据
export function addTableIndex(dataSource?: any[], pageInfo?: { current: number; pageSize: number }) {
  if (!dataSource?.length) return
  if (!pageInfo) return
  const { current, pageSize } = pageInfo
  if (current < 1) return
  const baseCount = (current - 1) * pageSize + 1
  dataSource.forEach((item, i) => (item.index = baseCount + i))
}

// 前端分页处理
export function listPagination<TD>(list: TD[], pageInfo: IPageInfo): TD[] {
  const total = list?.length ?? 0
  if (!total) return []
  const { current, pageSize } = pageInfo
  let startIndex = (current - 1) * pageSize
  if (startIndex < 0) startIndex = 0
  const endIndex = startIndex + pageSize
  return list.slice(startIndex, endIndex)
}

export function joinFormValue(data?: (string | number) | (string | number)[], defValue?: string) {
  if (typeof data === "string" || typeof data === "number") return `${data}`
  if (!Array.isArray(data)) return ""
  return (data || []).join(",") || defValue
}

// 拆分字符串为数组
export function joinIdStr2IdArr(idStr?: string | string[] | null, flag = ","): string[] {
  if (!idStr) return []
  if (Array.isArray(idStr)) return idStr
  return idStr.split(flag)
}

// 获取表格操作列配置数据方法
export function getTableActColumn<TD, TAct extends IActInfo>(
  btns: IActInfo[],
  props: (record: TD) => IActBtnProps<TAct>,
  headProps?: IActBtnProps<TAct>,
  columnsProps?: any,
): ColumnsType<TD> {
  if (!btns.length) return []
  return [
    {
      title: !headProps ? TEXT_ACTION : <ActionButtons<TAct> items={btns} {...headProps} />,
      align: "center",
      width: !columnsProps ? 80 : columnsProps.width,
      fixed: columnsProps.fixed,
      render: (record: TD) => <ActionButtons<TAct> items={btns} {...props(record)} />,
    },
  ]
}

export const tableSortByKey = (key, time = false) => {
  return (a, b) => a[key] - b[key]
}
export const tableSortByKeyByChina = (key) => {
  return (a, b) => {
    const aStr = a[key] ?? '';
    const bStr = b[key] ?? '';
    return String(aStr).localeCompare(String(bStr));
  }
}
