export interface IBatchStn2DvsTreeData {
  id: string | number
  key: string | number
  title: string
  deviceCode: string
  deviceId?: number
  ratedPower?: number
  model?: string
  modelId?: number
  stationCode?: string
  stationId?: number
  stationName?: string
  deviceName?: string
  deviceType?: string
  level?: number
  isLeaf?: boolean
  children?: IBatchStn2DvsTreeData[]
}

export interface IRuleQuotaInfo {
  operator: string | number // 条件
  point?: string //指标输入框值
  pointName: string //指标输入框值
  value: string //指标输入框值
  id: number
  symbol: string // 与下一个的条件
}
export interface IQueryAlarmParams {
  data: AlarmSerForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}

export interface AlarmSerForm {
  stationId: number
  deviceType: string
  deviceIds: number[]
}
export type TAlarmFormField = "stationId" | "deviceType" | "deviceIds"
