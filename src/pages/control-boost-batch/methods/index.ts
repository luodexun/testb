import { getDvsMeasurePointsData, queryDevicesByParams } from "@utils/device-funs.ts"
import { getStorage, validResErr } from "@utils/util-funs.tsx"

import { IBatchStn2DvsTreeData } from "@/pages/control-batch/types/i-batch.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceData, IDvsMeasurePointData, IQueryDeviceDataParams } from "@/types/i-device.ts"
import { StorageDeviceSystem } from "@/configs/storage-cfg"

export async function getDeviceTreeData(params: IQueryDeviceDataParams) {
  const resData = await queryDevicesByParams(params)
  if (!Array.isArray(resData)) return []
  const data = getTreeData(resData)
  if (!data?.length) return []
  return getIsLeafData(data)
}

function getTreeData(data: IDeviceData[]) {
  const convertedData = []

  for (const item of data) {
    const { stationName, stationId, stationCode, deviceCode, deviceId, deviceName, lineCode, lineName, modelId } = item
    // 检查是否已经存在该站点
    let station = convertedData.find((elem) => elem.key === stationId)
    if (!station) {
      station = {
        title: stationName,
        key: stationId,
        modelId,
        stationCode,
        stationName,
        stationId: stationId,
        deviceCode,
        deviceId,
        deviceName,
        level: 1,
        isLeaf: false,
        children: [],
      }
      convertedData.push(station)
    }
  }
  return convertedData
}

export const getIsLeafData = async (data: IBatchStn2DvsTreeData[]) => {
  const res = await getDvsMeasurePointsData({ pointTypes: "3,4" })
  if (validResErr(res) || !Array.isArray(res)) return data
  const sysList = getStorage(StorageDeviceSystem)
  const getLineChild = data.map((station) => {
    const curModelList = res.filter((i) => i.modelId === station.modelId)
    return {
      ...station,
      children: getLine(station, curModelList, sysList),
    }
  })
  return getLineChild
  // return getDeviceChildren(data, res)
}

const getLine = (data: IBatchStn2DvsTreeData, curModelList: IDvsMeasurePointData[], sysList) => {
  const result = []
  curModelList.forEach((i) => {
    const system = result?.find((j) => j.systemId === i.systemId)
    const { stationName, stationId, stationCode, deviceCode, deviceId, deviceName } = data || {}
    const sysInfo = sysList?.find((sys) => sys.id === i.systemId)
    const { systemId, modelId, pointDesc, pointName } = i
    if (!system) {
      result.push({
        title: sysInfo?.name || "未知",
        key: deviceId + "_" + (systemId || "未知") + "_" + modelId,
        systemId,
        deviceCode,
        deviceId: deviceId,
        level: 2,
        modelId,
        stationId,
        stationName,
        stationCode,
        deviceName,
        isLeaf: false,
        // disabled: true,
        children: [],
      })
    }
    const curInfo = result?.find((j) => j.systemId === i.systemId)
    curInfo.children.push({
      id: pointName,
      key: deviceId + "-" + pointName,
      title: pointDesc,
      deviceCode: deviceCode,
      modelId: modelId,
      deviceId: deviceId,
      isLeaf: true,
      stationId: stationId,
      stationName: stationName,
      deviceName: deviceName,
      stationCode: stationCode,
    })
  })
  return result
}

export function getDeviceChildren(data: IBatchStn2DvsTreeData[], res: IDvsMeasurePointData[]) {
  for (let i = 0; i < data.length; i++) {
    const e = data[i]
    if (e.level > 1) {
      e.children = res
        ?.filter((item) => e.modelId === item.modelId)
        ?.map((row) => {
          return {
            id: row?.pointName,
            key: e.deviceId + "-" + row?.pointName,
            title: row?.pointDesc,
            deviceCode: e.deviceCode,
            modelId: e.modelId,
            deviceId: e.deviceId,
            isLeaf: true,
            stationId: e.stationId,
            stationName: e.stationName,
            deviceName: e.deviceName,
            stationCode: e.stationCode,
          }
        })
    }
    if (e.children?.length) {
      getDeviceChildren(e.children, res)
    }
  }
  return data
}

export function dvsTreeItem2DvsData(treeItem: IBatchStn2DvsTreeData, deviceType: TDeviceType) {
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
