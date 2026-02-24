/*
 * @Author: chenmeifeng
 * @Date: 2025-02-18 15:25:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-19 17:12:21
 * @Description:
 */
export interface IStatisticsInfo {
  typeName: string
  typeKey: string
  unit?: string
  child: [
    { name: string; key: string; unit: string; color: string },
    { name: string; key: string; unit: string; color: string },
  ]
}
export interface IBrandData {
  name?: string
  value?: number
  color?: string
  subColor?: string
  manufacturer: string //该厂家名称
  deviceQuantity: string //该厂家设备数量
  deviceCapacity: string //该厂家设备装机容量，单位kW
  allCapacity: string //风电机组总装机容量，单位kW
  capacityCent: string //该厂家装机容量占比
  allQuantity: string //风电机组总设备数量
}
export interface IchartData {
  xAxis?: string[]
  data?: IAreaPowerChartData
}
export interface IAreaPowerChartData {
  [key: string]: IData
}
export interface IData {
  title: string
  color: string
  data: number[]
}
