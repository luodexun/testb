/*
 * @Author: chenmeifeng
 * @Date: 2024-04-18 17:47:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-18 17:47:16
 * @Description:
 */
export interface IBrandData {
  manufacturer: string //该厂家名称
  deviceQuantity: string //该厂家设备数量
  deviceCapacity: string //该厂家设备装机容量，单位kW
  allCapacity: string //风电机组总装机容量，单位kW
  capacityCent: string //该厂家装机容量占比
  allQuantity: string //风电机组总设备数量
}
