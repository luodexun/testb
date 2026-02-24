/*
 * @Author: xiongman
 * @Date: 2023-10-26 11:49:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-13 11:05:55
 * @Description:
 */

import { DEVICE_RUN_CARD_FIELD_4TYPE, IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { useMemo, useRef } from "react"

import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device.ts"

import { transDvsRunStateInfo } from "./device-tag-funs.ts"

export default function useDeviceTag(
  info: Omit<IDeviceData, "runData">,
  state: IDeviceRunData4MQ,
  filterChooseKeyColumns?: any[],
) {
  const tagListRef = useRef<IDvsRunStateInfo<keyof IDeviceRunData4MQ>[]>([])
  tagListRef.current = useMemo(() => {
    if (!info?.deviceType) return []
    if (!filterChooseKeyColumns) return DEVICE_RUN_CARD_FIELD_4TYPE[info.deviceType]
    return filterChooseKeyColumns
  }, [info?.deviceType, filterChooseKeyColumns])

  const mixedData = useMemo(() => Object.assign({}, state || {}, info || {}), [info, state])

  return useMemo(() => transDvsRunStateInfo(mixedData, tagListRef.current), [mixedData])
}
