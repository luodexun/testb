import { IPointInfo } from "@/pages/site-boost/types"
import { IDvsMeasurePointData } from "@/types/i-device"

export interface IRealtimePoint {
  stationCode: string
  stationName: string
  device: IRealtimeDvs[]
}
export interface IRealtimeDvs {
  data: any
  deviceCode: string
  point: IDvsMeasurePointData[]
}
