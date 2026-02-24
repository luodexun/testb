/*
 * @Author: chenmeifeng
 * @Date: 2023-11-15 15:07:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-09 10:50:30
 * @Description:
 */
import { fail } from "assert"

import { doBaseServer } from "@/api/serve-funs"
import { COMMON_DEVICE_TYPE } from "@/configs/dvs-control"
import { StorageDeviceStdNewState, StorageDeviceType } from "@/configs/storage-cfg"
import { IDeviceState, IDeviceStatePage, IDvsStateDetail, IDvsStateSchForm } from "@/types/i-device"
import { IPageInfo } from "@/types/i-table"
import { getStorage, reduceList2KeyValueMap, validOperate, validResErr } from "@/utils/util-funs"

import { IS_ELEC_ENV } from "./configs"

let dvsState = null
export const transVioceText = (data) => {
  const { stationDesc, deviceDesc, deviceType, alarmDesc } = data
  const deviceTypeDesc = getStorage(StorageDeviceType)?.find((i) => i.code === deviceType)?.name || deviceType
  return stationDesc + "," + deviceTypeDesc + "," + deviceDesc + "," + alarmDesc
  // return uDate(startTime, day4Y2S) + "," + stationDesc + "," + deviceTypeDesc + "," + deviceDesc + "," + alarmDesc
}
export const speak = (text) => {
  if (IS_ELEC_ENV) {
    window.main2Api.textToSpeak(text)
  } else {
    const msg = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(msg)
  }
}

export const getAllComlossData = async (pageInfo: IPageInfo, formData: IDvsStateSchForm) => {
  const params = {
    ...formData,
    pageNum: pageInfo?.current,
    pageSize: pageInfo?.pageSize,
  }
  if (!dvsState) {
    const allState = getStorage(StorageDeviceStdNewState)
    dvsState = reduceList2KeyValueMap(allState, { vField: "deviceType" }, [])
  }
  const res = await doBaseServer<IDvsStateSchForm, IDeviceStatePage | IDeviceState>("getComDeviceState", params)
  if (validResErr(res)) return { records: [], total: 0, noCommunication: 0, fail: true }
  let data = []
  if ("list" in res.data) {
    data = res?.data.list
  } else {
    data = res?.data
  }
  const actualData = data?.map((i, idx) => {
    // i.deviceType = "WT"
    // 无通讯或未知
    const stateName =
      dvsState?.[i?.deviceType]?.find((item) => item.stateType === "MAIN" && item.state == i.mainState)?.stateDesc ||
      "无通讯"
    const deviceTypeName = COMMON_DEVICE_TYPE?.[i?.deviceType] || ""
    return {
      ...i,
      stateName,
      deviceTypeName,
      id: i.time + i.stationName + i.deviceCode,
      row_index: idx + 1,
    }
  })
  return {
    records: actualData || [],
    total: res?.count?.total,
    noCommunication: res?.count?.noCommunication || 0,
  }
}

export const getFinalAlarm = async () => {
  const res = await doBaseServer("getFinalAlarm")
  if (validResErr(res)) return false
  return res
}
export const getAlarmAudio = async (info) => {
  const res = await doBaseServer("getAlarmAudio", info)
  if (validResErr(res)) return false
  return res
}

export const comfirmState = async (list: IDvsStateDetail[]) => {
  const dvsCode = list?.map((i) => i.deviceCode)?.join(",")
  const res = await doBaseServer("confirmDeviceState", { deviceCode: dvsCode })
  return validOperate(res)
}
