/*
 * @Author: xiongman
 * @Date: 2023-10-09 12:12:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 09:51:51
 * @Description:
 */

import { TDeviceType } from "@/types/i-config.ts"
import { TDvsMainState } from "@/types/i-device.ts"

export interface IDvsStateTrendParams {
  deviceCode: string
  deviceType?: TDeviceType
  startTime?: number
  endTime?: number
}
export interface IDvsStateTrendData {
  id: string
  index?: number // 表格处理附加字段，序号
  Time: number // 1696929254602 //开始时间
  startDate?: string // 表格处理附加字段，开始时间
  endDate?: string // 表格处理附加字段，结束时间
  deviceCode: string // "441882S01PV11010011002"
  mainState: TDvsMainState //  "A"
  mainStateDesc?: string
  subStateDesc?: string
  subState: string
  stateLabel?: string // 表格处理附加字段，主状态名称
  stationCode: string // "441882S01"
  stationName?: string // 表格处理附加字段，场站名称
  color?: string // 表格处理附加字段，状态颜色
  SState?: number
  MState?: number
  MStateDesc?: string
  SStateDesc?: string
}
