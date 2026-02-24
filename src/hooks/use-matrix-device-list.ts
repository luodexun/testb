/*
 * @Author: xiongman
 * @Date: 2023-10-25 11:43:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 11:14:40
 * @Description: 设备矩阵数据处理hooks方法
 */

import { MONITOR_SITE_INFO_MAP } from "@configs/dvs-state-info.ts"
import useMonitorStationData from "@hooks/use-monitor-station-data.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import AtomRun4DvsData from "@store/atom-run-device.ts"
import { queryDevicesByParams } from "@utils/device-funs.ts"
import { isEmpty, reduceList2KeyValueMap } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"

import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config.ts"
import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device.ts"
import { IStationData } from "@/types/i-station.ts"

type TDvsStateMap = Record<IDeviceRunData4MQ["mainState"], IConfigDeviceStateData>
const STATE_2DESC_MAP: Partial<Record<TDeviceType, TDvsStateMap>> = {}
const STATE_NEW_2DESC_MAP: Partial<Record<TDeviceType, TDvsStateMap>> = {}
const DVS_MAIN_STATE_LIST_MAP: Partial<Record<TDeviceType, IConfigDeviceStateData[]>> = {}
const DVS_MAIN_NEW_STATE_LIST_MAP: Partial<Record<TDeviceType, IConfigDeviceStateData[]>> = {}
// 根据设备类型获取状态信息，优先从缓存中读取数据
export function getDvsMainStateList(
  deviceStdStateMap: Record<TDeviceType, IConfigDeviceStateData[]>,
  deviceType: TDeviceType,
  filterKey?: IConfigDeviceStateData["stateType"],
  stateType: "old" | "new" = "old",
) {
  const mapKey = `${deviceType}${filterKey ? `-${filterKey}` : ""}`
  let stateInfoList: IConfigDeviceStateData[] =
    stateType === "new" ? DVS_MAIN_NEW_STATE_LIST_MAP[mapKey] : DVS_MAIN_STATE_LIST_MAP[mapKey]

  let allState2DescMap = stateType === "new" ? STATE_NEW_2DESC_MAP[deviceType] : STATE_2DESC_MAP[deviceType]
  if (isEmpty(stateInfoList)) {
    // 获取设备类型下的主状态列表
    let dvsStateList: IConfigDeviceStateData[] = deviceStdStateMap?.[deviceType] || []
    if (isEmpty(allState2DescMap)) {
      const res = reduceList2KeyValueMap(
        dvsStateList,
        { keyFun: (d) => `${d.stateType}_${d.state}` },
        (d) => d,
      ) as TDvsStateMap
      allState2DescMap = res
      stateType === "new" ? (STATE_NEW_2DESC_MAP[deviceType] = res) : (STATE_2DESC_MAP[deviceType] = res)
    }
    if (filterKey) {
      dvsStateList = dvsStateList?.filter((item) => item.stateType === filterKey)
    }
    // 按stateDesc去重
    const reduceMap = reduceList2KeyValueMap(dvsStateList, { vField: "stateDesc" }, (d) => d)
    if (stateType === "new") {
      stateInfoList = DVS_MAIN_NEW_STATE_LIST_MAP[mapKey] = Object.values(reduceMap)
    } else {
      stateInfoList = DVS_MAIN_STATE_LIST_MAP[mapKey] = Object.values(reduceMap)
    }
  }
  return { stateInfoList, allState2DescMap }
}

// 处理设备运行数据，添加状态转译数据
export function setDvsRunDataStateInfo(
  deviceStdStateMap: Record<TDeviceType, IConfigDeviceStateData[]>,
  deviceType: TDeviceType,
  runData: IDeviceRunData4MQ,
  stateType?: "old" | "new",
) {
  // console.log("setDvsRunDataStateInfo", deviceStdStateMap, deviceType, runData, stateType)

  const { allState2DescMap } = getDvsMainStateList(deviceStdStateMap, deviceType, null, stateType)
  const mainKey = `MAIN_${runData.mainState}`
  const subKey = `SUB_${runData.subState}`
  const mainStateInfo = allState2DescMap?.[mainKey]
  const subStateInfo = allState2DescMap?.[subKey]
  runData.mainStateLabel = mainStateInfo?.stateDesc
  runData.mainStateStyle = mainStateInfo?.styleInfo
  runData.subStateLabel = subStateInfo?.stateDesc
  runData.stateLabel = `${runData.mainStateLabel ?? ""}-${runData.subStateLabel ?? ""}`
  runData.deviceType = deviceType
}

// 融合场站基础数据和场站设备运行数据的方法，返回按设备类型分组的设备列表数据
export default function useMatrixDeviceList(params: { station: IStationData }) {
  const { station } = params
  const [deviceList, setDeviceList] = useState<IDeviceData[]>([])
  const run4Device = useAtomValue(AtomRun4DvsData)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map

  const dvsTypeListRef = useRef<TDeviceType[]>(Object.keys(MONITOR_SITE_INFO_MAP) as TDeviceType[])

  // 获取场站监控数据 getStationInfoData 接口数据的deviceType映射
  useMonitorStationData(dvsTypeListRef.current)

  useEffect(() => {
    if (!station?.stationCode) return
    const deviceTypeStr = dvsTypeListRef.current.join(",") // "WT,PVINV,ESPCS"
    const queryParams = { stationCode: station?.stationCode, deviceType: deviceTypeStr }
    // 获取各个场站下的设备
    queryDevicesByParams(queryParams, deviceTypeMap).then(setDeviceList)
  }, [deviceTypeMap, station])

  useEffect(() => {
    let deviceType: TDeviceType, deviceCode: string, runData: IDeviceRunData4MQ
    // 这里只是修改 deviceList 各元素内的属性值，deviceList 变量引用不会变，因此不会触发deviceList变化的监听
    setDeviceList((prevDvsList) => {
      return prevDvsList.map((deviceInfo) => {
        ;({ deviceType, deviceCode } = deviceInfo)
        runData = run4Device?.[deviceType]?.[deviceCode] || ({} as IDeviceRunData4MQ)
        deviceInfo.runData = runData
        return deviceInfo
      })
    })
  }, [run4Device])

  // 按设备类型对设备分组
  const dvsTypeGroup: Record<TDeviceType, IDeviceData[]> = useMemo(
    () => reduceList2KeyValueMap(deviceList, { vField: "deviceType" }, []),
    [deviceList],
  )

  return dvsTypeGroup
}
