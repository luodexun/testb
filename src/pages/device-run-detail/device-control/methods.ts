/*
 * @Author: xiongman
 * @Date: 2023-10-16 11:08:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-14 15:59:47
 * @Description: 设备控制-方法们
 */

import { getDvsMainStateList } from "@hooks/use-matrix-device-list.ts"
import { CONFIG_MAP } from "@store/atom-config.ts"
import { getStorage, validResErr } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IDvsCurrentStateInfo } from "@/components/device-control/types.ts"
import { StorageDeviceStdNewState } from "@/configs/storage-cfg.ts"
import { IDeviceData, IDvsStateData } from "@/types/i-device.ts"

import { IDvsStateParams } from "./types.ts"

export async function getCurrentDvsStateData(device: IDeviceData, isUseNewDvsState: boolean) {
  const { deviceCode, deviceType } = device
  const resData = await doBaseServer<IDvsStateParams, IDvsStateData>("getDeviceStateData", { deviceCode })
  const result: IDvsCurrentStateInfo = { state: "-", color: "var(--fontcolor)" }
  if (validResErr(resData)) return result
  if (isUseNewDvsState) {
    const { MState, SState } = resData || {}
    if (!MState) return result
    const dvsStates = getStorage<Array<any>>(StorageDeviceStdNewState)
    const mainState = dvsStates?.find((state) => state.stateType === "MAIN" && state.state == MState)
    const subState = dvsStates?.find((state) => state.stateType === "SUB" && state.state == SState)
    result.state = `${mainState?.stateDesc ?? ""}-${subState?.stateDesc ?? ""}`
    result.color = mainState?.color || "var(--fontcolor)"
    result.mainState = MState
    result.subState = SState
    return result
  }
  const { mainState, subState } = resData || {}
  if (!mainState) return result
  const { deviceStdStateMap } = CONFIG_MAP.map
  const { allState2DescMap } = getDvsMainStateList(deviceStdStateMap, deviceType, null, "old")
  const mainKey = `MAIN_${mainState}`
  const subKey = `SUB_${subState}`

  const mainStdState = allState2DescMap?.[mainKey]
  const mainStdStateDesc = mainStdState?.stateDesc
  const subStdStateDesc = allState2DescMap?.[subKey]?.stateDesc
  result.state = `${mainStdStateDesc ?? ""}-${subStdStateDesc ?? ""}`
  result.mainState = mainState
  result.subState = subState

  if (mainStdState?.color) result.color = mainStdState?.color
  return result
}
