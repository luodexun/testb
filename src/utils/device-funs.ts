/*
 * @Author: xiongman
 * @Date: 2023-09-19 19:39:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 13:46:21
 * @Description:
 */

import {
  StorageCompanyData,
  StorageDeviceModelMap,
  StorageStationData,
  StorageStnDvsType,
  StorageSubSysType,
  StorageUserInfo,
} from "@configs/storage-cfg.ts"
import { CONFIG_MAP } from "@store/atom-config.ts"
import {
  getStorage,
  isEmpty,
  parseNum,
  reduceList2KeyValueMap,
  setStorage,
  stationTrform,
  uDate,
  validOperate,
  validResErr,
} from "@utils/util-funs.tsx"
import { CSSProperties } from "react"

import { doBaseServer, doNoParamServer } from "@/api/serve-funs.ts"
import { AlarmListData } from "@/types/i-alarm"
import { TOptions } from "@/types/i-antd"
import { TStorageInfo } from "@/types/i-api.ts"
import { ILoginInfo } from "@/types/i-auth"
import {
  IConfigDeviceStateData,
  IDeviceTypeOfStation,
  ISubSystemType,
  TDeviceType,
  TSubSysTypeMap,
} from "@/types/i-config.ts"
import {
  IDeviceData,
  IDvsMeasurePointData,
  IDvsMeasurePointTreeData,
  IDvsModelMap,
  IStnDvsType4LocalStorage,
} from "@/types/i-device.ts"

export interface IQueryDeviceParams {
  id?: number
  deviceCode?: string
  deviceType?: TDeviceType | string
  modelId?: number
  model?: string
  stationId?: number
  stationCode?: string
  periodCode?: number
  lineCode?: number
}

export async function queryDevicesByParams(
  params: IQueryDeviceParams,
  deviceTypeMap?: Record<TDeviceType, string>,
): Promise<IDeviceData[]> {
  const resData = await doBaseServer<IQueryDeviceParams, IDeviceData[]>("queryDevicesDataByParams", params)
  if (validResErr(resData) || !Array.isArray(resData)) return []
  if (deviceTypeMap) dealDvs4StnInfo(resData, deviceTypeMap)
  return resData
}

// 处理场站设备各个字段数据
export function dealDvs4StnInfo(dvsList: IDeviceData[], deviceTypeMap?: Record<TDeviceType, string>) {
  dvsList.forEach((item) => {
    if (!isEmpty(deviceTypeMap)) {
      item.deviceTypeLabel = item.deviceTypeLabel || deviceTypeMap[item.deviceType]
    }
    item.deviceNumber = item.deviceTags?.operation_code || item.deviceName
    item.ratedPower = item.deviceTags?.rated_power
    item.operatDateStr = uDate(item.operationDate, undefined, "")
    item.pvcol = item.deviceTags?.pvcol
  })
}

// 获取配置数据，都是数组响应
export async function getConfigDataAndLocaled<T>(storageInfo: TStorageInfo): Promise<T[]> {
  const storeData = getStorage<T[]>(storageInfo)
  if (storeData) return storeData

  const { urlKey } = storageInfo
  const resData = await doNoParamServer<T[]>(urlKey)
  if (validResErr(resData) || !Array.isArray(resData)) return []
  setStorage(resData, storageInfo)
  if (storageInfo.key === "DEVICE_STD_STATE" || storageInfo.key === "DEVICE_STD_NEW_STATE") {
    ;(resData as IConfigDeviceStateData[]).forEach(
      (item) => item.stateType === "MAIN" && (item.styleInfo = dealStateColor(item.color)),
    )
    const DVS_STATE_4TYPE = reduceList2KeyValueMap(resData, { vField: "deviceType" }, [])
    setStorage(DVS_STATE_4TYPE, {
      ...storageInfo,
      key: storageInfo.key === "DEVICE_STD_STATE" ? "DVS_STATE_4TYPE" : "DVS_NEW_STATE_4TYPE",
    })
  }
  return resData
}

// 获取设备子系统设备映射数据
export async function getDvsSubsystemPartMap(deviceType: TDeviceType): Promise<TSubSysTypeMap[TDeviceType]> {
  let subSysTypeMap = getStorage<TSubSysTypeMap>(StorageSubSysType)
  if (subSysTypeMap?.[deviceType]) return subSysTypeMap[deviceType]
  const resData = await doNoParamServer<ISubSystemType[]>("getSubSystemTypeData")
  if (validResErr(resData) || !Array.isArray(resData) || !resData?.length) return {}

  subSysId2DvsType(resData)
  // 按设备类型分组
  const dvs2SubSysTypesMap = reduceList2KeyValueMap(resData, { vField: "deviceType" }, [])
  // 组成 设备类型到子系统信息的map
  subSysTypeMap = Object.entries(dvs2SubSysTypesMap).reduce((prev, [dvsType, list]) => {
    prev[dvsType] = reduceList2KeyValueMap(list, { vField: "id", lField: "name" }, (data) => data)
    return prev
  }, {} as TSubSysTypeMap)
  setStorage(subSysTypeMap, StorageSubSysType)
  return subSysTypeMap[deviceType]
}

// 将子系统分类数据的 id 转成设备类型，添加设备类型字段值
function subSysId2DvsType(subSysData: ISubSystemType[]) {
  //子系统id,以设备类型区分：风机1开头，光伏逆变器2开头，储能变流器3开头，升压站4开头
  let id: string
  subSysData.forEach((item) => {
    // 添加下拉框字段
    item.value = item.id
    item.label = item.name
    // 根据id转译成设备类型
    id = `${item.id}`
    if (id.startsWith("1")) item.deviceType = "WT"
    else if (id.startsWith("2")) item.deviceType = "PVINV"
    else if (id.startsWith("3")) item.deviceType = "ESPCS"
    else item.deviceType = "SYZZZ"
  })
}

export function dealStateColor(colorStr?: string): CSSProperties {
  if (!colorStr) return undefined
  return { color: colorStr }
}

export async function getDeviceModelMap() {
  const storeData = getStorage<IDvsModelMap>(StorageDeviceModelMap)
  if (storeData?.deviceModelList?.length) return storeData

  const resData = await doNoParamServer<IDvsModelMap["deviceModelList"]>("getAllDeviceModel")
  if (validResErr(resData) || !Array.isArray(resData)) return {} as IDvsModelMap
  const typeToOptionsMap = resData.reduce(
    (prev, next) => {
      if (!prev[next.deviceType]) prev[next.deviceType] = []
      prev[next.deviceType].push({ value: next.id, label: next.model })
      return prev
    },
    {} as IDvsModelMap["typeToOptionsMap"],
  )
  const deviceModelList = resData
  const idToInfoMap = reduceList2KeyValueMap(resData, { vField: "id" }, (data) => data)
  const dvsModelMap: IDvsModelMap = { typeToOptionsMap, deviceModelList, idToInfoMap }
  setStorage(dvsModelMap, StorageDeviceModelMap)
  return dvsModelMap
}

interface IDvsMeasurePointsParams {
  modelId?: string | number | null
  pointTypes?: string
  deviceId?: number
  pointName?: string
  systemId?: number
  deviceCode?: string
  deviceType?: string
}

// 获取设备测点数据
export async function getDvsMeasurePointsData(
  params: IDvsMeasurePointsParams,
  api = "getDeviceSubPartPointData",
): Promise<IDvsMeasurePointData[]> {
  const measurePoints = await doBaseServer<IDvsMeasurePointsParams, IDvsMeasurePointData[]>(api, params)
  if (validResErr(measurePoints) || !measurePoints?.length) return []
  return measurePoints
}

export function measurePoints2TreeData(measurePoints: IDvsMeasurePointData[]): IDvsMeasurePointTreeData[] {
  const systemIdMap = reduceList2KeyValueMap(measurePoints, { vField: "systemId" }, []) as Record<
    string,
    IDvsMeasurePointData[]
  >
  const { deviceSystemMap } = CONFIG_MAP.map
  let theChildren: IDvsMeasurePointData[], theFirstChild: IDvsMeasurePointData
  return Object.keys(systemIdMap)
    .map((systemId) => {
      // if (!deviceSystemMap[systemId]) return null
      theChildren = systemIdMap[systemId]
      theFirstChild = theChildren[0]
      return {
        title: deviceSystemMap[systemId] || "未知",
        value: systemId || "未知",
        modelId: theFirstChild.modelId,
        children: systemIdMap[systemId].map(({ pointDesc, pointName, pointType, modelId }) => ({
          title: pointDesc,
          value: pointName,
          modelId,
          pointType,
          isLeaf: true,
        })),
      }
    })
    .filter(Boolean)
}

// 计算出力率
export function calcRate(activePower: number, ratedPower: number) {
  const rate = (parseNum(activePower, -1) * 100) / (parseNum(ratedPower, -1, 1) || 1)
  return parseNum(rate)
}

// 根据StorageStnDvsType数据过滤出某个设备类型下有哪些场站
export const getTypeStationList = (type, key = "stationCode", isTree = true) => {
  const hasWTDvTypeStation =
    getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)?.filter((i) => i.deviceTypes.includes(type)) || []
  const { stationList } = getStorage(StorageStationData) || {}
  let result = []
  result = hasWTDvTypeStation?.map((i) => {
    const item = stationList?.find((item) => item.id === i.stationId)
    return {
      ...item,
      label: item?.shortName || "1",
      value: item?.[key] || "2",
    }
  })
  if (!isTree) return result
  const companyList = getStorage(StorageCompanyData)
  return stationTrform(result, companyList, key)
}

// 获取当前场站类型
export const getStationType = (type) => {
  // W(风电),S(光伏/光热),F(风储),G(光储),H(风光储),P(分布式光伏),E(独立储能),T(独立变电站)
  let result = ""
  switch (type) {
    case "W":
    case "F":
      result = "WT"
      break
    case "S":
    case "G":
    case "P":
      result = "PVINV"
      break
    case "E":
      result = "ESPCS"
      break
    case "T":
      result = "SYZZZ"
      break
    default:
      result = "ALL"
  }
  return result
}

// 根据场站得出设备类型数组
export function getStn2DvsTypeMap(
  deviceTypeOfStationMap: Record<string, IDeviceTypeOfStation>,
  deviceTypeMap: Record<string, string>,
  stationId: any,
) {
  if (!stationId) return []
  const items = deviceTypeOfStationMap[stationId]
  let deviveTypeList = []
  deviveTypeList =
    items?.deviceTypes?.map((dvsType) => {
      return {
        label: deviceTypeMap[dvsType] || "未知",
        value: dvsType,
      }
    }) || []
  return deviveTypeList
}

// 批量确认,这个方法很多地方用到，改动记得看看影响
export async function bacthPass(selectedRows, confirmMsg?) {
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
  const params = selectedRows.map((i) => {
    return {
      startTime: i.startTime,
      deviceId: i.deviceId,
      alarmId: i.alarmId, //告警信息id，参考查询接口返回结果
      alarmLevelId: i.alarmLevelId,
      confirmBy: userInfoLocal?.realName || "",
      confirmMsg: confirmMsg || "",
    }
  })
  const res = await doBaseServer<AlarmListData[]>("confirmAlarmmsg", params)
  return validOperate(res)
}

// 获取未结束的实时告警
export const getHappeningAlarm = async (params) => {
  const res = await doBaseServer<AlarmListData[]>("happeningMsg", params)
  if (validResErr(res)) return false
  return res.list
}
export const getMngStaticInfo = async (quota = "site_quota") => {
  const info = await doBaseServer("queryMngStatic", { key: quota })
  if (validResErr(info)) return false
  return info.data
}
