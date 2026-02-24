/*
 * @Author: xiongman
 * @Date: 2023-10-10 17:10:33
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-10 17:10:33
 * @Description: 等效利用小时数-数据类型们
 */

import { TDeviceType } from "@/types/i-config.ts"

export interface IStnUtilizationHour {
  utilizationHour: number // 0.0 //等效利用小时数
  Time: string // "2023-07" //月份
  stationCode: string //"441882E01" //场站编码
  deviceType: TDeviceType //场站类型
}

export interface IStnUlzHourParams {
  offsetMonth: number
}

export type TDealStnUlzHour2HourMap = Partial<{
  [dvsType in TDeviceType]: number | null
}>
export type TDealStnUlzHour2StnMap = Record<string, TDealStnUlzHour2HourMap>
export type TDealStnUlzHour2TimeMap = Record<string, TDealStnUlzHour2StnMap>

export interface IDealStnUlzHourMap {
  xAxis: string[]
  dataMap: TDealStnUlzHour2TimeMap | null
  deviceType: TDeviceType[]
}
