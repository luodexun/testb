/*
 * @Author: xiongman
 * @Date: 2022-11-25 16:36:12
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-25 16:36:12
 * @Description: 接口方法的数据类型们
 */

import { AxiosProgressEvent } from "axios"

export interface IApiMapItem extends Record<string, IApiItem> {}

export interface IApiListen {
  onUploadProgress?: (even: AxiosProgressEvent) => void
}

export interface IBaseResponse<TData = any> {
  code: string
  msg: string | null
  success?: boolean
  data: TData
}
export interface IRecordResponse<TData = any> {
  total?: number
  list?: TData[]
  records?: TData[]
  pageNum?: number
  pageSize?: number
  size?: number
  startRow?: number
  endRow?: number
  pages?: number
  prePage?: number
  nextPage?: number
  isFirstPage?: boolean
  isLastPage?: boolean
  hasPreviousPage?: boolean
  hasNextPage?: boolean
  navigatePages?: number
  navigatepageNums?: number[]
  navigateFirstPage?: number
  navigateLastPage?: number
}

// 保存到本地数据的配置数据类型
export type TStorageInfo = {
  key: string
  store: "sessionStorage" | "localStorage"
  refresh?: true
  urlKey?: string // 接口信息
  desc?: string // 描述
}

type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } & { [P in U]: never } & {
  [x: string]: never
})[T]

// 重写指定类型下的属性
export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U
