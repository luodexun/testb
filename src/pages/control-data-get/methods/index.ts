import { TDeviceType } from "@/types/i-config"
import { ICDGTreeData } from "../types/point"
import { getDvsMeasurePointsData, queryDevicesByParams } from "@/utils/device-funs"
import { IDeviceData } from "@/types/i-device"
import { validResErr } from "@/utils/util-funs"
import { MutableRefObject } from "react"

export function dvsTreeItem2DvsData(treeItem: ICDGTreeData, deviceType: TDeviceType) {
  return {
    deviceId: treeItem.deviceId as number,
    deviceNumber: treeItem.deviceName,
    deviceCode: treeItem.deviceCode,
    deviceType,
    pointName: treeItem.id,
    pointDesc: treeItem.title,
    model: treeItem.model,
    stationCode: treeItem.stationCode,
    stationName: treeItem.stationName,
  }
}

export const getDvsTreeData = async (params) => {
  const resData = await queryDevicesByParams(params)
  if (!Array.isArray(resData)) return []
  const stations = getTreeData(resData)
  console.log(stations, "stations")
  return stations
}

function getTreeData(data: IDeviceData[]) {
  const arr = data.reduce((prev, cur) => {
    const existStn = prev.find((i) => i.stationId === cur.stationId)
    const { stationName, stationId, stationCode, modelId, deviceId, deviceCode, deviceName } = cur
    if (!existStn) {
      prev.push({
        title: stationName,
        key: stationId,
        modelId,
        stationCode,
        stationName,
        stationId: stationId,
        level: 1,
        disabled: true,
        isLeaf: false,
        children: [],
      })
    }
    const curStn = prev.find((i) => i.stationId === cur.stationId)
    // const test = [{ title: "测点1", key: "ced", isLeaf: true, level: 3 }]
    curStn?.children.push({
      title: deviceName,
      key: deviceId + "_" + stationId,
      id: deviceId,
      deviceId,
      deviceName,
      modelId,
      stationCode,
      stationName,
      stationId,
      deviceCode,
      disabled: true,
      level: 2,
      isLeaf: false,
      children: [],
    })
    return [...prev]
  }, [])
  return arr
}
export const getPointByDvs = async (data) => {
  const { modelId, deviceId, deviceCode, stationCode, stationName, deviceName } = data
  const params = {
    modelId: modelId,
    deviceId: deviceId,
    pointTypes: "3,4",
  }
  const res = await getDvsMeasurePointsData(params)
  if (validResErr(res)) return []
  return res.map((i) => {
    return {
      id: i.pointName,
      title: i.pointDesc,
      key: deviceId + "_" + i.pointName,
      pointName: i.pointName,
      isLeaf: true,
      level: 3,
      modelId,
      deviceName,
      deviceId,
      deviceCode,
      stationName,
      stationCode,
    }
  })
}
export function filterMultiStationCheck(
  checkedNodes: ICDGTreeData[],
  prevCheckedStnRef: MutableRefObject<string>,
  isOneStn = true,
) {
  const stnCodeSet = new Set<string>()
  checkedNodes.forEach(({ stationCode }) => stnCodeSet.add(stationCode))
  const isMultiStn = stnCodeSet.size > 1
  const lastLength = checkedNodes.length - 1
  const result: { keys: string[]; ponitList: ICDGTreeData[] } = { keys: [], ponitList: [] }
  checkedNodes.forEach((item, index) => {
    if (isMultiStn && item.stationCode === prevCheckedStnRef.current && isOneStn) return
    result.keys.push(item.key as string)
    if (item.isLeaf) result.ponitList.push(item)
    if (index === lastLength) prevCheckedStnRef.current = item.stationCode
  }, result)
  return result
}
