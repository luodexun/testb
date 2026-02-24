import { IStationData } from "@/types/i-station"
import { RangePickerProps } from "antd/es/date-picker"

export interface IQueryRpDvsParams {
  deviceType: string
  // stationCode: string
  stationId?: number
  deviceCode: string[]
  startTime?: number
  endTime?: number
  pageNum?: number
  pageSize?: number
  dateRange?: RangePickerProps["value"]
  stationList?: IStationData[]
}
export interface IRpDvsParams {
  deviceType: string
  stationCode: string
  deviceCode: string
  startTime?: number
  endTime?: number
  pageNum?: number
  pageSize?: number
}
export type TRpDvsFormField = "stationId" | "deviceType" | "deviceCode"
export interface IRpDvsList {
  startTime: number
  startFormatTime: string
  endTime: number
  endFormatTime: string
  stationCode: string
  stationPriority: number
  stationName: string
  deviceCode: string
  deviceName: string
  dailyProduction: number
  dailyCharge: number
  dailyDischarge: number
}

export interface IRpDvsAll {
  list: IRpDvsList[]
  total: number
}
