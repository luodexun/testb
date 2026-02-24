/*
 * @Author: chenmeifeng
 * @Date: 2023-11-08 13:44:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-28 10:57:28
 * @Description:
 */
export interface TPiontData {
  pointName: string
  pointDesc: string
  pointType?: string
  id: number
  modelId: number
  systemId?: number
  coefficient?: number
  maximum?: number
  minimum?: number
  unit?: any
  tags?: any
  icon?: any
}

export interface TSWeatherData {
  deviceCode: string
  stationCode: string
  EnvMonitorTotalIrradiance?: number
  EnvMonitorDirectIrradiance?: number
  EnvMonitorScatteredIrradiance?: number
  EnvMonitorTotalCloudAmount?: number
  EnvMonitorLowCloudAmount?: number
  EnvMonitorMidCloudAmount?: number
  EnvMonitorHighCloudAmount?: number
}
