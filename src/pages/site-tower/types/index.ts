/*
 * @Author: chenmeifeng
 * @Date: 2023-10-23 17:35:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-24 16:42:46
 * @Description:
 */
export interface DevideListParam {
  stationCode: string
  deviceType: string
}

export interface ITowerDataMQ {
  [deviceCode: string]: ITowerDataInfo
}

export interface ITowerDataInfo {
  deviceCode: string
  stationCode: string
  WindTower10mWindSpeed: number
  WindTower10mWindDirection: number
  WindTower30mWindSpeed: number
  WindTower30mWindDirection: number
  WindTower50mWindSpeed: number
  WindTower50mWindDirection: number
  WindTower70mWindSpeed: number
  WindTower70mWindDirection: number
  WindTowerHubWindSpeed: number
  WindTowerHubWindDirection: number
  SurfaceTemp: number
  SurfacePressure: number
  SurfaceRelativeHumidity: number
}
