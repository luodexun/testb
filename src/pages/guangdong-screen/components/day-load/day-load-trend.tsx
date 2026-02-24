/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 10:53:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-18 14:03:03
 * @Description: 广东大屏-日负荷趋势
 */
import "./day-load-trend.less"

import { useEffect, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import useChartRender from "@/hooks/use-chart-render"
import useDayloadScreen from "@/hooks/use-dayload-screen"

import { echartsLineColor, TREND_OPTION } from "../../configs"
import { lineOrBarOption } from "../../configs/day-load-trend"
import ComRadioClk from "../common-radio"
import HBCommonTitle from "../common-title"
export default function GDDayLoadTrend() {
  const [chartData, setChartData] = useState(null)
  const [currentIdx, setCurrentIdx] = useState("1")
  const reload = useRef(5 * 60 * 1000) // 五分钟
  const [chooseStn, setChooseStn] = useState("ALL")
  const { series, xAxis } = useDayloadScreen({ stnCode: chooseStn, reload: reload.current })

  const setSite = useRef((e) => {
    setChooseStn(e ?? "ALL")
  })
  useEffect(() => {
    setChartData({
      series,
      xAxis,
      screenWidth: window.innerWidth,
    })
  }, [series, xAxis])
  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)
  return (
    <div className="screen-box day-load">
      <HBCommonTitle title="日负荷趋势" />
      <div className="screen-box-content">
        <div className="day-chart">
          <div className="station-select">
            <StationTreeSelect
              size="small"
              popupClassName="nhb-screen-select"
              onChange={setSite.current}
              style={{ width: "100%", zIndex: 2, fontSize: "16px" }}
            />
          </div>
          <ChartRender ref={chartRef} empty option={chartOptions} />
        </div>
      </div>
    </div>
  )
}
