import { MutableRefObject } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { StorageDeviceType, StorageStnDvsType } from "@/configs/storage-cfg"
import { TTreeOptions } from "@/types/i-antd"
import { IDeviceData, IQueryDeviceDataParams, IStnDvsType4LocalStorage } from "@/types/i-device"
import { IStationData } from "@/types/i-station"
import { queryDevicesByParams } from "@/utils/device-funs"
import { getStorage, isEmpty, validResErr } from "@/utils/util-funs"

import { IBatchStn2DvsTreeData, IQueryAlarmParams, TAlarmFormField } from "../types"

export const getAllStnDvsTree = async (stationList: IStationData[], deviceType) => {
  const params = { deviceType }
  const resData = await doBaseServer<any, IDeviceData[]>("queryDevicesDataByParams", params)
  if (validResErr(resData) || !Array.isArray(resData)) return []
  const result = stationList?.map((i, idx) => {
    const allDvs = resData?.filter((j) => j.stationCode === i.stationCode)
    // deviceTrforms
    return {
      id: i.id,
      key: `${i.id}${idx}`,
      title: i.shortName,
      stationCode: i.stationCode,
      stationName: i.shortName,
      isLeaf: false,
      children: deviceTrform(allDvs, "deviceCode", "deviceName"),
    }
  })
  console.log(result, "result")
  return result
}

function deviceTrform(deviceList, key = "deviceId", title = "deviceNumber"): TTreeOptions {
  return deviceList.reduce((acc: TTreeOptions, cur) => {
    const info = acc?.filter((i) => i.modelId === cur.modelId)
    if (!info?.length) {
      acc.push({
        id: cur.modelId,
        key: cur.modelId + "模型",
        title: cur.model,
        value: cur.modelId + "模型",
        isLeaf: false,
        children: [],
        modelId: cur.modelId,
      })
    }
    acc?.forEach((i) => {
      if (i.modelId === cur.modelId) {
        i.children.push({
          id: cur[key],
          key: cur[key],
          value: cur[key],
          title: cur[title],
          label: cur[title],
          modelId: cur.modelId,
          isLeaf: true,
        })
      }
    })
    return acc
  }, [])
}

// export function filterMultiStationCheck(
//   checkedNodes: IBatchStn2DvsTreeData[],
//   prevCheckedStnRef: MutableRefObject<string>,
//   isOneStn = true,
// ) {
//   // const stnCodeSet = new Set<string>()
//   // checkedNodes.forEach(({ stationCode }) => stnCodeSet.add(stationCode))
//   // console.log(stnCodeSet, "stnCodeSet")

//   // const isMultiStn = stnCodeSet.size > 1
//   const lastLength = checkedNodes.length - 1
//   const result: { keys: string[]; dvsList: IBatchStn2DvsTreeData[] } = { keys: [], dvsList: [] }
//   checkedNodes.forEach((item, index) => {
//     // if (isMultiStn && item.stationCode === prevCheckedStnRef.current && isOneStn) return
//     result.keys.push(item.key as string)
//     if (item.isLeaf) result.dvsList.push(item)
//     // if (index === lastLength) prevCheckedStnRef.current = item.stationCode
//   }, result)
//   return result
// }
let DEFAULT_DEVICE_DATA = []
export async function getDeviceTreeData(type) {
  const resData = await doBaseServer<IQueryDeviceDataParams, IDeviceData[]>("queryDevicesDataByParams", {
    deviceType: type,
  })
  if (validResErr(resData) || !Array.isArray(resData)) return []
  DEFAULT_DEVICE_DATA = [...resData]
  return resData
}

export function getTreeData(data: IDeviceData[]) {
  if (data?.length) {
    const result = []
    const stationMap = new Map()
    for (const item of data) {
      const { stationId, stationName, deviceId, deviceName, deviceCode, deviceType, model, modelId } = item

      let station = stationMap.get(stationId)
      if (!station) {
        station = {
          stationId,
          stationName,
          key: stationName + "_" + stationId,
          title: stationName,
          model: model,
          disabled: true,
          level: 1,
          isLeaf: false,
          children: [],
        }
        stationMap.set(stationId, station)
        result.push(station)
      }
      let line = station.children.find((child) => child["model"] === model)
      if (!line) {
        line = {
          title: model || "--",
          key: stationId + "_" + model + "_" + item[model],
          disabled: false,
          model,
          modelId,
          level: 2,
          isLeaf: false,
          children: [],
        }
        station.children.push(line)
      }
      const device = {
        deviceId,
        deviceName,
        modelId,
        stationId,
        deviceType,
        key: deviceId,
        title: deviceName,
        deviceCode,
        level: 3,
        isLeaf: true,
        disabled: false,
      }
      line.children.push(device)
    }
    return result
  }
}

export function setChildrenDisabled(selectData: (string | number)[], data: IBatchStn2DvsTreeData[]) {
  const newData: IBatchStn2DvsTreeData[] = [...data]
  for (const node of newData) {
    if (node.children) {
      node.children = setChildrenDisabled(selectData, node.children)
    }
  }
  return newData
}

export function filterMultiStationCheck(
  checkedNodes: IBatchStn2DvsTreeData[],
  prevCheckedStnRef: MutableRefObject<string>,
) {
  const stnCodeSet = new Set<string>()
  checkedNodes.forEach(({ stationCode }) => stnCodeSet.add(stationCode))
  const isMultiStn = stnCodeSet.size > 1
  const lastLength = checkedNodes.length - 1
  const result: { keys: string[]; dvsList: IBatchStn2DvsTreeData[] } = { keys: [], dvsList: [] }
  checkedNodes.forEach((item, index) => {
    if (isMultiStn && item.stationCode === prevCheckedStnRef.current) return
    result.keys.push(item.key as string)
    if (item.isLeaf) result.dvsList.push(item)
    if (index === lastLength) prevCheckedStnRef.current = item.stationCode
  }, result)
  return result
}

export const getChildArr = (data) => {
  const arr = data.reduce((prev, cur) => {
    const childArr = cur.children?.reduce((childPrev, childCur) => {
      return childPrev.concat(childCur?.children || [])
    }, [])
    const result = prev.concat(childArr)
    return result
  }, [])
  return arr
}
export async function onAlarmRuleSchFormChg(
  changedValue: IQueryAlarmParams,
  formInst: IFormInst,
  deviceTypeMap,
): Promise<TFormItemConfig<TAlarmFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey) || isEmpty(chgedVal)) return {}

  const theFormInst = formInst?.getInst()
  if (chgedKey === "stationId") {
    const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
    const deviceTypes = getStorage(StorageDeviceType) || []
    const items = deviceTypesOfSt.find((e) => e.stationId == chgedVal)
    const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal, deviceTypes)
    theFormInst?.setFieldsValue({
      deviceIds: [],
      deviceType: undefined,
    })
    return { deviceType: { options: deviceTypeOptions }, deviceIds: { options: [] } }
  }
  if (chgedKey == "deviceType") {
    const data = theFormInst?.getFieldsValue()
    const schParams = { stationId: data.stationId, deviceType: chgedVal }
    const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
    // const theDvsIdFirst: TOptions<string>[0] = dvsOptions?.[0]
    const dvsOptions = deviceTrform(dvsList)
    // const theSysIdFirst: TOptions<string>[0] = systemIdOptions?.[0]
    // 如果是从其它页面点击某条数据跳转过来，不用置空
    theFormInst?.setFieldsValue({
      deviceIds: [],
    })
    return { deviceIds: { options: dvsOptions } }
  }
  return {}
}
const getIntersection = (data = [], stationIds, dvsTypes = []) => {
  if (!data.length) return []
  const newData = data.map((item) => ({
    label: dvsTypes?.find((i) => i.code === item)?.name || item,
    value: item,
    stationIds,
  }))

  return newData
}
