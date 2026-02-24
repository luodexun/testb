import { TDeviceType } from "@/types/i-config"

export interface ICDGTreeData {
  disabled: boolean
  id: string | number
  key: string | number
  title: string
  deviceCode: string
  deviceId?: number
  ratedPower?: number
  model?: string
  modelId?: number
  lineName?: string
  lineCode?: number
  stationCode?: string
  stationId?: number
  stationName?: string
  deviceName?: string
  level?: number
  isLeaf?: boolean
  children?: ICDGTreeData[]
}
export type TTreeData4DvsTypeMap = {
  [dvsType in TDeviceType]?: ICDGTreeData[]
}
export interface ISubmitInfo {
  checkedPoint: ICDGTreeData[]
  checkDvs: any
}
