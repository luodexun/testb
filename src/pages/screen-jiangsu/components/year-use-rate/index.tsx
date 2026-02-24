import useChartRender from "@/hooks/use-chart-render"
import JsCommonBox from "../common-box"
import { useEffect, useState } from "react"
import { LineOrBarOption } from "../../configs/line-bar-options"
import ChartRender from "@/components/chart-render"
import { echartsLineColor } from "../../configs"
import useHourScreen from "@/hooks/use-usehour-screen"

export default function YearUseRate() {
  const [chartData, setChartData] = useState(null)

  const [selectVal, setSelectVal] = useState("STATION_CODE")
  const { series, xAxis } = useHourScreen({ stnType: selectVal, valkey: "yearlyProduction" })
  useEffect(() => {
    setChartData({
      unit: "万kWh",
      series: [
        {
          barWidth: 40,
          ...echartsLineColor.yearUseRate,
          data: series?.map((i) => i / 10000),
          name: "总年发电量",
        },
      ],
      xAxis,
      screenWidth: 6400 || window.innerWidth,
      showLegend: false,
    })
  }, [series, xAxis])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <JsCommonBox title="年电量可利用率">
      {/* <div>dskf</div> */}
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </JsCommonBox>
  )
}
