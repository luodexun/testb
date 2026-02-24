/*
 * @Author: xiongman
 * @Date: 2023-09-25 10:17:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-07 15:15:38
 * @Description: 设备实时运行数据全局变量
 */

import { TSiteLayout } from "@configs/option-const.tsx"
import { isEmpty } from "@utils/util-funs.tsx"
import { atom } from "jotai"

import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config.ts"
import { TDvsTypeRunData4MQ } from "@/types/i-device.ts"

export type TRun4DvsData = {
  [dvsType in TDeviceType]?: TDvsTypeRunData4MQ
}
const RUN_4DVS_INIT = { WT: {}, PVINV: {}, ESPCS: {}, SYZZZ: {} }

const RUN_4DVS_DATA = atom<TRun4DvsData>(RUN_4DVS_INIT)

const dvsTypeFlagArr: TDeviceType[] = []

const AtomRun4DvsData = atom(
  (get) => get(RUN_4DVS_DATA),
  (get, set, dataInfo: { type: TDeviceType; data: TDvsTypeRunData4MQ }) => {
    const controller = new AbortController()
    const { type, data } = dataInfo
    const prevData = get(RUN_4DVS_DATA)
    prevData[type] = data
    dvsTypeFlagArr.push(type)
    if (dvsTypeFlagArr.length < 3) return
    set(RUN_4DVS_DATA, { ...prevData })
    dvsTypeFlagArr.length = 0
    return () => controller.abort() // Jotai 自动在卸载时执行
  },
)
export const AtomAllTypeRun4DvsData = atom(
  (get) => get(RUN_4DVS_DATA),
  (get, set) => {
    set(RUN_4DVS_DATA, { WT: {}, PVINV: {}, ESPCS: {}, SYZZZ: {} })
  },
)
export default AtomRun4DvsData

type TAtomDvsStateCountMap = {
  [deviceType in TDeviceType]?: {
    [stationCode: string]: {
      [stateLabel: string]: number
    }
  }
}
interface IAtomDvsStCntMapData {
  stationCode: string
  deviceType: TDeviceType
  stateCountMap: TAtomDvsStateCountMap[TDeviceType][string]
}
const DVS_STATE_COUNT_MAP = atom<TAtomDvsStateCountMap>({})
export const AtomDvsStateCountMap = atom(
  (get) => get(DVS_STATE_COUNT_MAP),
  (get, set, data?: IAtomDvsStCntMapData) => {
    if (!data) return set(DVS_STATE_COUNT_MAP, {})
    const { stateCountMap, deviceType, stationCode } = data
    if (!stationCode || !deviceType || isEmpty(stateCountMap)) return
    const prevMap = get(DVS_STATE_COUNT_MAP)
    if (!prevMap[deviceType]) prevMap[deviceType] = {}
    prevMap[deviceType][stationCode] = stateCountMap
    set(DVS_STATE_COUNT_MAP, prevMap)
  },
)

type TAtomDvsStFilter4GlobalMap = {
  glbLayout: TSiteLayout
  glbCheckedState?: {
    [deviceType in TDeviceType]?: IConfigDeviceStateData["stateDesc"][]
  }
}
export const AtomDvsStFilter4GlbMap = atom<TAtomDvsStFilter4GlobalMap>({ glbLayout: "site" })
