/*
 * @Author: xiongman
 * @Date: 2022-12-09 14:43:59
 * @LastEditors: xiongman
 * @LastEditTime: 2022-12-09 14:43:59
 * @Description: 表格相关的公共数据们
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"

export type TChartOrTable = "chart" | "table"
export const CHART_OR_TABLE_BTNS: IDvsRunStateInfo<TChartOrTable>[] = [
  { title: "曲线", field: "chart" },
  { title: "列表", field: "table" },
]
