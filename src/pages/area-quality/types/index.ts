import { TDeviceType } from "@/types/i-config"

export interface IAreaQltParam {
  deviceType?: TDeviceType
  deviceCode?: string
  stationCode?: string
  stationId?: number
}
export interface IAreaQltData {
  openDraw: boolean
  stationCode: string
  stationId: number
  chooseInfo?: {
    deviceType?: TDeviceType
    deviceCode?: string
    stationCode?: string
    stationId?: number
    Time: any
    seriesName: string
    seriesKey: string
  }
}
export interface IStationRateData {
  stationCode: string
  stationName: string
  collectionCoverageRate: number
  dataIntegrityRate: number
  dataQualityRate: number
  communicationReliabilityRate: number
  fileUploadRate: number
}

export interface ILowerDvsData {
  stationId: any
  stationCode: string
  deviceCode: string
  deviceType: string
  deviceName: string
  Time: number
  collectionCoverageRate: number
  dataIntegrityRate: number
  dataQualityRate: number
  communicationReliabilityRate: number
  fileUploadRate: number
}
