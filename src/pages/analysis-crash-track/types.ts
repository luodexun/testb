/*
 * @Author: xiongman
 * @Date: 2023-11-09 15:31:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-31 18:02:17
 * @Description: 事故追忆-类型们
 */

import { TDate } from "@/types/i-antd.ts"
import { ISchPageParams } from "@/types/i-table.ts"

export interface ICrashTrackSchForm {
  stationInfo: string
  imgName?: string
  devicePoint?: string[]
  dateTime: TDate | null
}

export type TCrashTrackSchFormName = "devicePoint"

export type TCrashTrackFormAct = "stop" | "export"

export interface ICrashTrackSchParams extends ISchPageParams {
  stationCode: string
  devicePoint: string
  startTime: number
  endTime: number
}
