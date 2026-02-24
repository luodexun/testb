/*
 *@Author: chenmeifeng
 *@Date: 2024-03-29 17:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-03 10:53:00
 *@Description:
 */

import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { AxiosResponse } from "axios"
import dayjs from "dayjs"
import { MutableRefObject } from "react"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IDeviceData, IQueryDeviceDataParams } from "@/types/i-device.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { validResErr } from "@/utils/util-funs"

import runTrendOption from "../components/trend-option"
import { IRpAlarmAnalyseSchForm, IRpAlarmAnalyseSchParams } from "../types"
import { IBatchStn2DvsTreeData } from "../types"

function dealParams(formData: IRpAlarmAnalyseSchForm): IRpAlarmAnalyseSchParams {
  const { dateRange, deviceIdList } = formData
  return { deviceIdList, ...getStartAndEndTime(dateRange, null) }
}

export async function getAlarmAnalyseSchData(pageInfo: IPageInfo, formData: IRpAlarmAnalyseSchForm) {
  const params = dealParams(formData)
  if (params?.deviceIdList.length == 0) {
    return { records: [], total: 0 }
  }
  const res = await doBaseServer<IRpAlarmAnalyseSchForm>("queryAnalyze", params)
  if (validResErr(res)) return null
  const actualData = res?.map((i, idx) => {
    return {
      ...i,
      id: i.Time + i.backActivePower + i.forwardActivePower + idx,
    }
  })
  return { records: actualData || [], total: res?.total }
}

export function alarmAnalyseExport(formData: IRpAlarmAnalyseSchForm) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportAnalyze", params).then((data) => {
    dealDownload4Response(data, "告警分析表.xlsx")
  })
}

export let DEFAULT_DEVICE_DATA: IDeviceData[] = []
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
      const { stationId, stationName, deviceId, deviceName, deviceCode, model } = item

      let station = stationMap.get(stationId)
      if (!station) {
        station = {
          stationId,
          stationName,
          key: stationName + "_" + stationId,
          title: stationName,
          model: model,
          disabled: false,
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
          level: 2,
          isLeaf: false,
          children: [],
        }
        station.children.push(line)
      }
      const device = {
        deviceId,
        deviceName,
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
    // if (node.level > 2) {
    //   if (selectData.includes(node.key)) {
    //     node.disabled = false
    //   } else {
    //     node.disabled = selectData?.length === 3
    //   }
    // }
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
  const result: { keys: number[]; dvsList: IBatchStn2DvsTreeData[] } = { keys: [], dvsList: [] }
  checkedNodes.forEach((item, index) => {
    if (isMultiStn && item.stationCode === prevCheckedStnRef.current) return
    result.keys.push(item.key as number)
    if (item.isLeaf) result.dvsList.push(item)
    if (index === lastLength) prevCheckedStnRef.current = item.stationCode
  }, result)
  return result
}

export function dataConvertEchartOptions(dataSource, selectIndex, seriesDataDeviceID) {
  const tmpDataOne = dataSource.filter(
    (item) => item.parentClass == "告警规则" && item.deviceId == seriesDataDeviceID.current[selectIndex.current],
  )
  const tmpDataOne1 = tmpDataOne.map((itep) => `${itep.childClass ? itep.childClass : "--"}`)
  const tmpDataOne2 = tmpDataOne.map((itep) => itep.alarmCount)

  const tmpDataTwo = dataSource.filter(
    (item) => item.parentClass == "故障等级" && item.deviceId == seriesDataDeviceID.current[selectIndex.current],
  )
  const tmpDataTwo1 = tmpDataTwo.map((itep) => `${itep.childClass ? itep.childClass : "--"}`)
  const tmpDataTwo2 = tmpDataTwo.map((itep) => itep.alarmCount)

  const tmpDataThree = dataSource.filter(
    (item) => item.parentClass == "归属系统" && item.deviceId == seriesDataDeviceID.current[selectIndex.current],
  )
  const tmpDataThree1 = tmpDataThree.map((itep) => `${itep.childClass ? itep.childClass : "--"}`)
  const tmpDataThree2 = tmpDataThree.map((itep) => itep.alarmCount)

  const chartOptionsOne = runTrendOption({
    xAixsData: tmpDataOne1,
    seriesData: tmpDataOne2,
    title: "告警条数",
    echartsSourceData: tmpDataOne,
  })
  const chartOptionsTwo = runTrendOption({
    xAixsData: tmpDataTwo1,
    seriesData: tmpDataTwo2,
    echartsSourceData: tmpDataTwo,
  })
  const chartOptionsThree = runTrendOption({
    xAixsData: tmpDataThree1,
    seriesData: tmpDataThree2,
    echartsSourceData: tmpDataThree,
  })
  return { chartOptionsOne, chartOptionsTwo, chartOptionsThree }
}

export function dealTime(v) {
  return v ? dayjs(v).format("YYYY-MM-DD HH:mm:ss") : ""
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
