/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:29:54
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-27 10:29:54
 * @Description: 页面的参数类型
 */

import { MutableRefObject } from "react"

import { IFormInst } from "@/components/custom-form/types.ts"
import { TDeviceType } from "@/types/i-config.ts"
export interface IBaseProps {
  title?: string
  className?: string
}

export interface IBaseChartProps<TData, TForm = any> {
  data: TData
  loading?: boolean
  formRef?: MutableRefObject<IFormInst<TForm> | null>
}

export interface IBaseChartOption {
  xAxis?: string[] | number[]
  data?: number[]
}

// 图表y轴可变情况的数据结构
export type TYAxisInfo = {
  [dvsType in TDeviceType]?: {
    title: string
    unit: string
    position: "left" | "right"
    offset?: number
  }[]
}
