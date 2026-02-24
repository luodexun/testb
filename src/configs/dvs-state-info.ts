/*
 * @Author: xiongman
 * @Date: 2023-08-30 12:05:27
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 14:52:33
 * @Description:
 */

import { UNIT } from "@configs/text-constant.ts"

import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceRunData4MQ } from "@/types/i-device.ts"
import { ICenterRunDataMQ, IMonitorBaseInfo, ISiteMonitorInfo } from "@/types/i-monitor-info.ts"

// 设备状态信息-展示信息
export interface IDvsRunStateInfo<F = string, U = string | ((flag?: boolean) => string)> {
  title: string
  field: F
  subField?: string
  actualShowSubField?: string
  valueFun?: (val: any, data?: any) => any
  value?: string | number
  color?: string
  valColor?: (val: any, data?: any) => any
  unit?: U
  width?: number
  icon?: string
  compType?: string
  caculate?: number // 除以分母
  prohibitControl?: any[] // 包含禁止控制的旧设备运行状态
  prohibitNewStateControl?: any[] // 包含禁止控制的新设备运行状态
  prohibitModelIdControl?: boolean // 禁止机组控制
  digits?: number // 保留小数位
  trendNoShow?: boolean
}
// 风机设备卡片运行参数信息
const RUN_CARD_4WT: IDvsRunStateInfo<keyof IDeviceRunData4MQ, string>[] = [
  { title: "风机型号", field: "model" },
  { title: "状态", field: "mainState", subField: "subState" },
  { title: "风速", field: "windSpeed", unit: UNIT.WIND, digits: 1 },
  { title: "桨角1", field: "pitchAngle1", unit: UNIT.ANGLE, digits: 1 },
  { title: "有功功率", field: "activePower", unit: UNIT.POWER_K, digits: 0 },
  { title: "无功功率", field: "reactivePower", unit: UNIT.REACTIVE },
  { title: "理论功率", field: "theoryPower", unit: UNIT.POWER_K },
  { title: "可用功率", field: "availablePower", unit: UNIT.POWER_K },
  { title: "有功设定", field: "GenPowSetp", unit: UNIT.POWER_K },
  { title: "出力率", field: "rate", unit: UNIT.PERCENT },
  { title: "日发电量", field: "dailyProduction", unit: UNIT.ELEC },
]
// 光伏设备卡片运行参数信息
const RUN_CARD_4PVINV: IDvsRunStateInfo<keyof IDeviceRunData4MQ, string>[] = [
  { title: "光伏型号", field: "model" },
  { title: "状态", field: "mainState", subField: "subState" },
  { title: "转换效率", field: "efficiency", unit: UNIT.PERCENT },
  { title: "有功功率", field: "activePower", unit: UNIT.POWER_K },
  { title: "无功功率", field: "reactivePower", unit: UNIT.REACTIVE },
  { title: "理论功率", field: "theoryPower", unit: UNIT.POWER_K },
  { title: "可用功率", field: "availablePower", unit: UNIT.POWER_K },
  { title: "有功设定", field: "ActivePowerSetPoint", unit: UNIT.POWER_K },
  { title: "出力率", field: "rate", unit: UNIT.PERCENT },
  { title: "日发电量", field: "dailyProduction", unit: UNIT.ELEC },
]
// 储能设备卡片运行参数信息
const RUN_CARD_4ESPCS: IDvsRunStateInfo<keyof IDeviceRunData4MQ, string>[] = [
  { title: "变流器型号", field: "model" },
  { title: "状态", field: "mainState", subField: "subState" },
  { title: "有功功率", field: "activePower", unit: UNIT.POWER_K },
  { title: "无功功率", field: "reactivePower", unit: UNIT.REACTIVE },
  { title: "最大可充电功率", field: "maxChargePower", unit: UNIT.POWER_K },
  { title: "最大可放电功率", field: "maxDischargePower", unit: UNIT.POWER_K },
  { title: "有功设定", field: "pcspcmd", unit: UNIT.POWER_K },
  { title: "出力率", field: "rate", unit: UNIT.PERCENT },
  { title: "日充电量", field: "dailyCharge", unit: UNIT.ELEC },
  { title: "日放电量", field: "dailyDischarge", unit: UNIT.ELEC },
]

// 设备卡片-设备运行数据中表示设备状态的字段名称，用于设备状态的中文转译
export const DEVICE_RUN_CARD_FIELD_4TYPE: Partial<Record<TDeviceType, typeof RUN_CARD_4WT>> = {
  WT: RUN_CARD_4WT,
  PVINV: RUN_CARD_4PVINV,
  ESPCS: RUN_CARD_4ESPCS,
  PVCOL: RUN_CARD_4PVINV,
}

export const DVS_CARD_RUN_INFO_4TYPE: Partial<
  Record<TDeviceType, IDvsRunStateInfo<keyof IDeviceRunData4MQ, string>[]>
> = {
  WT: [
    { title: "风速", field: "windSpeed", unit: UNIT.WIND, digits: 1 },
    { title: "有功", field: "activePower", unit: UNIT.POWER_K, digits: 0 },
    // { title: "出力", field: "rate", unit: UNIT.PERCENT },
    { title: "桨角1", field: "pitchAngle1", unit: UNIT.ANGLE, digits: 1 },
  ],
  PVINV: [
    { title: "效率", field: "efficiency", unit: UNIT.PERCENT },
    { title: "有功", field: "activePower", unit: UNIT.POWER_K },
    { title: "出力", field: "rate", unit: UNIT.PERCENT },
  ],
  ESPCS: [
    { title: "无功", field: "reactivePower", unit: UNIT.REACTIVE },
    { title: "有功", field: "activePower", unit: UNIT.POWER_K },
    { title: "出力", field: "rate", unit: UNIT.PERCENT },
  ],
}

// 区域设备矩阵-区域综合信息展示
export const MONITOR_CENTER_INFO_LIST: IDvsRunStateInfo<keyof (IMonitorBaseInfo & ICenterRunDataMQ), string>[] = [
  { title: "装机台数", unit: UNIT.COUNT, field: "count" },
  { title: "装机容量", unit: UNIT.POWER_K, field: "capacity" },
  { title: "总有功", unit: UNIT.POWER_K, field: "activePower" },
  { title: "出力率", unit: UNIT.PERCENT, field: "rate" },
  { title: "日发电", unit: UNIT.ELEC, field: "dailyProduction" },
  { title: "月发电", unit: UNIT.ELEC, field: "monthlyProduction" },
  { title: "年发电", unit: UNIT.ELEC, field: "yearlyProduction" },
]
// 区域-综合指标
export const COMPREHENSIVE_INDICATOR: IDvsRunStateInfo<any, string>[] = [
  { title: "装机台数", unit: UNIT.COUNT, field: "count" },
  { title: "总有功", unit: UNIT.POWER_K, field: "activePower" },
  { title: "出力率", unit: UNIT.PERCENT, field: "rate" },
  { title: "日发电", unit: UNIT.ELEC, field: "dailyProduction" },
  { title: "平均风速", unit: UNIT.WIND, field: "windSpeed" },
  { title: "平均辐照度", unit: UNIT.RADIATE, field: "irradiance" },
]

// 区域设备矩阵-场站信息展示
const MONITOR_SITE_INFO_BASE: IDvsRunStateInfo<keyof ISiteMonitorInfo, string>[] = [
  { title: "日发电量", unit: UNIT.ELEC, field: "dailyProduction", width: 17 },
  { title: "有功功率", unit: UNIT.POWER_K, field: "activePower", width: 17 },
]

type TMonitorSiteInfo = {
  [dvsType in TDeviceType]?: IDvsRunStateInfo<any, string>[]
}
export const MONITOR_SITE_INFO_MAP: TMonitorSiteInfo = {
  WT: [
    { title: "装机台数", unit: UNIT.COUNT, field: "wtNum", trendNoShow: true },
    { title: "装机容量", unit: UNIT.POWER_K, field: "wtInstalledCapacity", trendNoShow: true, width: 17 },
    ...MONITOR_SITE_INFO_BASE,
    { title: "平均风速", unit: UNIT.WIND, field: "windSpeed" },
    { title: "出力率", unit: UNIT.PERCENT, field: "wtRate", trendNoShow: true },
    { title: "环境温度", unit: UNIT.TEMPER, field: "ambientTemp" },
    { title: "变桨角度", unit: UNIT.ANGLE, field: "pitchAngle1" },
    { title: "理论功率", unit: UNIT.POWER_K, field: "theoryPower", width: 17 },
    { title: "可用功率", unit: UNIT.POWER_K, field: "availablePower", width: 17 },
    // { title: "无功功率", unit: UNIT.POWER_K, field: "activePower" },
    { title: "场站调度功率", unit: UNIT.POWER, field: "AGCActivePowerOrderBySchedule", width: 17 },
    { title: "最大风速", unit: UNIT.WIND, field: "windSpeed_max" },
    { title: "最小风速", unit: UNIT.WIND, field: "windSpeed_min" },
    { title: "最大扭缆角度", unit: UNIT.ANGLE, field: "yawCableAngle_max" },
    { title: "最小扭缆角度", unit: UNIT.ANGLE, field: "yawCableAngle_min" },
  ],
  PVINV: [
    { title: "装机台数", unit: UNIT.COUNT, field: "pvinvNum", trendNoShow: true },
    { title: "装机容量", unit: UNIT.POWER_K, field: "pvinvInstalledCapacity", trendNoShow: true, width: 17 },
    ...MONITOR_SITE_INFO_BASE,
    { title: "转换效率", unit: UNIT.PERCENT, field: "efficiency" },
    { title: "辐照度", unit: UNIT.RADIATE, field: "totalIrradiance" },
    { title: "出力率", unit: UNIT.PERCENT, field: "pvinvRate", trendNoShow: true },
    { title: "环境温度", unit: UNIT.TEMPER, field: "JCYTemp" },
    { title: "辐射量", unit: UNIT.RADIATE, field: "JCYDailyTotalIrradiance" },
    { title: "理论功率", unit: UNIT.POWER_K, field: "theoryPower", width: 17 },
    { title: "可用功率", unit: UNIT.POWER_K, field: "availablePower", width: 17 },
    { title: "无功功率", unit: UNIT.REACTIVE_M, field: "gridsideReactivePower", width: 17 },
    { title: "场站调度功率", unit: UNIT.POWER, field: "AGCActivePowerOrderBySchedule", width: 17 },
  ],
  ESPCS: [
    { title: "装机台数", unit: UNIT.COUNT, field: "espcsNum", trendNoShow: true },
    { title: "装机容量", unit: UNIT.POWER_K, field: "espcsInstalledCapacity", trendNoShow: true, width: 17 },
    { title: "日放电量", unit: UNIT.ELEC, field: "dailyDischarge", width: 17 },
    { title: "有功功率", unit: UNIT.POWER_K, field: "activePower", width: 17 },
    { title: "日充电量", unit: UNIT.ELEC, field: "dailyCharge", width: 17 },
    { title: "出力率", unit: UNIT.PERCENT, field: "espcsRate", trendNoShow: true },
  ],
}

// 区域设备矩阵-区域综合信息展示
export const MONITOR_SITE_INFO_LIST: IDvsRunStateInfo<keyof (IMonitorBaseInfo & ISiteMonitorInfo), string>[] = [
  { title: "装机台数", unit: UNIT.COUNT, field: "count" },
  { title: "装机容量", unit: UNIT.POWER_K, field: "totalInstalledCapacity" },
  { title: "总有功", unit: UNIT.POWER_K, field: "activePower" },
  // { title: "出力率", unit: UNIT.PERCENT, field: "rate" },
  { title: "日发电量", unit: UNIT.ELEC, field: "dailyProduction" },
  // { title: "月发电量", unit: UNIT.ELEC, field: "monthlyProduction" },
  // { title: "年发电量", unit: UNIT.ELEC, field: "yearlyProduction" },
]
