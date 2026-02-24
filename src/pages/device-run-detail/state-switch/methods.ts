/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:21:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-11-28 09:18:00
 * @Description: 状态转换-方法们
 */

import { StorageDeviceStdNewState, StorageStationData } from "@configs/storage-cfg.ts"
import { day4Y2S } from "@configs/time-constant.ts"
import { getDvsMainStateList } from "@hooks/use-matrix-device-list.ts"
import { CONFIG_MAP } from "@store/atom-config.ts"
import { getStorage, uDate, validResErr, vDate } from "@utils/util-funs.tsx"
import { Dayjs } from "dayjs"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IConfigDeviceStateData } from "@/types/i-config.ts"
import { TDvsMainState } from "@/types/i-device.ts"
import { IAtomStation } from "@/types/i-station.ts"

import { IDvsStateTrendData, IDvsStateTrendParams } from "./types.ts"

export async function getDvsStateTrendData(dataParam: IDvsStateTrendParams, date: Dayjs, isUseNewDvsState) {
  const params: IDvsStateTrendParams = { deviceCode: dataParam.deviceCode }
  if (date) {
    // 查询时间减去24小时作为开始时间
    // 获取昨天的日期
    const yesterday = date.clone()
    // 获取昨天的开始时间（0点）
    const startOfYesterday = yesterday.startOf("day")
    // 获取昨天的结束时间（24点）
    const endOfYesterday = yesterday.endOf("day")
    params.startTime = startOfYesterday.valueOf()
    params.endTime = endOfYesterday.valueOf()
  } else {
    const date = vDate().subtract(3, "day")
    const startOfYesterday = date.startOf("day")
    const endOfYesterday = vDate().endOf("day")
    params.startTime = startOfYesterday.valueOf()
    params.endTime = endOfYesterday.valueOf()
    // console.log(params)
  }
  const api = !isUseNewDvsState ? "getDvsStateTrendDataV2" : "getDvsStateTrendDataV3"
  const resData = await doBaseServer<IDvsStateTrendParams, IDvsStateTrendData[]>(api, params)
  if (validResErr(resData)) return []
  if (isUseNewDvsState) {
    return dealNewDvsStateSwitchData2TableData(resData, dataParam)
  }
  return dealDvsStateSwitchData2TableData(resData, dataParam)
}

let stationMap: IAtomStation["stationMap"]
let allState2DescMap: Record<TDvsMainState, IConfigDeviceStateData>
function dealDvsStateSwitchData2TableData(list: IDvsStateTrendData[], dataParam: IDvsStateTrendParams) {
  if (!stationMap) {
    ;({ stationMap } = getStorage<IAtomStation>(StorageStationData) || {})
  }
  if (!allState2DescMap) {
    const { deviceStdStateMap } = CONFIG_MAP.map
    ;({ allState2DescMap } = getDvsMainStateList(deviceStdStateMap, dataParam.deviceType, null, "old"))
  }
  let prevEndTime: string, mainKey: string
  list.forEach((item, index) => {
    mainKey = `MAIN_${item.mainState}`
    item.index = index + 1
    item.stationName = stationMap?.[item.stationCode]?.shortName || item.stationCode
    // item.stateLabel = allState2DescMap?.[mainKey]?.stateDesc || `${item.mainState}`
    item.stateLabel = `${item.mainStateDesc}-${item.subStateDesc}`
    item.color = allState2DescMap?.[mainKey]?.color
    item.endDate = prevEndTime
    prevEndTime = item.startDate = uDate(item.Time, day4Y2S)
    item.id = `${item.endDate}_${item.mainState}`
  })
  return list
}
function dealNewDvsStateSwitchData2TableData(list: IDvsStateTrendData[], dataParam: IDvsStateTrendParams) {
  const dvsStates = getStorage<Array<any>>(StorageDeviceStdNewState)
  let prevEndTime: string
  list.forEach((item, index) => {
    item.index = index + 1
    item.stateLabel = `${item.MStateDesc}-${item.SStateDesc}`
    item.color = dvsStates?.find(
      (state) => state.stateType === "MAIN" && state.deviceType === dataParam.deviceType && state.state == item.MState,
    )?.color
    item.endDate = prevEndTime
    prevEndTime = item.startDate = uDate(item.Time, day4Y2S)
    item.id = `${item.endDate}_${item.MState}`
  })
  return list
}
