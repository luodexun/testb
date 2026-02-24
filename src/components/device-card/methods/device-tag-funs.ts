/*
 * @Author: xiongman
 * @Date: 2023-10-25 15:16:48
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-25 15:16:48
 * @Description: 区域中心设备矩阵标签组件-数据处理方法
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { calcRate, dealStateColor } from "@utils/device-funs.ts"
import { isEmpty, numberVal } from "@utils/util-funs.tsx"
import { isNumber } from "ahooks/es/utils"

import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device.ts"

// 处理设备运行数据，状态转译
export function transDvsRunStateInfo(
  params: Partial<Omit<IDeviceData, "runData"> & IDeviceRunData4MQ>,
  tagList: IDvsRunStateInfo<keyof IDeviceRunData4MQ>[],
) {
  const tagStyle = dealStateColor("#DDDDDD")
  const result = { contentList: [], tagStyle, mixedData: params }
  if (isEmpty(params)) return result

  const { mainStateLabel, mainStateStyle, subStateLabel } = params
  result.tagStyle = mainStateStyle || result.tagStyle

  if (isNumber(params.activePower) && isNumber(params.ratedPower)) {
    params.rate = calcRate(params.activePower, params.ratedPower)
  }
  // 状态转译
  let mainVal: string | number, subVal: string | number
  // 弹出层内容
  result.contentList = tagList.map((item: IDvsRunStateInfo) => {
    mainVal = params?.[item.field] ?? "-"
    const newItem = { ...item, value: numberVal(`${mainVal}`) }
    if (item.field !== "mainState") return newItem

    newItem.color = mainStateStyle?.color
    mainVal = mainStateLabel || ""
    subVal = subStateLabel || ""
    newItem.value = `${mainVal}-${subVal}`
    return newItem
  })

  return result
}
