/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 10:41:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-08 14:46:35
 * @Description:
 */
import { lazy } from "react"

import {
  DEVICE_ATTRIBUTE,
  FIVE_MANAGE,
  PIONT_SYS,
  PLAN_QUANTITY,
  POWER_LINE,
  STATION_INDEX,
  STATUS_MODEL,
  USER_MANAGE,
} from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"

const MenuAlarm: ITreeMenuItem[] = [
  {
    key: STATION_INDEX,
    title: "场站顺序设置",
    innerPage: true,
    element: lazy(() => import("@pages/setting-station")),
  },
  {
    key: DEVICE_ATTRIBUTE,
    title: "设备属性设置",
    innerPage: true,
    element: lazy(() => import("@pages/setting-manage")),
  },
  {
    key: PIONT_SYS,
    title: "测点归属系统配置",
    innerPage: true,
    element: lazy(() => import("@pages/setting-point-sys")),
  },
  {
    key: STATUS_MODEL,
    title: "状态模型管理",
    innerPage: true,
    element: lazy(() => import("@pages/setting-state-model")),
  },
  {
    key: POWER_LINE,
    title: "功率曲线管理",
    innerPage: true,
    element: lazy(() => import("@pages/setting-power-line")),
  },
  {
    key: PLAN_QUANTITY,
    title: "计划电量管理",
    innerPage: true,
    element: lazy(() => import("@pages/plan-quantity")),
  },
  {
    key: FIVE_MANAGE,
    title: "五防管理",
    innerPage: true,
    element: lazy(() => import("@pages/setting-five-rule")),
  },
  {
    key: USER_MANAGE,
    title: "用户管理",
    innerPage: true,
    element: lazy(() => import("@pages/setting-user")),
  },
]
export default MenuAlarm
