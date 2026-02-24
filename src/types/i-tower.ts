export interface IAgvcInfo {
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

export interface IAgvcMQDataMap {
  [deviceCode: string]: IAgvcInfo
}

interface IAgvcMQPayload {
  code: string
  success: boolean
  msg: string
  data: IAgvcInfo | IAgvcMQDataMap
}
export interface IAgvcMQData {
  uri: string
  payload: IAgvcMQPayload
}
