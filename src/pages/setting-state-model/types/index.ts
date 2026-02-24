/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:48:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-24 13:44:09
 * @Description:
 */
export interface IModelListData {
  color: string
  deviceType: string
  state: string
  stateDesc: string
  stateType: string
  id: number
  parentId?: number
  num?: number
  children?: Array<IModelListData>
}

export interface ISearchFr {
  stationCode: string | number
  deviceType: string | number
}
