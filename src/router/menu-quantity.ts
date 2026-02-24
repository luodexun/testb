/*
 *@Author: chenmeifeng
 *@Date: 2023-10-17 13:47:05
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-17 13:47:05
 *@Description: 计划电量管理-路由
 */

import { lazy } from "react"

import { PLAN_QUANTITY } from "@/router/variables.ts"

import { ITreeMenuItem } from "./interface"

const MenuArea: ITreeMenuItem[] = [
  {
    key: PLAN_QUANTITY,
    title: "计划电量管理",
    innerPage: true,
    element: lazy(() => import("@pages/plan-quantity")),
  },
]
export default MenuArea
