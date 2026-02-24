/*
 * @Author: xiongman
 * @Date: 2023-10-12 10:25:29
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-12 10:25:29
 * @Description: 运行趋势-数据类型们
 */

import { TDeviceType } from "@/types/i-config.ts"

export interface IStnPointTrendParams {
  stationCode: string
  deviceType: TDeviceType
  startTime?: string
  endTime?: string
}

export interface IStnPointTrendData {
  // 公共字段
  Time: number
  stationCode: string
  // 风光储公共
  totalLinePower: number
  outLinePower: number
  // 风光公共
  activePower: number
  reactivePower: number
  theoryPower: number
  availablePower: number
  // 风
  windSpeed: number
  //光
  irradiance: number
}
