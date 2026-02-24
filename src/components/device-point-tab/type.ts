import { ISubSystemType } from "@/types/i-config"
import { IDvsMeasurePointData } from "@/types/i-device.ts"

export interface IDvsSubPartPointDataSchParams {
  deviceCode: string
  systemId?: number
  pageNum?: number
  pageSize?: number
}
export interface IDvsSubPartPoint {
  telemetry: IDvsSystemTelemetryTableData[]
  teleindication: IDvsSystemTelemetryTableData[]
  sysList: ISubSystemType[]
  total: number
}
export type TDvsSubPartPointType = "telemetry" | "teleindication" // 遥测|遥信

interface IDvsSystemPointRealTimeData extends Record<string, string | number | boolean> {
  deviceCode: string // "441882H01WT1101002"
  stationCode: string // "441882H01"
}
export interface IDvsSystemPointData {
  data: IDvsSystemPointRealTimeData
  point: Partial<IDvsMeasurePointData>[]
}

export interface IDvsSystemTelemetryTableData {
  id: string | number
  name: string
  value: number | string | boolean | null
  className: "no" | "red" | "blue"
  unit?: string | null
  isOverState?: boolean
  color?: string
  pointName?: string
  maximum?: number // 1.0
  minimum?: number // 0.0
}
