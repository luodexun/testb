/*
 * @Author: xiongman
 * @Date: 2023-10-16 13:38:13
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-16 13:38:13
 * @Description: 实时运行趋势-类型们
 */

import { TDeviceType } from "@/types/i-config.ts"

export interface IDvsPointTrendParams {
  deviceType?: TDeviceType
  deviceCode: string
  startTime?: number
  endTime?: number
}

export interface IDvsPointTrendData {
  // 风光储公共字段
  Time: number //  1696831498491
  deviceCode: string // "441882H01WT1101014"
  stationCode: string // "441882H01"
  activePower: number // 0.0
  // 风字段
  windSpeed: number // 0.0
  rotorSpeed: number // 0.0
  generatorSpeed: number // 0.0
  // 光字段
  efficiency: number // 0.0
  theoryPower: number // 0.0
  availablePower: number // 0.0
  // 储能字段
  maxChargePower: number // 0.0
  maxDischargePower: number // 0.0
}
