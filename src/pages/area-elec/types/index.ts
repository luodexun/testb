/*
 *@Author: chenmeifeng
 *@Date: 2023-10-20 10:16:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-19 15:28:59
 *@Description: 模块描述
 */

export interface IEleOverviewSchParams {
  deviceCode?: string | number
}

export interface IBreakerItem {
  systemId: IEleOverviewInfo["systemId"]
  systemName: IEleOverviewInfo["systemName"]
  list: IEleOverviewInfo[]
}
export type TEleOverviewTableData = {
  stationCode: string
  stationName?: string
  breakerList?: IBreakerItem[]
}

export interface IEleOverviewInfo {
  id: string
  coefficient: number // 1
  deviceCode: string // "441882H01SS11011120"
  modelId: number // 2
  pointDesc: string //"断路器2213合位"
  pointName: string //"CBClosedPosition_2213"
  pointType: string //"2"
  stationCode: string //"441882H01"
  stationName?: string // 附加字段
  systemId: number // 401
  systemName: string // "送出线路"
  value: "true" | "false" | null
  handcartValue: "true" | "false" | null
  handcartDesc: string
  dodge?: boolean | null
  maximum: null
  minimum: null
  unit: null
}

export type TEleOverviewData = {
  [stnCode in string]: {
    [code in string]: IEleOverviewInfo[]
  }
}

export interface TEleOverviewDataAct {
  stationCode: string
  stationName?: string // 附加字段
  stationId?: number
  breakerList: {
    [stnCode in string]: IEleOverviewInfo[]
  }
}
