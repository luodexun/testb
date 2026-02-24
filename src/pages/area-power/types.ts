/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-28 15:05:19
 * @Description:
 */
export interface IData {
  title: string
  color: string
  data: number[]
}

export interface IchartData {
  xAxis?: string[]
  data?: IAreaPowerChartData
}
export interface IAreaPowerChartData {
  [key: string]: IData
}
export interface IAreaPowerList {
  [key: string]: IchartData
}

export interface IStationChartData {
  stationCode?: number
  stationName?: string
  data?: IchartData
}

export interface ISchParams {
  stationCode?: string
  deviceIds?: string // deviceId 多个设备逗号隔开
  startTime?: number | string
  endTime?: number | string
}

export interface IRpPowerData {
  index?: number // 表格处理附加字段
  forecastTime?: string
  Time?: number | string
  stationCode?: string
  shortPredPower?: number
  totalLinePower?: number
  outLinePower?: number
  windSpeed?: number
  activePower?: number
  reactivePower?: number
  theoryPower?: number
  availablePower?: number
  irradiance?: number
  ultraShortPredPower?: number
}
