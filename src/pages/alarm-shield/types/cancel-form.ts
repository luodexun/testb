export interface IQueryCcShieldParams {
  data: TCcShieldForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}
export interface TCcShieldForm {
  stationId: string // 场站ID
  modelId: string // 设备型号ID
  deviceId: string // 设备ID
  alarmId: string // 告警ID
  id?: number
  pageNum?: number
  pageSize?: number
}

export interface TCancelShieldData {
  id: number
  stationId: number
  stationDesc: string
  modelId: number
  deviceType: string
  deviceId: number
  deviceDesc: string
  alarmId: number
  alarmDesc: string
  enableFlag: number
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

export type TCcShieldSchFmItemName = keyof TCcShieldForm
