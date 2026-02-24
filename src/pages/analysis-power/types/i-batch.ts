/*
 * @Author: xiongman
 * @Date: 2023-10-30 15:52:02
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-30 15:52:02
 * @Description:
 */

export interface IBatchStn2DvsTreeData {
  id: string | number
  key: string | number
  title: string
  deviceCode: string
  disabled?: boolean
  model: string
  stationCode: string
  stationName: string
  isLeaf?: boolean
  level?: number
  children?: IBatchStn2DvsTreeData[]
}
