/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 18:27:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-30 14:51:56
 * @Description:
 */
// 查询表单设置 options 的名称
export type TRptAlarmFormField = "stationId" | "deviceType" | "deviceIds" | "systemId" | "alarmLevelId"

export type TRptAlarmTbActInfo = {
  key: "ensure"
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
}
export interface IQueryAlarmParams {
  data: AlarmSerForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}

export interface AlarmListData {
  startTime: number
  endTime: number
  stationId: number
  stationName: string
  deviceId: number
  deviceCode: string
  deviceName: string
  deviceModel: string
  deviceType: string
  ruleId: number //自定义告警规则表的主键ID
  alarmDesc: string
  alarmRule: string
  ruleDesc: string
  alarmLevelId: number
  alarmLevelName: string
  systemId: number
  systemName: string
  createTime: number
  confirmBy: string
  confirmTime: number
  confirmMsg: string
  confirmFlag: boolean
}
