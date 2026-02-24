/*
 * @Author: chenmeifeng
 * @Date: 2023-10-13 11:32:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-24 16:02:31
 * @Description:
 */
import { lazy } from "react"

import {
  ALARM_ANALYSE,
  ALARM_HISTORY,
  ALARM_MERGE,
  ALARM_REAL,
  ALARM_REAL_TWO,
  ALARM_SHIELD,
} from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"

const MenuAlarm: ITreeMenuItem[] = [
  {
    key: ALARM_REAL,
    title: "实时告警",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-realtime")),
  },
  {
    key: ALARM_REAL_TWO,
    title: "实时告警",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-realtimeV2")),
  },
  {
    key: ALARM_HISTORY,
    title: "历史告警",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-historyV2")),
  },
  {
    key: ALARM_SHIELD,
    title: "告警配置",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-shield")),
  },
  {
    key: ALARM_ANALYSE,
    title: "告警分析",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-analyse")),
  },
  {
    key: ALARM_MERGE,
    title: "告警分组",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-merge")),
  },
]
export default MenuAlarm
