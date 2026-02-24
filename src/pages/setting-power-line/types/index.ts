/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:48:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-28 10:44:46
 * @Description:
 */

import { TDeviceType } from "@/types/i-config"

export interface IPowerData {
  modelName?: string // 处理附加字段
  id: number
  stationId: number
  modelId: number
  deviceType: TDeviceType
  standardAirDensity?: number // 标准空气密度
  actualAirDensity?: number
  standardTemperature?: number // 标准温度
  actualTemperature?: number
  mngWtPowercurvePointList: Array<ICurvePiontList>
}

export interface ICurvePiontList {
  id: number
  curveId?: number
  irradiance: number | string // 辐照
  beanWindSpeed: number | string // 风速
  standardActivePower: number | string // 标准空气密度有功功率
  actualActivePower: number | string
}

export interface ISearchFr {
  modelId?: number
  stationId?: number
  curveId?: TDeviceType
}

export type TPowerTbActInfo = {
  key: string
  label: string
}

export interface TModelFrAndTbInfo {
  tableData: Array<ICurvePiontList>
  formList: any
  deviceType?: TDeviceType
}

export type TPowerAddOrEditFormField =
  | "stationId"
  | "modelId"
  | "standardAirDensity"
  | "actualAirDensity"
  | "interval"
  | "step"

export interface IPwLineMdSchForm {
  interval?: Array<number>
  stationId?: number
  modelId?: number
  standardAirDensity?: number
  actualAirDensity?: number
  step?: number
}

export type TSrhFormActType = "export" | "add" | "batchDel"
