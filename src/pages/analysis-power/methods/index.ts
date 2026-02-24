import { getDvsMeasurePointsData } from "@utils/device-funs.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { joinFormValue } from "@utils/table-funs.tsx"
import { validResErr } from "@utils/util-funs.tsx"
import { numberVal } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"
import dayjs from "dayjs"
import { MutableRefObject } from "react"

import { doBaseServer } from "@/api/serve-funs.ts"
import { dayY2D } from "@/configs/time-constant"
import { IDeviceData, IQueryDeviceDataParams } from "@/types/i-device.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { getStartAndEndTime } from "@/utils/form-funs.ts"
import { uDate } from "@/utils/util-funs"

import { ChartData, IResultData, IRpPowerData, IRpPowerSchForm, ITime, ITranformData } from "../types"
import { IBatchStn2DvsTreeData } from "../types/i-batch.ts"
let timeData: ITime[] = []

export let DEFAULT_DEVICE_DATA: IDeviceData[] = []
function getParmas(pageInfo: IPageInfo, formData: IRpPowerSchForm, deviceData?: string[], type?: number) {
  const timeRange = getTimeFormat(timeData)
  const params: IRpPowerSchForm = {
    deviceCode: joinFormValue(deviceData, ""),
    timeRange,
  }
  if (type) {
    params.pageNum = pageInfo.current
    params.pageSize = pageInfo.pageSize
  }
  return params
}

function getTimeFormat(timeData: ITime[]) {
  const newTime = timeData
    ?.map((e) => {
      const { startTime, endTime } = getStartAndEndTime<number>(
        [dayjs(new Date(e.startTime)), dayjs(new Date(e.endTime))],
        "",
        null,
        true,
      )
      return `${startTime}-${endTime}`
    })
    .join()
  return newTime
}

export function getTimeData(data: ITime[]) {
  timeData = data
}

//查询数据
export async function getReportPowerSchData(
  pageInfo: IPageInfo,
  formData: IRpPowerSchForm,

  data: string[],
  type: number,
) {
  const params = getParmas(pageInfo, formData, data, type)
  if (!params.deviceCode || !params.timeRange) return
  let resData = []
  let total = 0
  if (type) {
    const res = await doBaseServer<IQueryDeviceDataParams, IResultData>("getPowerList", params)
    resData = res.list
    total = res.total
  } else {
    const resChart = await doBaseServer<IQueryDeviceDataParams, IRpPowerData[]>("getPowerList", params)
    resData = resChart
  }
  if (validResErr(resData)) return { records: [], total: 0 }
  return { records: resData || [], total: total || 0 }
}

// 执行数据导出
export async function doExportReportPower(pageInfo: IPageInfo, formData: IRpPowerSchForm, deviceData?: string[]) {
  const params = getParmas(pageInfo, formData, deviceData)
  console.log(params)
  doBaseServer<typeof params, AxiosResponse>("exportPowerData", params).then((resData) => {
    dealDownload4Response(resData, "")
  })
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
    result.keys.push(item.deviceCode as string)
    if (item.isLeaf) result.dvsList.push(item)
    if (index === lastLength) prevCheckedStnRef.current = item.stationCode
  }, result)
  return result
}

export async function getDeviceTreeData() {
  const resData = await doBaseServer<IQueryDeviceDataParams, IDeviceData[]>("queryDevicesDataByParams", {
    deviceType: "WT",
  })
  if (validResErr(resData) || !Array.isArray(resData)) return []
  DEFAULT_DEVICE_DATA = [...resData]
  return resData
}

export function getTreeData(type: string, data: IDeviceData[]) {
  if (data?.length) {
    const result = []
    const stationMap = new Map()
    for (const item of data) {
      const { stationId, stationName, deviceId, deviceName, deviceCode } = item

      let station = stationMap.get(stationId)
      if (!station) {
        station = {
          stationId,
          stationName,
          key: stationName + "_" + stationId,
          title: stationName,
          disabled: true,
          level: 1,
          isLeaf: false,
          children: [],
        }
        stationMap.set(stationId, station)
        result.push(station)
      }

      let line = station.children.find((child) => child[type] === item[type])
      if (!line) {
        let title = item[type]
        // if (type === "lineCode") {
        //   title = `${item[type]}号集电线路`
        // }
        line = {
          [type]: item[type],
          title: title || "--",
          key: stationId + "_" + type + "_" + item[type],
          disabled: true,
          level: 2,
          isLeaf: false,
          children: [],
        }
        station.children.push(line)
      }

      const device = {
        deviceId,
        deviceName,
        key: deviceCode,
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
    if (node.level > 2) {
      if (selectData.includes(node.key)) {
        node.disabled = false
      } else {
        node.disabled = selectData?.length === 3
      }
    }
    if (node.children) {
      node.children = setChildrenDisabled(selectData, node.children)
    }
  }
  return newData
}

export function getStandAloneChartData(data: IRpPowerData[], type: number) {
  const result = getAloneTranform(data, type)
  const chartData = getAloneChartData(result, type)
  return chartData
}

function getAloneTranform(data: IRpPowerData[], type: number) {
  const result: ITranformData = {}
  for (const item of data) {
    const { startTime, endTime, deviceCode } = item
    const key = type ? deviceCode : `${startTime}~${endTime}`
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
  }
  return result
}

function getAloneChartData(result: ITranformData, type: number) {
  const newData: ChartData = {
    xAxis: [],
  }
  const firstProperty = Object.keys(result)[0]
  const firstItem = result[firstProperty]?.[0]
  newData.xAxis = result[firstProperty].map((e) => e.windSpeed)
  if (!type) {
    const { stationName, deviceName } = getDeviceMap(firstItem.deviceCode)
    const key = `${stationName}/${deviceName}`
    if (!newData[`${key}/实际空气密度有功功率`] || !newData[`${key}/标准空气密度有功功率`]) {
      newData[`${key}/实际空气密度有功功率`] = []
      newData[`${key}/标准空气密度有功功率`] = []
    }

    newData[`${key}/实际空气密度有功功率`] = result[firstProperty].map((e) =>
      Number(numberVal(e.actualActivePower) || 0),
    )
    newData[`${key}/标准空气密度有功功率`] = result[firstProperty].map((e) =>
      Number(numberVal(e.standardActivePower) || 0),
    )
  }
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const items = result[key]
      for (const item of items) {
        const { deviceCode, startTime, endTime, activePower, actualActivePower, standardActivePower } = item
        const { stationName, deviceName } = getDeviceMap(deviceCode)
        const newKey = `${stationName}/${deviceName}/${uDate(startTime, dayY2D)}~${uDate(endTime, dayY2D)}/统计功率`
        if (!newData[newKey]) {
          newData[newKey] = []
        }
        newData[newKey].push(Number(numberVal(activePower) || 0))

        if (type) {
          const actualKey = `${stationName}/${deviceName}/实际空气密度有功功率`
          const standardKey = `${stationName}/${deviceName}/标准空气密度有功功率`
          if (!newData[actualKey]) {
            newData[actualKey] = []
          }
          if (!newData[standardKey]) {
            newData[standardKey] = []
          }
          newData[actualKey].push(Number(numberVal(actualActivePower) || 0))
          newData[standardKey].push(Number(numberVal(standardActivePower) || 0))
        }
      }
    }
  }
  return newData
}

export function getDeviceMap(deviceCode: string) {
  const { stationName, deviceName } = DEFAULT_DEVICE_DATA?.find((e) => e.deviceCode === deviceCode) || {}

  return {
    stationName,
    deviceName,
  }
}
