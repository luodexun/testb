/*
 * @Author: chenmeifeng
 * @Date: 2023-10-17 10:30:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-04 11:23:02
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
  alarmDesc?: string | null
  alarmId?: string | number
  alarmLevelId?: string | number
  stationId?: string | number
  closeTime?: string
  deviceDesc?: string
  deviceId?: string
  deviceType?: string
  stationDesc?: string
  stationCode: string
  brakeLevelId?: number
  systemId?: number
  confirmFlag?: boolean
  confirmBy?: any
  confirmMsg?: any
  confirmTime?: any
  endTime?: any
  startTime?: any
}
