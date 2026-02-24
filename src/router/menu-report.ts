/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 13:56:54
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-05 09:53:51
 *@Description: 报表管理-路由集合
 */

import { lazy } from "react"

import {
  REPORT_ANHUI,
  REPORT_DEVICE,
  REPORT_LOST_PRODUCTION,
  REPORT_EFFICENCY,
  REPORT_GRID,
  REPORT_HENAN,
  REPORT_HUBEI,
  REPORT_METER,
  REPORT_OPERATION,
  REPORT_POWER,
} from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"

const MenuArea: ITreeMenuItem[] = [
  {
    key: REPORT_HENAN,
    title: "河南日报",
    innerPage: true,
    element: lazy(() => import("@pages/report-henan")),
  },
  {
    key: REPORT_POWER,
    title: "发电量报表",
    innerPage: true,
    element: lazy(() => import("@pages/report-power/test")),
  },
  {
    key: REPORT_DEVICE,
    title: "单机发电量",
    innerPage: true,
    element: lazy(() => import("@pages/report-device")),
  },
  {
    key: REPORT_LOST_PRODUCTION,
    title: "单机损失电量",
    innerPage: true,
    element: lazy(() => import("@pages/report-lost-production")),
  },
  {
    key: REPORT_GRID,
    title: "涉网电量报表",
    innerPage: true,
    element: lazy(() => import("@pages/report-grid")),
  },

  {
    key: REPORT_METER,
    title: "电计量报表",
    innerPage: true,
    element: lazy(() => import("@pages/report-meter")),
  },
  {
    key: REPORT_EFFICENCY,
    title: "功率预测报表",
    innerPage: true,
    element: lazy(() => import("@pages/report-efficency")),
  },
  {
    key: REPORT_OPERATION,
    title: "并网运行报表",
    innerPage: true,
    element: lazy(() => import("@pages/report-operation")),
  },
  {
    key: REPORT_ANHUI,
    title: "安徽日报",
    innerPage: true,
    element: lazy(() => import("@pages/report-henan")),
  },
  {
    key: REPORT_HUBEI,
    title: "湖北现货",
    innerPage: true,
    element: lazy(() => import("@pages/report-hubei")),
  },
]
export default MenuArea
