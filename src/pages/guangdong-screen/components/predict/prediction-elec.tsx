/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 15:40:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-13 15:48:00
 * @Description: 广东大屏-预测电量
 */
import "./prediction-elec.less"

import { Select } from "antd"
import { useEffect, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import useChartRender from "@/hooks/use-chart-render"
import { getStnPduTrendData, stnPduTrendData2ChartData } from "@/pages/area-index/power-daily-trend/methods"
import { IStnPduTrendDataAfterDeal } from "@/pages/area-index/power-daily-trend/types"

import { echartsLineColor, SELECTOPTION } from "../../configs"
import { lineOrBarOption } from "../../configs/day-load-trend"
import HBCommonTitle from "../common-title"

export default function GDPrediction() {
  const [chartData, setChartData] = useState(null)
  const [selectVal, setSelectVal] = useState("MAINTENANCE_COM_ID")
  const [allSource, setAllSource] = useState<IStnPduTrendDataAfterDeal>()
  const [chooseStn, setChooseStn] = useState("")
  const reload = useRef(60 * 60 * 1000) // 一小时
  const timer = useRef(null)
  const initData = async () => {
    const allSource = await getStnPduTrendData()
    setAllSource(allSource)
  }
  const initChartData = async () => {
    const result = stnPduTrendData2ChartData(allSource, chooseStn)
    setChartData({
      unit: "万kWh",
      series: [
        {
          name: "发电量趋势",
          type: "line",
          ...echartsLineColor.huang,
          showSymbol: false,
          data: result?.data.map((i) => i / 10000), // 返回的是kWh，展示万kWh
        },
      ],
      xAxis: result?.xAxis,
      screenWidth: window.innerWidth,
      showLegend: false,
      yUnit: "万kWh",
    })
  }
  const chooseType = (e) => {
    setSelectVal(e)
  }
  const setSite = useRef((e) => {
    clearInterval(timer.current)
    setChooseStn(e)
  })
  useEffect(() => {
    if (allSource) {
      initChartData()
    }
  }, [allSource, chooseStn])
  useEffect(() => {
    initData()
    timer.current = setInterval(() => {
      initData()
    }, reload.current)
    return () => clearInterval(timer.current)
  }, [])
  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)
  return (
    <div className="screen-box gd-prediction">
      <HBCommonTitle title="日发电量" />
      <div className="prediction-chart">
        <div className="station-select">
          <StationTreeSelect
            size="small"
            onChange={setSite.current}
            style={{ width: "100%", zIndex: 2, fontSize: "12px" }}
            popupClassName="nhb-screen-select"
          />
          {/* <Select
            options={SELECTOPTION}
            value={selectVal}
            style={{ width: "100%", zIndex: 2 }}
            onChange={(e) => chooseType(e)}
          ></Select> */}
        </div>
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
