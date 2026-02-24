/*
 * @Author: chenmeifeng
 * @Date: 2024-06-27 15:19:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-03 10:57:09
 * @Description:
 */
import JsCommonBox from "../common-box"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useHourScreen from "@/hooks/use-usehour-screen"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"

export default function DayElecRight() {
  const [chartData, setChartData] = useState(null)

  const { series, xAxis } = useHourScreen({
    stnType: "STATION_CODE",
    valkey: "dailyProduction",
    reloadTime: 10 * 60 * 1000,
  })
  useEffect(() => {
    setChartData({
      unit: "万kWh",
      series: [
        {
          barWidth: 40,
          ...echartsLineColor.realtimeElec,
          data: series?.map((i) => i / 10000) || [],
        },
      ],
      xAxis,
      screenWidth: 6400 || window.innerWidth,
      showLegend: false,
    })
  }, [series, xAxis])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return <ChartRender ref={chartRef} empty option={chartOptions} />
}
