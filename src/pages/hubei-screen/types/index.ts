/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 14:03:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-27 17:08:21
 * @Description:
 */
export interface ITypeQuota {
  name: string
  key: string
}
export type IGroupType = "REGION_COM_ID" | "PROJECT_COM_ID" | "MAINTENANCE_COM_ID" | "STATION_CODE"
export interface IBrandData {
  manufacturer: string //该厂家名称
  deviceQuantity: string //该厂家设备数量
  deviceCapacity: string //该厂家设备装机容量，单位kW
  allCapacity: string //风电机组总装机容量，单位kW
  capacityCent: string //该厂家装机容量占比
  allQuantity: string //风电机组总设备数量
}
