/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-18 11:20:41
 * @Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { TDeviceType } from "@/types/i-config.ts"
import { ISchPageParams } from "@/types/i-table.ts"

export interface IControlLogSchForm {
  deviceType?: TDeviceType
  deviceIds?: number[]
  stationId?: number
  dateRange?: RangePickerProps["value"]
}

export type TControlLogSchFmItemName = keyof Omit<IControlLogSchForm, "dateRange">

export interface IControlLogSchParams
  extends Partial<ISchPageParams>,
    Omit<IControlLogSchForm, "dateRange" | "deviceIds"> {
  stationCode?: string
  deviceIds?: string // deviceId 多个设备逗号隔开
  startTime?: number
  endTime?: number
}

export interface IControlLogData {
  id: number // 1
  index?: number // 序号 表格处理附加字段
  stationCode: string // "441882W01"
  stationName: string // "连州风电场" //场站
  deviceCode: string // "441882W01WT1101001"
  deviceName: string // "风电机组" //设备
  deviceId: number // 1
  model: string // "CS2500D120H120"
  deviceType: TDeviceType // "WT" //设备类型编码，需要映射成中文
  deviceTypeLabel?: string // 表格处理附加字段
  reResult: string // "控制指令下发失败,原因:与接口机通讯失败" //返回结果
  ctlInfo: string // ""
  authorizerBy: string // "杨东升"
  operatorBy: string // "邓琛" //执行人
  operatorTime: string // "2023-10-10T06:03:20.702+00:00" //执行时间
  operatorTimeStr?: string // 表格处理附加字段
  commandId: number // 1
  controlType: string // "1" // 控制类型id，需要映射成中文
  controlTypeLabel?: string // 表格处理附加字段
  targetValue: number // 1.0 //控制值
}
