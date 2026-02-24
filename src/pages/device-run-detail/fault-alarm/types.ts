/*
 * @Author: xiongman
 * @Date: 2023-10-17 10:09:22
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-17 10:09:22
 * @Description:
 */

import { TDeviceType } from "@/types/i-config.ts"
import { ISchPageParams } from "@/types/i-table.ts"

export interface IDvsAlarmParams {
  params: ISchPageParams
  data: { deviceId: number; alarmLevelId?: number }
}
export interface IDvsHtrAlarmParams {
  params: ISchPageParams
  data: { deviceIdList: number[]; alarmLevelIdList?: number[]; startTime: number; endTime: number }
}
export interface IDvsAlarmData {
  id?: string // 表格处理附加字段
  alarmDesc: string // "FPGA转发网侧DSP故障"
  alarmId: number //  8615
  alarmLevelId: number // 1
  brakeLevelId: number // 1
  confirmBy: string // "唐云熙"
  confirmFlag: false
  confirmLabel?: "是" | "否" // 表格处理附加字段
  confirmMsg: string // "zIaDZb67rT"
  confirmTime: number | null //  null
  deviceDesc: string // "风电机组"
  deviceId: string // "35"
  deviceType: TDeviceType
  endTime: number // 1697089192000
  startTime: number //  1697073107000
  startTimeStr?: string // 表格处理附加字段
  stationDesc: string //"连州风电场"
  stationId: string // "1"
  systemId: number // 105
}
