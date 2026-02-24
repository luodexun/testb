/*
 * @Author: chenmeifeng
 * @Date: 2024-01-08 13:50:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-25 10:51:58
 * @Description:
 */
import { IDvsMeasurePointData } from "@/types/i-device"

export interface IPointSysInfo extends IDvsMeasurePointData {
  edit?: boolean // 判断是否编辑过
}

// 查询表单设置 options 的名称
export type TStationIdxSchFormField = "stationId"
export interface IStPiontSysListParam {
  stationId?: string
  modelId?: number
  pointTypes?: string
  systemId?: number
}

export type TStPiontSysFormField = "stationId" | "modelId" | "pointTypes" | "systemId"
