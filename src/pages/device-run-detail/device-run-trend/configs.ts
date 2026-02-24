/*
 * @Author: xiongman
 * @Date: 2023-10-16 14:16:58
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-16 14:16:58
 * @Description: 实时运行趋势-配置数据们
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

import { TDeviceType } from "@/types/i-config.ts"
import { TYAxisInfo } from "@/types/i-page.ts"

import { IDvsPointTrendData } from "./types.ts"

type TTREND_PARAM_MAP = {
  [dvsType in TDeviceType]?: IDvsRunStateInfo<keyof IDvsPointTrendData, string>[]
  // &Omit<TYAxisInfo[TDeviceType][0], "title" | "unit">
}
export const DVS_RUN_TREND_PARAM_MAP: TTREND_PARAM_MAP = {
  WT: [
    { title: "风速", unit: UNIT.WIND, field: "windSpeed" },
    { title: "叶轮转速", unit: UNIT.ROTATE, field: "rotorSpeed" },
    { title: "发电机转速", unit: UNIT.ROTATE, field: "generatorSpeed" },
    { title: "功率", unit: UNIT.POWER_K, field: "activePower" },
  ],
  PVINV: [
    { title: "转换效率", unit: UNIT.PERCENT, field: "efficiency" },
    { title: "有功功率", unit: UNIT.POWER_K, field: "activePower" },
    { title: "理论功率", unit: UNIT.POWER_K, field: "theoryPower" },
    { title: "可用功率", unit: UNIT.POWER_K, field: "availablePower" },
  ],
  ESPCS: [
    { title: "有功功率", unit: UNIT.POWER_K, field: "activePower" },
    { title: "最大可充电功率", unit: UNIT.POWER_K, field: "maxChargePower" },
    { title: "最大可放电功率", unit: UNIT.POWER_K, field: "maxDischargePower" },
  ],
}

export const DVS_RUN_TREND_Y_AXIS_INFO: TYAxisInfo = {
  WT: [
    { title: "风速", unit: UNIT.WIND, position: "left" },
    { title: "转速", unit: UNIT.ROTATE, position: "right", offset: 0 },
    // { title: "发电机转速", unit: UNIT.ROTATE, position: "right", offset: 60 },
    { title: "功率", unit: UNIT.POWER_K, position: "right", offset: 60 },
  ],
  PVINV: [
    { title: "转换效率", unit: UNIT.PERCENT, position: "left" },
    { title: "功率", unit: UNIT.POWER_K, position: "right", offset: 0 },
    // { title: "理论功率", unit: UNIT.POWER_K, position: "right", offset: 60 },
    // { title: "可用功率", unit: UNIT.POWER_K, position: "right", offset: 120 },
  ],
  ESPCS: [
    { title: "有功功率", unit: UNIT.POWER_K, position: "left" },
    { title: "最大可充(放)电功率", unit: UNIT.POWER_K, position: "right", offset: 0 },
    // { title: "最大可放电功率", unit: UNIT.POWER_K, position: "right", offset: 60 },
  ],
}
