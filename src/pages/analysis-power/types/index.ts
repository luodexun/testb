import { RangePickerProps } from "antd/es/date-picker"

import { IFormInst } from "@/components/custom-form/types.ts"

export type TRpPowerSchFormItemName = "dateRange"

export interface IRpPowerSchForm {
  deviceCode: string
  dateRange?: RangePickerProps["value"]
  timeRange?: string
  pageNum?: number
  pageSize?: number
}

export interface IRpPowerData extends ITime {
  deviceCode: string
  windSpeed: number
  activePower: number
  actualActivePower: number
  standardActivePower: number
}

export interface IResultData {
  list?: IRpPowerData[]
  total?: number
}

export interface ITime {
  startTime?: string
  endTime?: string
}

export interface IRunTrendChartData {
  chartData?: IRpPowerData[]
  loading?: boolean
  treeFromRef: IFormInst | null
}

export interface ChartData {
  xAxis?: number[]
  [key: string]: number[]
}

export interface ITranformData {
  [key: string]: IRpPowerData[]
}
