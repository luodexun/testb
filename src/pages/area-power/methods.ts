/*
 * @Author: xiongman
 * @Date: 2023-10-25 16:59:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-30 13:58:51
 * @Description:
 */
import { AREA_POWER_ELEMENT } from "@configs/option-const.tsx"
import { dayH2Mi } from "@configs/time-constant.ts"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { evoluateNum, numberVal, uDate, validResErr } from "@utils/util-funs.tsx"
import dayjs from "dayjs"

import { doRecordServer } from "@/api/serve-funs.ts"
import { IStationData } from "@/types/i-station"

import { IAreaPowerList, IRpPowerData, ISchParams, IStationChartData } from "./types.ts"
let timeFlag = 0
export function calcChartSize(boxDom: HTMLDivElement) {
  if (!boxDom) return
  if (timeFlag) window.clearTimeout(timeFlag)
  timeFlag = window.setTimeout(() => {
    const { width } = window.getComputedStyle(boxDom)
    boxDom.style.setProperty("--chart-width", width)
  }, 500)
}

//获取接口数据
export async function getAllStationData(stationList: IStationData[], maxConcurrentRequests = 2) {
  const fetchData = async ({ stationCode, shortName }) => {
    const startOfDay = dayjs().startOf("day")
    const endOfDay = startOfDay
    const { startTime, endTime } = getStartAndEndTime<number>([startOfDay, endOfDay], "", { startTime: 1, endTime: 1 })
    const params = {
      stationCode,
      deviceType: "DQ,CDQ",
      startTime,
      endTime,
    }

    const resData = await doRecordServer<ISchParams, IRpPowerData>("getGLYCData", params)
    if (validResErr(resData) || !Array.isArray(resData)) return { stationCode, stationName: shortName, data: {} }
    const newData = getchartData(resData)
    return { stationCode, stationName: shortName, data: newData }
  }
  const results = []

  for (let i = 0; i < stationList?.length; i++) {
    const currentEndpoint = stationList?.[i]

    try {
      const response = await fetchData(currentEndpoint)
      results.push(response)
    } catch (error) {
      console.error(`Error fetching data from ${currentEndpoint}:`, error)
    }

    if ((i + 1) % maxConcurrentRequests === 0) {
      // 等待前面的请求完成后再继续下一批请求
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return results
}
export async function getAllStationLineData(screenUrl: string) {
  const startOfDay = dayjs().startOf("day")
  const endOfDay = startOfDay
  const { startTime, endTime } = getStartAndEndTime<number>([startOfDay as any, endOfDay as any], "", {
    startTime: 1,
    endTime: 1,
  })
  const params = {
    startTime,
    endTime,
    preDays: 1,
    preQrts: screenUrl === "nxscreen" ? 8 : 16,
  }
  const resData = await doRecordServer<ISchParams, IRpPowerData>("getReportGLYCData", params)
  if (validResErr(resData)) return null
  // const resData = {
  //   "410526W01": [
  //     {
  //       stationCode: "410526W01",
  //       stationName: null,
  //       reportTime: null,
  //       forecastTime: 1716825600000,
  //       shortPredPower: null,
  //       ultraShortPredPower: null,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: 0,
  //     },
  //   ],
  //   "410527W01": [
  //     {
  //       stationCode: "410527W01",
  //       stationName: "连州风光储电场",
  //       reportTime: null,
  //       forecastTime: "2024-04-20 10:20:40",
  //       shortPredPower: 23,
  //       ultraShortPredPower: 112000,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: 28.5,
  //     },
  //     {
  //       stationCode: "410527W01",
  //       stationName: "连州风光储电场",
  //       reportTime: null,
  //       forecastTime: "2024-04-20 10:35:40",
  //       shortPredPower: 26,
  //       ultraShortPredPower: 102155,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: null,
  //     },
  //   ],
  // }

  const result = {}
  Object.keys(resData)?.forEach((key) => {
    const prev = resData[key]?.map((i) => {
      return {
        ...i,
        agvcPower: i.agvcPower !== null ? i.agvcPower * 1000 : null, // 接口返回的是MW
        syzzzPower: i.syzzzPower !== null ? i.syzzzPower * 1000 : null, // 接口返回的是MW
      }
    })
    result[key] = getchartData(prev)
  })
  return result
}

//将数据转化成所需的格式
export function getchartData(data: IRpPowerData[]) {
  return data.reduce(
    (prev, { stationCode, forecastTime, ...others }) => {
      prev.xAxis.push(uDate(new Date(forecastTime).valueOf(), dayH2Mi))
      for (let i = 0; i < AREA_POWER_ELEMENT.length; i++) {
        const { value, style, label } = AREA_POWER_ELEMENT[i]
        if (!prev.data[value])
          prev.data[value] = {
            color: style.color,
            title: label,
            data: [],
          }
        prev.data[value].data.push(evoluateNum(numberVal(others[value]), 10000) ?? null)
      }
      return prev
    },
    { xAxis: [], data: {} },
  )
}

//根据勾选的变量显示对应的曲线
export function getStationDataMap(stationData: IStationChartData[], selectData: string[]) {
  return stationData.map((item) => {
    const newData = {}
    selectData.forEach((propertyName) => {
      newData[propertyName] = item.data.data?.[propertyName] || {}
    })

    return {
      stationCode: item.stationCode,
      stationName: item.stationName,
      data: {
        xAxis: item.data?.xAxis || [],
        data: newData,
      },
    }
  })
}
//根据勾选的变量显示对应的曲线
export function getStationLineDataMap(stationData: IAreaPowerList, selectData: string[]) {
  const result = {}
  if (!stationData) return null
  Object.keys(stationData)?.forEach((key) => {
    const newData = {}
    selectData.forEach((propertyName) => {
      newData[propertyName] = stationData[key].data?.[propertyName] || {}
    })
    result[key] = {
      data: newData,
      xAxis: stationData[key]?.xAxis,
    }
  })
  console.log(result, "result")

  return result
}
