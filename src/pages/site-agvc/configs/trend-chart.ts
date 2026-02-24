/*
 * @Author: chenmeifeng
 * @Date: 2023-10-22 22:19:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-08 13:58:29
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

import { IAgvcInfo } from "@/types/i-agvc.ts"

export const AGCChartSeries: IDvsRunStateInfo<keyof IAgvcInfo, string>[] = [
  { title: "调度有功", field: "AGCActivePowerOrderBySchedule", unit: UNIT.POWER, caculate: 1 },
  { title: "实际有功", field: "realTimeTotalActivePowerOfSubStation", unit: UNIT.POWER, caculate: 1 },
  { title: "理论有功", field: "TheoreticalPower", unit: UNIT.POWER, caculate: 1 },
  { title: "可用有功", field: "AvailablePower", unit: UNIT.POWER, caculate: 1 },
]

export const AVCChartSeries: IDvsRunStateInfo<keyof IAgvcInfo, string>[] = [
  { title: "调度无功", field: "AVCReactivePowerOrderBySchedule", unit: UNIT.REACTIVE_M },
  { title: "调度电压", field: "AVCVoltageOrderBySchedule", unit: UNIT.VOLAGE_K },
  { title: "实际无功", field: "realTimeTotalReactivePowerOfSubStation", unit: UNIT.REACTIVE_M, caculate: 1 },
  { title: "实际电压", field: "realTimeGirdVolt", unit: UNIT.VOLAGE_K, caculate: 1 },
]
//安徽个性化变更字段
// export const AVCChartSeries: IDvsRunStateInfo<keyof IAgvcInfo, string>[] = [
//   { title: "调度无功", field: "AVCVoltageOrderBySchedule", unit: UNIT.VOLAGE_K },
//   { title: "实际无功", field: "realTimeGirdVolt", unit: UNIT.VOLAGE_K, caculate: 1 },
// ]
