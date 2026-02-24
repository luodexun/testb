/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 14:15:38
 * @Description:
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"
import { dayH2Mi } from "@configs/time-constant.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { evoluateNum, judgeNull, numberVal, uDate, validResErr } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"

import { doBaseServer, doRecordServer } from "@/api/serve-funs.ts"
import { IPageInfo } from "@/types/i-table.ts"

import { TREND_PARAM_CM } from "../configs"
import { ISchParams } from "../types"
import { IControlLogSchForm, IRpPowerData, IRpPowerSchForm, IRpPowerSchParams, IRunTrendChartData } from "../types"

let num = 0

// 处理查询及导出参数
function dealParams(formData: IRpPowerSchForm): IRpPowerSchParams {
  const { dateRange, stationCode, preQrts, deviceType } = formData
  let key = ""
  key = deviceType === "DQ" ? "preDays" : "preQrts"
  return {
    stationCode,
    [key]: preQrts,
    ...getStartAndEndTime<number>(dateRange, "", { startTime: 1, endTime: 100000000000000 }),
  }
}

// 执行数据查询
export async function getReportPowerSchData(pageInfo: IPageInfo, formData: IRpPowerSchForm) {
  const params = dealParams(formData)
  if (num) {
    params.pageNum = pageInfo.current
    params.pageSize = pageInfo.pageSize
  }

  if (!params.stationCode) return { records: [], total: 0 }
  const resData = await doRecordServer<ISchParams, IRpPowerData>("getReportGLYCData", params)
  if (validResErr(resData) && num) return { records: [], total: 0 }
  if (!Array.isArray(resData) && !num) return { records: [], total: 0 }
  let records: IRpPowerData[] = []

  if (num) {
    const { list } = resData
    records =
      list?.map((i) => {
        return {
          ...i,
          id: i.stationCode + "_" + i.forecastTime,
          // agvcPower: i.agvcPower * 1000, // 接口返回的是MW，要变成kW,方便后面统一处理
          // syzzzPower: i.syzzzPower * 1000, // 接口返回的是MW，要变成kW,方便后面统一处理
        }
      }) || []
  } else {
    // const actResData = resData as IRpPowerData[]
    const actRes = (resData as IRpPowerData[]).map((i) => {
      return {
        ...i,
        // agvcPower: i.agvcPower * 1000, // 接口返回的是MW，要变成kW,方便后面统一处理
        // syzzzPower: i.syzzzPower * 1000, // 接口返回的是MW，要变成kW,方便后面统一处理
      }
    })
    const data = [dealTrendData2Chart(actRes as IRpPowerData[], formData)]
    records = data
  }
  return { records, total: resData?.total || 0 }
}

// 执行数据导出
export function doExportReportPower(pageInfo: IPageInfo, formData: IControlLogSchForm) {
  const params = dealParams(formData)
  if (!params.stationCode) return
  doBaseServer<typeof params, AxiosResponse>("exportGLYCata", params).then((data) => {
    dealDownload4Response(data, "功率预测报表导出表.csv")
  })
}

export function getSelectNum(index: number) {
  num = index
}

//获取图表转化后的数据
export function dealTrendData2Chart(trendData: IRpPowerData[], formData: IControlLogSchForm): IRunTrendChartData {
  let chartInfos = TREND_PARAM_CM

  const deviceType = formData?.deviceType
  chartInfos =
    deviceType === "DQ"
      ? [...TREND_PARAM_CM, { title: "短期功率", field: "shortPredPower", unit: UNIT.POWER, caculate: 1000 }]
      : [...TREND_PARAM_CM, { title: "超短期功率", field: "ultraShortPredPower", unit: UNIT.POWER, caculate: 1000 }]
  const result: IRunTrendChartData = { xAxis: [], data: null, legend: chartInfos.map((i) => i.title + i.unit) }
  // console.log(result)
  if (!chartInfos?.length || !trendData?.length) return result

  const { xAxis, dataMap } = trendData2DataMap(trendData, chartInfos)
  const cData = chartInfos.map(({ title, field, unit, color }) => ({ title, unit, color, data: dataMap[field] || [] }))
  // console.log({ xAxis, data: cData })

  return { xAxis, data: cData, legend: chartInfos.map((i) => i.title) }
}

function trendData2DataMap(trendData: IRpPowerData[], CM: IDvsRunStateInfo<keyof IRpPowerData, string>[]) {
  const newdata = CM.reduce((pre, cur) => {
    pre[cur.title] = cur.field
    return pre
  }, {})
  return trendData.reduce(
    (prev, { stationCode, forecastTime, ...others }) => {
      // prev.xAxis.push(uDate(forecastTime, dayH2Mi))
      prev.xAxis.push(forecastTime)
      for (const key in newdata) {
        if (Object.hasOwnProperty.call(newdata, key)) {
          if (!prev.dataMap[newdata[key]]) prev.dataMap[newdata[key]] = []
          const caculate = CM.find((i) => i.field === newdata[key])?.caculate || 1
          prev.dataMap[newdata[key]].push(judgeNull(others[newdata[key]], caculate, 2, null))
        }
      }
      return prev
    },
    { xAxis: [], dataMap: {} },
  )
}
