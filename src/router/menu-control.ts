/*
 *@Author: chenmeifeng
 *@Date: 2023-10-09 13:53:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-28 16:42:26
 *@Description: 模块描述
 */
// import ControlBatch from "@pages/control-batch"
// import ControlLog from "@pages/control-log"

import { lazy } from "react"

import { CONTROL_BATCH, CONTROL_BOOST_BATCH, CONTROL_DATA, CONTROL_LOG, SIGN_LOG } from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"

const MenuControl: ITreeMenuItem[] = [
  {
    key: CONTROL_BATCH,
    title: "机组控制",
    innerPage: true,
    element: lazy(() => import("@pages/control-batch")),
  },
  {
    key: CONTROL_BOOST_BATCH,
    title: "升压站控制",
    innerPage: true,
    element: lazy(() => import("@pages/control-boost-batch")),
  },
  {
    key: CONTROL_DATA,
    title: "其它设备控制",
    innerPage: true,
    element: lazy(() => import("@pages/control-data-get")),
  },
  {
    key: CONTROL_LOG,
    title: "控制日志",
    innerPage: true,
    element: lazy(() => import("@pages/control-log")),
  },
  {
    key: SIGN_LOG,
    title: "挂牌日志",
    innerPage: true,
    element: lazy(() => import("@pages/control-sign-log")),
  },
]
export default MenuControl
