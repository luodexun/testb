import { TDeviceType } from "@/types/i-config"

export interface IAlarmShieldSchForm {
  deviceTypeList?: TDeviceType[]
  deviceIdList?: number[]
  stationIdList?: number[]
}
export interface IAlarmShieldParam {
  deviceTypeList?: TDeviceType
  deviceIdList?: number[]
  stationIdList?: number
}
export interface IQueryShieldParams {
  data: IAlarmShieldSchForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}

export interface IAlarmShieldData {
  virtualId: string
  isSeach?: boolean
  stationDesc: string
  deviceTypeName: string
  deviceDesc: string
  alarmId: string
  alarmDesc: string
  systemName: string
  alarmLevelName: string
  brakeLevelName: string
  resetLevel: string
  resetNum: number // 故障复位最大次数
  enableFlag: string | null
  blockBy: number | null // 对应数据库update_by
  blockTime: number
  modelId: number
  systemId: number
  alarmLevelId: number
  brakeLevelId: number
}
export interface IAlarmRuleParams {
  modelId: number
  alarmId: string
  alarmDesc: string
  systemId: number
  brakeLevelId: number
  alarmLevelId: number
  resetLevel: string
  resetNum: number
}
export type TAlarmShieldSchFmItemName = keyof IAlarmShieldSchForm
