import { EChartsOption } from "echarts"

export interface TTrendOption {
  yAxisProps: EChartsOption["yAxis"]
  series: EChartsOption["series"]
}
export interface IFrequencyInfo {
  YCTP_OutputActivePower: number
  AGCActivePowerSet: number
  ActivePowerOfSubStation: number
  AdditionalActivePower: number
  DecreaseActivePower: number
  SystemFreq: number
  YCTP_Inputstatus: number
  YCTP_Input: number
}
export type TAnlyTrendData = {
  [pointName: string]: number[]
}
export type TAnlyTrendServe4Chart = {
  [dvsCode: string]: TAnlyTrendData
}
export interface IDeviceTrendSchParams {
  devicePoint: string
  startTime: number
  endTime: number
  func: string
  timeInterval: string
}

export interface IFieldsOption<F = string, U = string | ((flag?: boolean) => string)> {
  title: string
  field: F
  unit: string
  yAxisIndex: number
  caculate: number
}
