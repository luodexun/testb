/*
 * @Author: xiongman
 * @Date: 2023-09-19 19:39:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 13:42:45
 * @Description: 系统接口-配置管理-全局变量们
 */

import {
  StorageAlarmLevels,
  StorageCompanyData,
  StorageControlType,
  StorageDeviceSignal,
  StorageDeviceStdNewState,
  StorageDeviceStdState,
  StorageDeviceSystem,
  StorageDeviceType,
  StorageStationType,
  StorageStnDvsType,
} from "@configs/storage-cfg.ts"
import { getConfigDataAndLocaled } from "@utils/device-funs.ts"
import { createUUID, getStorage, reduceList2KeyValueMap } from "@utils/util-funs.tsx"
import { atom } from "jotai"

import { TStorageInfo } from "@/types/i-api.ts"
import { IConfigDeviceStateData, IConfigTypeData, IDeviceSignal, ISubSystemType } from "@/types/i-config.ts"

type TConfigKey =
  | "deviceType"
  | "stationType"
  | "deviceStdState"
  | "deviceStdNewState"
  | "controlType"
  | "deviceTypeOfStation"
  | "deviceSystem"
  | "deviceSignal"
  | "proAndComList"
  | "alarmlevelLs"
type TConfigMapKey =
  | "deviceTypeMap"
  | "stationTypeMap"
  | "deviceStdStateMap"
  | "deviceStdNewStateMap"
  | "controlTypeMap"
  | "deviceTypeOfStationMap"
  | "deviceSystemMap"
  | "deviceSignalMap"
  | "proAndComListMap"

export type TConfigAtom = Record<
  TConfigKey,
  IConfigDeviceStateData[] | IConfigTypeData[] | ISubSystemType[] | IDeviceSignal[]
>
export type TConfigMapAtom = Partial<Record<TConfigMapKey, any>>

const STORAGE_LIST: Record<TConfigKey, TStorageInfo> = {
  deviceType: StorageDeviceType,
  stationType: StorageStationType,
  deviceStdState: StorageDeviceStdState,
  deviceStdNewState: StorageDeviceStdNewState,
  controlType: StorageControlType,
  deviceTypeOfStation: StorageStnDvsType,
  deviceSystem: StorageDeviceSystem,
  deviceSignal: StorageDeviceSignal,
  proAndComList: StorageCompanyData,
  alarmlevelLs: StorageAlarmLevels,
}

type TConfigMap = {
  list: TConfigAtom
  map: TConfigMapAtom
}
export const CONFIG_MAP: TConfigMap = Object.keys(STORAGE_LIST).reduce(
  (prev, key) => {
    prev.list[key] = []
    prev.map[`${key}Map`] = {}
    return prev
  },
  { list: {} as TConfigAtom, map: {} as TConfigMapAtom },
) //{ list: {deviceType: [],...}, map:{deviceTypeMap: {}, ...} }

const CONFIG_MAP_ATOM = atom<TConfigMap>(CONFIG_MAP)

// 配置数据全局变量
export const AtomConfigMap = atom(
  (get) => get(CONFIG_MAP_ATOM),
  async (_, set) => {
    const { deviceType, stationType, deviceStdState } = CONFIG_MAP.list
    if (deviceType?.length && stationType?.length && deviceStdState?.length) return
    const storageArr = Object.entries(STORAGE_LIST) as [TConfigKey, TStorageInfo][]
    for await (const [key, storage] of storageArr) {
      const resData = await getConfigDataAndLocaled<IConfigTypeData>(storage)
      if (!resData?.length) return
      CONFIG_MAP.list[key] = resData
      if (key === "deviceStdState") {
        CONFIG_MAP.map[`${key}Map`] = getStorage({ ...storage, key: "DVS_STATE_4TYPE" })
      } else if (key === "deviceStdNewState") {
        CONFIG_MAP.map[`${key}Map`] = getStorage({ ...storage, key: "DVS_NEW_STATE_4TYPE" })
      } else if (key === "controlType" || key === "deviceSystem" || key === "alarmlevelLs") {
        CONFIG_MAP.map[`${key}Map`] = reduceList2KeyValueMap(resData, { vField: "id", lField: "name" })
      } else if (key === "deviceTypeOfStation") {
        CONFIG_MAP.map[`${key}Map`] = reduceList2KeyValueMap(resData, { vField: "stationId" }, (d) => d)
      } else if (key === "deviceSignal") {
        CONFIG_MAP.map[`${key}Map`] = reduceList2KeyValueMap(resData, { vField: "signState", lField: "signDesc" })
      } else {
        CONFIG_MAP.map[`${key}Map`] = reduceList2KeyValueMap(resData, { vField: "code", lField: "name" })
      }
    }
    set(CONFIG_MAP_ATOM, CONFIG_MAP)
  },
)
AtomConfigMap.onMount = (setAtom) => setAtom

// MQ clientId 统一后缀
// const MQTT_SUFFIX = atom<string>(createUUID())
// export const AtomMQSuffix = atom(
//   (get) => get(MQTT_SUFFIX),
//   (_, set) => {
//     set(MQTT_SUFFIX, createUUID())
//   },
// )
