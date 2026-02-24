import { RangePickerProps } from "antd/es/date-picker"

export type TAnlsQueFormField = "stationId" | "deviceType"

export type TRpPowerSchFormItemName = "dateRange" | "stationCode"

export interface IAnlsQueSchForm {
  dateRange?: RangePickerProps["value"]
  stationCode?: string
  deviceType?: string
  startTime?: number
  endTime?: number
  pageNum?: number
  pageSize?: number
}

export interface IAnlsQueData {
  index?: number // 表格处理附加字段
  id?: number | string
  deviceCode?: string
  deviceName?: string
  stationCode?: string
  stationName?: string | number
  Time: number
  receivedDataCount: number
  expectedDataCount: number
}

export interface IAnlsRunTrendChartData {
  chartData?: any
  loading?: boolean
}
