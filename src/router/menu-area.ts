/*
 * @Author: xiongman
 * @Date: 2023-09-05 10:46:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 09:48:23
 * @Description: 模块菜单数据-区域中心
 */

import { lazy } from "react"

import {
  AREA_AGVC,
  AREA_ELEC,
  AREA_ENERGY,
  AREA_INDEX,
  AREA_MATRIX,
  AREA_SERVER,
  AREA_NET,
  AREA_OVERVIEW,
  AREA_OVERVIEW_V2,
  AREA_POWER,
  AREA_QUALITY,
  AREA_RLTMCHECK,
} from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"

const MenuArea: ITreeMenuItem[] = [
  {
    key: AREA_INDEX,
    title: "指标总览",
    innerPage: true,
    element: lazy(() => import("@pages/area-index/index_v2")),
  },
  {
    key: AREA_MATRIX,
    title: "矩阵监视",
    innerPage: true,
    element: lazy(() => import("@pages/area-matrix_v2")),
  },
  {
    key: AREA_OVERVIEW,
    title: "状态总览",
    innerPage: true,
    element: lazy(() => import("@pages/area-state-overview")),
  },
  {
    key: AREA_OVERVIEW_V2,
    title: "状态观测",
    innerPage: true,
    element: lazy(() => import("@pages/area-state-overview-v2")),
  },
  {
    key: AREA_ELEC,
    title: "电气总览",
    innerPage: true,
    element: lazy(() => import("@pages/area-elec")),
  },
  {
    key: AREA_AGVC,
    title: "AGVC总览",
    innerPage: true,
    element: lazy(() => import("@pages/area-agvc")),
  },
  {
    key: AREA_ENERGY,
    title: "能量管理总览",
    innerPage: true,
    element: lazy(() => import("@pages/area-energeV2")),
  },
  {
    key: AREA_POWER,
    title: "功率总览",
    innerPage: true,
    element: lazy(() => import("@pages/area-power")),
  },
  {
    key: AREA_SERVER,
    title: "系统监控",
    innerPage: true,
    element: lazy(() => import("@pages/area-server")),
  },
  {
    key: AREA_NET,
    title: "网络监视",
    innerPage: true,
    element: lazy(() => import("@pages/area-net")),
  },
  {
    key: AREA_QUALITY,
    title: "数据质量",
    innerPage: true,
    element: lazy(() => import("@pages/area-quality")),
  },
  {
    key: AREA_RLTMCHECK,
    title: "实时巡视",
    innerPage: true,
    element: lazy(() => import("@pages/area-realtime-check")),
  },
]
export default MenuArea
