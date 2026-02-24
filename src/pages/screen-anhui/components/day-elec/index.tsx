/*
 * @Author: chenmeifeng
 * @Date: 2024-07-04 11:08:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 14:19:16
 * @Description:
 */
import { LineOrBarOption } from "../../configs/line-bar-options"
import { echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import CommonCtBox from "../common-box"
import useInterval from "@/hooks/useInterval"
import { getElecData } from "../../methods"

export default function DayElec() {
  const [chartData, setChartData] = useState(null)
  const [reload, setReload] = useInterval(10 * 60 * 1000)
  const initData = async () => {
    const res = await getElecData("STATION_CODE", "dailyProduction")
    setReload(false)
    if (!res) return
    const { series, xAxis } = res
    setChartData({
      unit: "万kWh",
      series: [
        {
          ...echartsLineColor.dayElec,
          data: series?.map((i) => i / 10000) || [],
        },
      ],
      xAxis,
      screenWidth: 1920 || window.innerWidth,
      showLegend: false,
      axisLabel: {
        interval: 0,
      },
    })
  }
  useEffect(() => {
    if (!reload) return
    initData()
  }, [reload])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <CommonCtBox title="日实时发电量">
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </CommonCtBox>
  )
}
