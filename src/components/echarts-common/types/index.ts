import * as echarts from "echarts"
export interface TChatDataOption {
  xAxis?: Array<any>
  data?: Array<any>
  series: any
  radar?: echarts.RadarComponentOption
  downloadFileName?: string
}
