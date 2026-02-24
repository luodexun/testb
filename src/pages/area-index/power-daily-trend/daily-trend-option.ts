/*
 * @Author: xiongman
 * @Date: 2023-08-28 17:47:38
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-28 17:47:38
 * @Description: 区域中心-指标总览-日电量趋势图表配置数据
 */

import {
  baseAxisLabel,
  baseGrid,
  baseTooltip,
  baseXAxis,
  baseYAxis,
  chartLinearColor,
} from "@configs/chart-fragments.ts"
import { UNIT } from "@configs/text-constant.ts"
import { dayM2D, dayY2D } from "@configs/time-constant.ts"
import { compareEvo, evoluateNum, uDate } from "@utils/util-funs.tsx"

import { IBaseChartOption } from "@/types/i-page.ts"

export interface IDailyTrendChartData extends IBaseChartOption {}

export function dailyTrendOption(params: IDailyTrendChartData) {
  const { xAxis, data } = params || { xAxis: [], data: [] }

  let evoInfo: ReturnType<typeof compareEvo>
  data.find((p) => (evoInfo = compareEvo(p)).largeUnit)
  const { largeUnit, largeEvo } = evoInfo || { largeUnit: "", largeEvo: 1 }
  const unit = `${UNIT[largeUnit] || ""}${UNIT.ELEC}`

  const seriesData = data.map((dailyPdu) => evoluateNum(dailyPdu, largeEvo))

  return {
    grid: baseGrid,
    tooltip: baseTooltip,
    xAxis: {
      data: xAxis,
      ...baseXAxis,
      axisLabel: {
        ...baseAxisLabel,
        formatter: function (xLabel: string) {
          return uDate(xLabel, dayM2D, dayY2D)
        },
      },
    },
    yAxis: { name: `电量(${unit})`, ...baseYAxis },
    series: [
      {
        type: "bar",
        data: seriesData,
        barWidth: 12,
        itemStyle: {
          color: chartLinearColor(["#3af6fa", "#3AF6FA03"]),
        },
        tooltip: {
          valueFormatter: function (value: number) {
            return `日发电量：${value} ${unit}`
          },
        },
      },
    ],
  }
}
