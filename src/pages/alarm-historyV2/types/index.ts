/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 18:27:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-26 09:44:56
 * @Description:
 */
// 查询表单设置 options 的名称
export type TAlarmHistoryFormField =
  | "stationId"
  | "deviceType"
  | "deviceIds"
  | "systemId"
  | "alarmLevelId"
  | "brakeLevelId"

export type TAlarmHistoryTbActInfo = {
  key: "ensure" | "toMonitor"
  label: string
}

export interface GenericList {
  label: string
  value: number | string | any
}

export interface DeviceTypeInfoList {
  deviceTypes: Array<any>
  modelIds: Array<any>
  deviceList?: Array<any>
  stationId: number
}

export interface DevideListParam {
  stationCode: string
  deviceType: string
}
export interface DeviceTypeList {
  code: string
  name: string
}

export interface AlarmSerForm {
  stationIdList?: Array<any>
  deviceTypeList?: Array<any>
  deviceIdList?: Array<any>
  alarmLevelIdList?: Array<any>
  brakeLevelIdList?: Array<any>
  systemIdList?: Array<any>
  confirmFlag?: boolean
  startTime?: number | string
  endTime?: number | string
  fileType?: number
}
export interface IQueryAlarmParams {
  data: AlarmSerForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}

export interface AlarmListData {
  alarmDesc?: string | null
  alarmId?: string | number
  alarmLevelId?: string | number
  alarmLevelName?: string | number
  stationId?: string | number
  closeTime?: string
  deviceDesc?: string
  deviceId?: number
  deviceType?: string
  deviceTypeName?: string
  stationDesc?: string
  stationCode: string
  brakeLevelId?: number
  brakeLevelName?: string
  systemId?: number
  systemName?: string
  confirmFlag?: boolean
  confirmBy?: any
  confirmMsg?: any
  confirmTime?: any
  endTime?: any
  startTime?: any
}
