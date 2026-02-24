/*
 * @Author: xiongman
 * @Date: 2023-08-24 16:13:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-10 14:55:30
 * @Description: 下拉框、选项等静态数据
 */

import type { MenuProps } from "antd"

import { TOptions } from "@/types/i-antd.ts"
import { TDeviceType, TYear0Month } from "@/types/i-config"
import { IDeviceData } from "@/types/i-device.ts"

export const YEAR_MONTH: TOptions<TYear0Month> = [
  { value: "month", label: "月" },
  { value: "year", label: "年" },
]

// 场站设备类型列表 WT 风， PVINV 光， ESPCS 储能
export const MAIN_DVS_TYPE: TOptions<TDeviceType> = [
  { value: "WT", label: "风" },
  { value: "PVINV", label: "光" },
  { value: "ESPCS", label: "储" },
]
export const MAIN_DVS_TYPE_LOWERCASE: TOptions<any> = [
  { value: "wt", label: "风" },
  { value: "pvinv", label: "光" },
  { value: "espcs", label: "储" },
]

// 统计周期下拉框列表
export const PERIOD_OPTIONS: TOptions<"" | "1d" | "1mo" | "1y" | "nd" | "all" | "od"> = [
  { label: "日", value: "1d" },
  { label: "月", value: "1mo" },
  { label: "年", value: "1y" },
  { label: "一段时间日", value: "nd" },
  { label: "一段时间任意", value: "all" },
  { label: "自并网以来", value: "od" },
]

export const TIME_OPTIONS: TOptions<"all" | "15m" | "1h" | "1d" | "1mo" | "1y"> = [
  { label: "日", value: "1d" },
  { label: "小时", value: "1h" },
  { label: "十五分钟", value: "15m" },
  { label: "月", value: "1mo" },
  { label: "年", value: "1y" },
]

export type TSiteLayout = "site" | keyof Pick<IDeviceData, "lineName" | "periodName" | "model" | "parentName" | "array">
// TOptions<TSiteLayout>
export const SITE_LAYOUT = [
  { value: "site", label: "场站排列" },
  { value: "lineName", label: "线路排列" },
  { value: "periodName", label: "期次排列" },
  { value: "model", label: "机组型号" },
  { value: "array", label: "方阵排列", belongType: "PVINV" },
  // { value: "parentName", label: "箱变" },
]

export type TPolymerKey = "SUM" | "AVG" | "MAX" | "MIN" | "FIRST" | "LAST" | "COUNT"
export const POLYMER_OPTIONS: TOptions<TPolymerKey> = [
  { label: "平均", value: "AVG" },
  { label: "求和", value: "SUM" },
  { label: "最大", value: "MAX" },
  { label: "最小", value: "MIN" },
  { label: "首值", value: "FIRST" },
  { label: "末值", value: "LAST" },
  { label: "计数", value: "COUNT" },
]

export type TIntervalKey = "1s" | "3s" | "5s" | "1m" | "5m" | "10m" | "15m" | "1h" | "1d"
//刻度间隔
export const INTERVAL_OPTIONS: TOptions<TIntervalKey> = [
  { label: "一秒钟", value: "1s" },
  { label: "三秒钟", value: "3s" },
  { label: "五秒钟", value: "5s" },
  { label: "一分钟", value: "1m" },
  { label: "五分钟", value: "5m" },
  { label: "十分钟", value: "10m" },
  { label: "十五分钟", value: "15m" },
  { label: "小时", value: "1h" },
  { label: "日", value: "1d" },
]

export type TAreaPowerElement =
  | "theoryPower"
  | "availablePower"
  | "activePower"
  | "totalLinePower"
  | "outLinePower"
  | "shortPredPower"
  | "ultraShortPredPower"
  | "agvcPower"
  | "syzzzPower"
// 辽宁大屏也用到这里，改动需慎重
export const AREA_POWER_ELEMENT: TOptions<TAreaPowerElement> = [
  // { value: "theoryPower", label: "理论功率", style: { color: "#00AF08FF" } },
  // { value: "availablePower", label: "可用功率", style: { color: "#1C7991FF" } },
  { value: "agvcPower", label: "AGVC有功", style: { color: "#e8f805" } },
  // { value: "totalLinePower", label: "线路总功率", style: { color: "#F47678FF" } },
  // { value: "outLinePower", label: "出线总功率", style: { color: "#AD1A4DFF" } },
  { value: "shortPredPower", label: "短期预测", style: { color: "#05f8f0" } },
  { value: "ultraShortPredPower", label: "超短期预测", style: { color: "#ab05f8" } },
  { value: "syzzzPower", label: "电气出线有功", style: { color: "#AD1A4DFF" } },
]

export const ALARM_TYPE: TOptions<string> = [
  { value: "1", label: "故障" },
  { value: "2", label: "告警" },
  { value: "3", label: "信息" },
]

export const DEVICE_INDEX_TYPE_OPTIONS: TOptions<"GLYC" | "AGVC"> = [
  { label: "功率预测指标", value: "GLYC" },
  { label: "AGVC指标", value: "AGVC" },
]

export const EXPORT_LIST: MenuProps["items"] = [
  { key: "csv", label: "excel" },
  { key: "pdf", label: "pdf" },
  { key: "doc", label: "word" },
]
export const EXPORT_LIST1: MenuProps["items"] = [
  { key: 1, label: "excel" },
  { key: 2, label: "word" },
  { key: 3, label: "pdf" },
]
