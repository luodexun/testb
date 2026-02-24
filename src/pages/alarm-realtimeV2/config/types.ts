/*
 * @Author: chenmeifeng
 * @Date: 2023-10-17 10:30:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-22 14:22:19
 * @Description:
 */
export interface CardParams {
  name: string
  code: string | number
  key?: string
  num: number
  dataIndex?: string
}

export interface ChooseParams {
  choose: CardParams[]
  key: string
}

export interface IQueryAlarmParams {
  data: {
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
  params: {
    pageNum?: number
    pageSize?: number
  }
}
export interface TableParams {
  current: number
  pageSize: number
  total: number
}

export interface DeviceTypeList {
  code: string
  name: string
}

export interface AlarmListData {
  stationId: number
  stationCode: string
  stationDesc: string
  modelId: number
  deviceType: string
  deviceModel: string
  deviceTypeName: string
  deviceId: number
  deviceCode: string
  deviceDesc: string
  alarmId: string
  alarmDesc: string
  systemId: number
  systemName: string
  brakeLevelId: number
  brakeLevelName: string
  alarmLevelId: number
  alarmLevelName: string
  resetLevel: string
  resetNum: number
  alarmNum: number
  resetNumLeft: number
  startTime: string
  endTime: string
  confirmFlag: boolean
  confirmBy: string
  confirmTime: string
  confirmMsg: string
  blockFlag: boolean
  tags: {
    resetNum: number
    resetLevel: number
  }
  condition: "无"
  status: number
  countHour: number
  countDay: number
  lastStartTime: string
}

export interface IChooseForm {
  startTime?: number
  endTime?: number
  deviceIdList?: Array<any>
  alarmIdList?: Array<any>
}
