/*
 * @Author: chenmeifeng
 * @Date: 2024-07-08 17:53:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-25 15:07:06
 * @Description:
 */
import { useEffect, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import useChartRender from "@/hooks/use-chart-render"
import { IStnPduTrendDataAfterDeal } from "@/pages/area-index/power-daily-trend/types"

import { areaPowerOption, getAllStationLineData } from "../../methods"
import LNCommonBox from "../common-box"

export default function PredictElec() {
  const [chartData, setChartData] = useState(null)
  const [allSource, setAllSource] = useState<IStnPduTrendDataAfterDeal>()
  const [chooseStn, setChooseStn] = useState("")
  const [allStationLineData, setAllStationLineData] = useState(null)
  const reload = useRef(5 * 60 * 1000) // 5m
  const timer = useRef(null)
  const setSite = (e) => {
    clearInterval(timer.current)
    setChooseStn(e)
  }

  const initChartData = async () => {
    const res = await getAllStationLineData()
    setAllStationLineData(res)
  }
  useEffect(() => {
    initChartData()
    timer.current = setInterval(() => {
      initChartData()
    }, reload.current)
    return () => clearInterval(timer.current)
  }, [])

  useEffect(() => {
    if (!chooseStn) {
      setChartData(allStationLineData?.["ALL"])
    } else {
      setChartData(allStationLineData?.[chooseStn])
    }
  }, [chooseStn, allStationLineData])

  const { chartRef, chartOptions } = useChartRender(chartData, areaPowerOption)
  return (
    <LNCommonBox
      title="未来七天预测功率"
      titleBox={
        <StationTreeSelect
          size="small"
          onChange={setSite}
          style={{ zIndex: 2, fontSize: "10px" }}
          popupClassName="ln-screen-select"
          className="use-slt"
          placeholder="全部"
        />
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </LNCommonBox>
  )
}
