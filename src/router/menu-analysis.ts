/*
 * @Author: chenmeifeng
 * @Date: 2023-11-10 14:20:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-13 15:41:08
 * @Description:
 */
import { lazy } from "react"

import {
  CRASH_TRACK,
  POWER_CURVE_ANALYSIS,
  QUALITY_ANALYSIS,
  SCATTER_ANALYSIS,
  TREND_ANALYSIS,
} from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"
const MenuArea: ITreeMenuItem[] = [
  {
    key: TREND_ANALYSIS,
    title: "趋势分析",
    innerPage: true,
    element: lazy(() => import("@/pages/analysis-trend")),
  },
  {
    key: SCATTER_ANALYSIS,
    title: "散点分析",
    innerPage: true,
    element: lazy(() => import("@/pages/analysis-scatter")),
  },
  {
    key: POWER_CURVE_ANALYSIS,
    title: "功率曲线分析",
    innerPage: true,
    element: lazy(() => import("@/pages/analysis-power")),
  },
  // {
  //   key: QUALITY_ANALYSIS,
  //   title: "数据质量分析",
  //   innerPage: true,
  //   element: lazy(() => import("@/pages/analysis-quality")),
  // },
  {
    key: CRASH_TRACK,
    title: "事故追忆",
    innerPage: true,
    element: lazy(() => import("@/pages/analysis-crash-track")),
  },
]
export default MenuArea
