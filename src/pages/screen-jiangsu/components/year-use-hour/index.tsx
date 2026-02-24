import JsCommonBox from "../common-box"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useHourScreen from "@/hooks/use-usehour-screen"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"

export default function YearUseHour() {
  const [chartData, setChartData] = useState(null)

  const [selectVal, setSelectVal] = useState("STATION_CODE")
  const { series, xAxis } = useHourScreen({ stnType: selectVal })
  useEffect(() => {
    setChartData({
      unit: "h",
      series: [
        {
          barWidth: 40,
          ...echartsLineColor.yearUseRate,
          data: series,
        },
      ],
      xAxis,
      screenWidth: 6400 || window.innerWidth,
      showLegend: false,
    })
  }, [series, xAxis])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <JsCommonBox title="年利用小时数">
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </JsCommonBox>
  )
}
