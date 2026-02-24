/*
 * @Author: chenmeifeng
 * @Date: 2024-07-08 17:53:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-15 16:47:08
 * @Description:
 */
import StationTreeSelect from "@/components/station-tree-select"
import JsCommonBox from "../common-box"
import { useEffect, useRef, useState } from "react"
import { IStnPduTrendDataAfterDeal } from "@/pages/area-index/power-daily-trend/types"
import ChartRender from "@/components/chart-render"
import { getPowerFutureInfo } from "@/utils/screen-funs"
import { parseNum } from "@/utils/util-funs"
import { echartsLineColor } from "../../configs"
import { LineOrBarOption } from "../../configs/line-bar-options"
import useChartRender from "@/hooks/use-chart-render"

export default function PredictElec() {
  const [chartData, setChartData] = useState(null)
  const [allSource, setAllSource] = useState<IStnPduTrendDataAfterDeal>()
  const [chooseStn, setChooseStn] = useState("")
  const reload = useRef(10 * 60 * 1000) // 10m
  const timer = useRef(null)
  const setSite = (e) => {
    clearInterval(timer.current)
    // setChooseStn(e)
  }
  const initChartData = async () => {
    const params = {
      preDay: "7",
    }
    const result = await getPowerFutureInfo(params)
    const xData = result?.ALL?.map((i) => i.forecastTime) || []
    const yData = result?.ALL?.map((i) => parseNum(i.shortPredProduction / 10000), 3) || [] // 返回的是kWh，展示万kWh

    setChartData({
      unit: "万kWh",
      series: [
        {
          name: "预测电量",
          type: "line",
          ...echartsLineColor.pridict,
          showSymbol: false,
          data: yData,
        },
      ],
      xAxis: xData,
      screenWidth: 1920 || window.innerWidth,
      showLegend: false,
    })
  }
  useEffect(() => {
    initChartData()
    timer.current = setInterval(() => {
      initChartData()
    }, reload.current)
    return () => clearInterval(timer.current)
  }, [])

  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <JsCommonBox title="公司未来五天预测电量" direction="right">
      {/* <div className="station-select">
        <StationTreeSelect
          size="small"
          onChange={setSite}
          style={{ width: "100%", zIndex: 2, fontSize: "16px" }}
          popupClassName="nhb-screen-select"
        />
      </div> */}
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </JsCommonBox>
  )
}
