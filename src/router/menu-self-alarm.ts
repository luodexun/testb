/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 13:56:54
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-13 17:34:09
 *@Description: 报表管理-路由集合
 */

import { lazy } from "react"

import { ITreeMenuItem } from "./interface"
import { REPORT_ALARM, REPORT_RULE } from "./variables"

const MenuCustomize: ITreeMenuItem[] = [
  {
    key: REPORT_ALARM,
    title: "告警查询",
    innerPage: true,
    element: lazy(() => import("@pages/report-alarm")),
  },
  {
    key: REPORT_RULE,
    title: "告警规则",
    innerPage: true,
    element: lazy(() => import("@pages/alarm-rule/index1")),
  },
]
export default MenuCustomize
