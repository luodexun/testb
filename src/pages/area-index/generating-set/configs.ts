/*
 * @Author: xiongman
 * @Date: 2023-11-06 11:25:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 11:07:06
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"

import { ICenterInfoData } from "@/types/i-monitor-info.ts"

export const SET_LIST: IDvsRunStateInfo<keyof ICenterInfoData, string>[] = [
  { title: "风电场", unit: UNIT.PIECE, field: "stationWNum" },
  { title: "风机台数", unit: UNIT.COUNT, field: "wtNum" },
  { title: "风机装机总容量", unit: UNIT.POWER_K, field: "wtInstalledCapacity" },
  { title: "光伏场", unit: UNIT.PIECE, field: "stationSNum" },
  { title: "逆变器台数", unit: UNIT.COUNT, field: "pvinvNum" },
  { title: "光伏装机总容量", unit: UNIT.POWER_K, field: "pvinvInstalledCapacity" },
  // { title: "储能站", unit: UNIT.PIECE, field: "stationENum" },
  // { title: "变流器", unit: UNIT.COUNT, field: "espcsNum" },
  // { title: "总容量", unit: UNIT.POWER_K, field: "espcsInstalledCapacity" },
]
