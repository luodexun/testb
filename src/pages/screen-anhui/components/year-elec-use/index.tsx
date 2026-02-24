/*
 * @Author: chenmeifeng
 * @Date: 2024-07-04 11:08:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 14:11:40
 * @Description:
 */
import { LineOrBarOption } from "../../configs/line-bar-options"
import { echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import CommonCtBox from "../common-box"
import { getElecData } from "../../methods"
import useInterval from "@/hooks/useInterval"

export default function YearElecUse() {
  const [chartData, setChartData] = useState(null)
  const [reload, setReload] = useInterval(60 * 60 * 1000)
  const initData = async () => {
    const res = await getElecData("STATION_CODE", "yearlyProduction")
    setReload(false)
    if (!res) return
    const { series, allData, xAxis } = res
    setChartData({
      unit: "万kWh",
      series: [
        {
          ...echartsLineColor.dayElec,
          name: "总年发电量",
          data: series?.map((i) => i / 10000) || [],
        },
        {
          ...echartsLineColor.yearUseRate,
          name: "可利用小时数",
          yAxisIndex: 1,
          data: allData?.map((i) => i["yearlyUtilizationHour"]) || [],
        },
      ],
      xAxis: xAxis,
      yAxisTwoUnit: "h",
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
    <CommonCtBox title="年电量利用数据">
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </CommonCtBox>
  )
}
