export interface IMapLatLon {
  name: string
  value: Array<number>
}
export interface ITypeQuota {
  name: string
  key: string
}
export type IGroupType = "REGION_COM_ID" | "PROJECT_COM_ID" | "MAINTENANCE_COM_ID" | "STATION_CODE"
export interface IBrandData {
  manufacturer: string //该厂家名称
  deviceQuantity: string //该厂家设备数量
  deviceCapacity: string //该厂家设备装机容量，单位kW
  allCapacity: string //风电机组总装机容量，单位kW
  capacityCent: string //该厂家装机容量占比
  allQuantity: string //风电机组总设备数量
}

import { IDeviceData } from "@/types/i-device"

export interface IStateInfo {
  [state: string]: number
}
export interface IStationStateInfo {
  [stnCode: string]: IStationStateList
}
export interface IStationStateList {
  [stnCode: string]: {
    allList: IDeviceData[]
    allCount: number
    stationName: string
  }
}
