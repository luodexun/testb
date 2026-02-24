export interface IQxzMQData {
  uri: string
  payload: IQxzMQPayload
}

interface IQxzMQPayload {
  code: string
  success: boolean
  msg: string
  data: TSWeatherData
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
