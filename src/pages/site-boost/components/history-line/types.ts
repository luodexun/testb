/*
 * @Author: chenmeifeng
 * @Date: 2024-02-02 10:24:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-02-02 10:31:07
 * @Description:
 */
import { RangePickerProps } from "antd/es/date-picker"

export interface ISvgHistorySchForm {
  dateRange?: RangePickerProps["value"]
  devicePoint?: any
  timeInterval?: string
}
export type ISvgHistorySchFormItemName = "dateRange"
export interface TTrendOption {
  xAxis?: string[]
  series: any[]
}

export type TStHtyFormAct = "maxmin" | "export"
