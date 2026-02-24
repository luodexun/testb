/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-18 14:03:08
 * @Description:
 */
export interface IAlarmMqttInfo {
  alarmCounts?: any
  alarmMessages?: IAlarmMessages[]
}

export interface IAlarmMessages {
  stationCode?: string
  stationDesc?: string
  deviceId?: string | number
  deviceCode?: string
  deviceDesc?: string
  deviceType?: string
  deviceTypeName?: string
  systemId?: number
  startTime?: number
  endTime?: number
  alarmId?: number
  alarmLevelId?: number
  brakeLevelId?: number
  alarmDesc?: string
  sound?: number
  siren?: number
  popup?: number
}
