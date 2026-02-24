/*
 * @Author: chenmeifeng
 * @Date: 2023-11-06 15:20:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-07 10:39:33
 * @Description:
 */
export interface IAlarmMqttInfo {
  alarmCounts?: IAlarmCount
  alarmMessages?: IAlarmMessages[]
  showMqttCount?: boolean
}

export interface IAlarmMessages {
  stationDesc: string //1、场站
  deviceCode: string
  deviceDesc: string //3、设备描述
  deviceType: string //2、设备类型
  systemId?: number
  startTime?: number //4、故障开始时间
  endTime?: null
  alarmId?: number
  alarmLevelId?: number
  brakeLevelId?: number
  alarmDesc?: string
  sound?: number
  siren?: number
  popup?: number
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
  sound?: number
  siren?: number
  popup?: number
}

export interface IAlarmCount {
  total?: number
  deviceTypeCount?: {
    WT: number //风机设备的告警数量
    PV: number //光伏设备的告警数量
    ES: number //储能设备的告警数量
    SYZ: number //升压站设备的告警数量
  }
  alarmLevelCount?: {
    // 1: number //故障级别的告警数量
    // 2: number //告警级别的告警数量
    [alarmLeId: number]: number
  }
  confirmCount?: {
    true: number //已确认的告警数量
    false: number //未确认的告警数量
  }
}

export interface IDvsAlarmData {
  stationId: number
  stationCode: string
  stationDesc: string
  deviceType: string
  deviceId: number
  deviceDesc: string
  alarmId: string
  alarmDesc: string
  startTime: number
  endTime: number
}
