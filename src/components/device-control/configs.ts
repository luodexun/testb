/*
 * @Author: xiongman
 * @Date: 2023-10-17 17:01:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-05 16:08:47
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"

import Authentication from "@/components/device-control/authentication.tsx"
import ConfirmInfo from "@/components/device-control/confirm-info.tsx"
import { IOperateInfo } from "@/components/device-control/types.ts"

export const CONFIRM_INFO_LIST: IDvsRunStateInfo<keyof IOperateInfo>[] = [
  { title: "场站名称", field: "stationName" },
  { title: "设备名称", field: "deviceName" },
  { title: "控制点名称", field: "pointDesc" },
  { title: "当前状态", field: "stateName" },
  { title: "操作内容", field: "operateName", color: "var(--warning-color)" },
  { title: "控制步长", field: "interval", color: "var(--warning-color)" },
]

export const STEP_ITEMS = [
  { key: "CONFIRM_INFO", title: ConfirmInfo.displayName },
  { key: "AUTH_VERIFY", title: Authentication.displayName },
]

// Step 步骤组件的序号
const [STEP_INFO, AUTH_VERIFY] = STEP_ITEMS.map((_, index) => index)

export const STEP_KEY = { STEP_INFO, AUTH_VERIFY }
