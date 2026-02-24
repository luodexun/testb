/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 11:11:20
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-29 11:10:06
 * @Description: 预测电量
 */
import "./prediction-ele.less"
import "./prediction-ele.less"

import { useEffect, useState } from "react"

import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import useChartRender from "@/hooks/use-chart-render"

import { preLineOption } from "../configs/prediction-options"
import HBCommonTitle from "./common-title"

export default function Prediction() {
  const [chartData, setChartData] = useState(null)
  const [currentIdx, setCurrentIdx] = useState("1")
  const initChartData = () => {
    setChartData({
      series: [1, 2, 3, 4, 6, 3],
      xAxis: ["sjdh", 2, 3, 4, 6, 3],
      screenWidth: window.innerWidth,
    })
  }
  useEffect(() => {
    initChartData()
  }, [])
  const { chartRef, chartOptions } = useChartRender(chartData, preLineOption)
  return (
    <div className="screen-box prediction">
      <HBCommonTitle
        title="预测电量"
        children={
          <StationTreeSelect
            style={{ width: "100%", fontSize: (10 * window.innerWidth) / 4480 + "px", height: "4.2em" }}
          />
        }
      />
      <div className="prediction-chart">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
