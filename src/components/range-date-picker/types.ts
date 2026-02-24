/*
 * @Author: xiongman
 * @Date: 2022-11-17 11:01:38
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-17 11:01:38
 * @Description: 类型时间选择组件-数据类型
 */

import type { RangePickerProps } from "antd/es/date-picker"
import type { PickerDateProps } from "antd/es/date-picker/generatePicker"

import type { TDate, TPresets } from "@/types/i-antd.ts"

export type TDatePickerChange = PickerDateProps<TDate>["onChange"]

export type TDateRangeChange = RangePickerProps["onChange"]

// 组件参数
export interface IPickerTypeProps {
  type: TDateType
  value?: RangePickerProps["value"]
  onChange?: TDateRangeChange | TDatePickerChange
  presets?: TPresets
}

export type TPresetsMap = {
  year?: number[][]
  month?: number[][]
  date?: number[][]
  hour?: number[][]
}
// 组件参数 props

// 时间类型
export type TDateType = "year" | "month" | "date" | "hour"
export type TDateLabel = "日" | "月" | "年" | "时"
