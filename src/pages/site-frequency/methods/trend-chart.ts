/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-24 16:03:58
 * @Description:
 */
import { judgeNull, parseNum, uDate, validResErr } from "@utils/util-funs.tsx"

import { IAgvcInfo } from "@/types/i-agvc.ts"
import { AGCChartSeries } from "../configs"
import { doBaseServer } from "@/api/serve-funs"
import { dayH2S } from "@/configs/time-constant"
import { IDeviceTrendSchParams, TAnlyTrendServe4Chart } from "../types"
import { EChartsOption } from "echarts"

export const tranformSeries = (data: IAgvcInfo[]) => {
  const result = { series: [], legend: [] }
  const seriesCfg = AGCChartSeries
  let name: string
  return seriesCfg.reduce((prev, { field, title, unit, caculate }) => {
    name = `${title}(${unit})`
    prev.series.push({
      name,
      type: "line",
      smooth: true,
      data: data?.map((item) => judgeNull(item[field], caculate, 2)) || [],
    })
    prev.legend.push(name)
    return prev
  }, result)
}
export async function SiteFrequencySch(formData) {
  const { deviceCode, date } = formData
  if (!date) return null
  const startTime = date.startOf("d").valueOf()
  const endTime = date.endOf("d").valueOf()
  const dvsPoints = AGCChartSeries?.map((i) => `${deviceCode}-${i.field}`)?.join(",")
  const params = { devicePoint: dvsPoints, startTime, endTime, timeInterval: "1m", func: "LAST" }
  const resData = await doBaseServer<IDeviceTrendSchParams, TAnlyTrendServe4Chart>("getTrendDataV2", params)
  if (validResErr(resData)) return null
  return dealSiteAgvc2ChartData(resData, deviceCode)
}

function dealSiteAgvc2ChartData(data: TAnlyTrendServe4Chart, deviceCode) {
  const currentInfo = data?.[deviceCode] || {}
  const series: EChartsOption["series"] = AGCChartSeries.map((i) => {
    return {
      type: "line",
      name: i.title || "",
      smooth: true,
      data: currentInfo?.[i.field]?.map((item, idx) => [currentInfo?.["Time"]?.[idx], item]) || [],
      yAxisIndex: i.yAxisIndex,
    }
  })
  const yAxisProps: EChartsOption["yAxis"] = [
    {
      type: "value",
      name: "功率",
      position: "left",
      axisLabel: {
        color: "#ffffff",
      },
      nameTextStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
      nameGap: 10,
      splitLine: {
        show: false,
      },
    },
    {
      type: "value",
      name: "频率",
      position: "right",
      axisLabel: {
        color: "#ffffff",
      },
      nameTextStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
      nameGap: 10,
      splitLine: {
        show: false,
      },
    },
  ]
  return { yAxisProps, series: series }
}
