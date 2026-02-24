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
