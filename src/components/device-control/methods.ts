/*
 * @Author: xiongman
 * @Date: 2023-10-31 16:34:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-21 16:30:31
 * @Description:
 */

import { TControlType } from "@configs/dvs-control.ts"
import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"

import { IControlParamMap, IDvsCurrentStateInfo } from "@/components/device-control/types.ts"
import { validFiveRule } from "@/pages/site-boost/methods/five-rule"
import { IFiveRuleSchForm } from "@/pages/site-boost/types"
import { TDeviceType } from "@/types/i-config.ts"
import { DvsStateInfo, IDeviceData } from "@/types/i-device.ts"
import { showMsg, validResErr } from "@/utils/util-funs"
import { doBaseServer } from "@/api/serve-funs"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info"

export function crtExecuteInfo(params: {
  deviceList: Partial<IDeviceData>[]
  stateInfo?: IDvsCurrentStateInfo
  operateInfo: IDvsRunStateInfo<TControlType>
  targetValue?: number
  defaultType?: TDeviceType
}): IControlParamMap["executeInfo"] | null {
  const { defaultType, deviceList, stateInfo, operateInfo, targetValue } = params
  if (!operateInfo) return null
  type TDeviceInfoMap = { deviceIds: number[]; deviceName: string[] }
  const deviceInfoMap: TDeviceInfoMap = { deviceIds: [], deviceName: [] }
  deviceList.forEach(({ deviceId, deviceNumber }) => {
    deviceInfoMap.deviceIds.push(deviceId)
    deviceInfoMap.deviceName.push(deviceNumber)
  })
  const { title, value, field, unit, valueFun } = operateInfo
  const isSyzzz = defaultType === "SYZZZ"
  const isPVCOL = defaultType === "PVCOL"
  let operateName = title
  operateName = targetValue && !isSyzzz ? `${operateName} ${targetValue}` : operateName
  operateName = targetValue && unit ? `${operateName} ${unit}` : operateName
  const firstDvs = deviceList?.[0]
  let pointName = value
  let pointDesc = ""
  if (isSyzzz) {
    pointName = firstDvs?.pointName
    pointDesc = firstDvs?.pointDesc
  }
  if (isPVCOL) {
    pointName = deviceList?.map((i) => i.pointName)?.join(",")
    pointDesc = deviceList?.map((i) => i.pointDesc)?.join(",")
    deviceInfoMap.deviceIds = [...new Set(deviceInfoMap.deviceIds)]
    deviceInfoMap.deviceName = [...new Set(deviceInfoMap.deviceName)]
  }
  return {
    stationName: firstDvs?.stationName,
    deviceName: deviceInfoMap.deviceName.join(","),
    stateName: stateInfo?.state,
    operateName,
    // 控制信息
    deviceIds: deviceInfoMap.deviceIds.join(","),
    pointName,
    pointDesc,
    controlType: `${field}`,
    operatorBy: "",
    authorizerBy: "",
    targetValue: valueFun(targetValue),
    interval: 0,
  }
}

// 五防合/分校验
export const fiveHeFenValid = async ({ pointName, controlType, stationCode, deviceCode }) => {
  const params = {
    pointName,
    controlType,
    stationCode,
    deviceCode,
  }
  try {
    const valid = await validFiveRule(params as IFiveRuleSchForm)
    // console.log(valid, validResErr(valid), "validResErr(valid)")
    const { code, msg } = valid
    if (code === 9999) {
      showMsg("操作失败：" + msg, "error")
      return false
    } else if (code === 400) {
      showMsg(msg, "error")
      return false
    } else if (code === 500) {
      showMsg("五防校验未通过")
      return false
    }
    return true
  } catch (e) {
    return false
  }
}

export async function getDeviceSignRecordData(params: { deviceId?: string; stationId?: string; isEnd?: boolean }) {
  if (!params.deviceId && !params.stationId) return []
  const resData = await doBaseServer<typeof params, IDvsSignalRecordInfo[]>("getSyzzzDeviceSignRecord", params)
  if (validResErr(resData)) return false
  return resData
}

export const getDvsSignLs = (signRecord: Array<IDvsSignalRecordInfo> = [], dvsList: Partial<IDeviceData>[] = []) => {
  const devSignMap = {}
  let signMsg = ""
  dvsList?.length &&
    dvsList.forEach((i) => {
      const list = signRecord?.filter((sign) => sign.deviceId === i.deviceId) || []
      devSignMap[i.deviceId] = list
      list.length ? (signMsg = signMsg + `${i.stationName}-${i.deviceNumber}，`) : ""
    })

  return { devSignMap, signMsg }
}

export const getDvsStateStr = (dvsList: DvsStateInfo[]) => {
  let signMsg = ""
  dvsList?.length &&
    dvsList.forEach((i) => {
      signMsg = signMsg + `${i.stationName}-${i.deviceName}，`
    })
  return signMsg
}
