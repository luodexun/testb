import { RangePickerProps } from "antd/es/date-picker"

import { TIntervalKey, TPolymerKey } from "@/configs/option-const"
import { TDeviceType } from "@/types/i-config"

export interface TTrendOption {
  xAxis?: string[]
  series: any[]
  yAxisProps?: any
}
export interface IDeviceTrendSchParams {
  points: string
  deviceType: TDeviceType
  startTime: number
  endTime: number
  groupByTime: string
}

export interface IComAnlyTrendSchForm {
  stationCode: string
  points?: string[]
  groupByTime?: TIntervalKey
  dateRange?: RangePickerProps["value"]
}
