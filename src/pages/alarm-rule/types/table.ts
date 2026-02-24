import { IDvsMeasurePointData } from "@/types/i-device"

import { IRuleQuotaInfo } from "."

export interface IAlarmRuleLs {
  row_id: string
  id: 11
  stationId: number
  stationName: string
  deviceId: number
  deviceName: string
  deviceModel: string
  deviceCode: string
  deviceType: string
  alarmDesc: string
  alarmRule: string
  ruleDesc: string
  conditions: Array<IRuleQuotaInfo>
  alarmLevelId: number
  alarmLevelName: string
  systemId: number
  systemName: string
  calPeriod: number
  lifeCycle: number
  actionFlag: number
  enableFlag: number
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}
export interface IQueryAlarmRuleParams {
  data: AlarmSerForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}
export type TAlarmRuleTbActInfo = {
  key: "edit" | "delete"
  label: string
}
export interface AlarmSerForm {
  deviceIds?: Array<number>
  stationId?: number
  deviceType?: string
}
export interface IPointSch {
  pointDesc: string
  deviceId: number
  exitPointList: Array<IDvsMeasurePointData>
}

export type TEditType = "add" | "edit"
