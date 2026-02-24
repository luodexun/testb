/*
 * @Author: xiongman
 * @Date: 2023-10-12 10:56:09
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-12 10:56:09
 * @Description: 运行趋势-配置数据们
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"
import { IStnPointTrendData } from "@pages/area-index/run-trend/types.ts"

import { TDeviceType } from "@/types/i-config.ts"

const TREND_PARAM_CM: IDvsRunStateInfo<keyof IStnPointTrendData, string>[] = [
  { title: "有功功率", field: "activePower", unit: UNIT.POWER_K },
  { title: "可用功率", field: "availablePower", unit: UNIT.POWER_K },
  // { title: "线路总功率", field: "totalLinePower", unit: UNIT.POWER_K },
  { title: "出线总功率", field: "outLinePower", unit: UNIT.POWER_K },
  { title: "理论功率", field: "theoryPower", unit: UNIT.POWER_K },
  { title: "无功功率", field: "reactivePower", unit: UNIT.REACTIVE },
]

type TTREND_PARAM_MAP = {
  [dvsType in TDeviceType]?: typeof TREND_PARAM_CM
}
export const TREND_PARAM_MAP: TTREND_PARAM_MAP = {
  WT: [{ title: "风速", field: "windSpeed", unit: UNIT.WIND }, ...TREND_PARAM_CM],
  PVINV: [{ title: "辐照度", field: "irradiance", unit: UNIT.RADIATE }, ...TREND_PARAM_CM],
  ESPCS: [0, 2, 3, 4, 5].map((i) => TREND_PARAM_CM[i]),
}
// 需要进行万进率处理的单位
export const NEED_EVO_UNITS = [UNIT.POWER_K, UNIT.REACTIVE]
