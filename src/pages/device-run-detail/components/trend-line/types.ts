import { RangePickerProps } from "antd/es/date-picker"

import { TIntervalKey, TPolymerKey } from "@/configs/option-const"

export interface TTrendOption {
  xAxis?: string[]
  series: any[]
  yAxisProps?: any
}
export interface IDeviceTrendSchParams {
  devicePoint: string
  startTime: number
  endTime: number
  func: string
  timeInterval: string
}

export interface IComAnlyTrendSchForm {
  devicePoint?: string[]
  func?: TPolymerKey
  timeInterval?: TIntervalKey
  dateRange?: RangePickerProps["value"]
}
