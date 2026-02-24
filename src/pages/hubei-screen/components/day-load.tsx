/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-11 10:14:46
 * @Description: 日负荷模块
 */
import "./day-load.less"

import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import { dayH2Mi } from "@/configs/time-constant"
import useChartRender from "@/hooks/use-chart-render"
import { getPowerInfo } from "@/pages/hb-new-screen/methods"
import { getStartAndEndTime } from "@/utils/form-funs"
import { parseNum, uDate } from "@/utils/util-funs"

import { echartsLineColor } from "../configs"
import { lineOption } from "../configs/day-rate-option"
import ComRadioClk from "./common-radio"
import HBCommonTitle from "./common-title"
const optionsType = [
  { name: "风", value: "1" },
  { name: "光", value: "2" },
]
export default function DayLoad() {
  const [chartData, setChartData] = useState(null)
  const [currentIdx, setCurrentIdx] = useState("1")
  const shortPredPowerLs = useRef([])
  const ultraShortPredPowerLs = useRef([])
  const agvcPowerLs = useRef([])
  const timeList = useRef([])
  const isFirst = useRef(true)
  const timer = useRef(null)
  const reload = useRef(5 * 60 * 1000) // 五分钟
  const winWidth = useRef(4480)
  const [chooseStn, setChooseStn] = useState("ALL")
  const initChartData = async () => {
    const startOfDay = dayjs().startOf("day")
    const endOfDay = startOfDay
    const { startTime, endTime } = getStartAndEndTime<number>([startOfDay, endOfDay], "", { startTime: 1, endTime: 1 })
    const result = await getPowerInfo({ startTime, endTime, stationCode: chooseStn })
    isFirst.current = true
    if (!result) return
    const actualRes = result

    timeList.current = actualRes?.map((i) => uDate(new Date(i.forecastTime).valueOf(), dayH2Mi))
    shortPredPowerLs.current = actualRes?.map((i) => parseNum(i.shortPredPower / 10000), 3) || []
    ultraShortPredPowerLs.current = actualRes?.map((i) => parseNum(i.ultraShortPredPower / 10000), 3) || []
    agvcPowerLs.current = actualRes?.map((i) => parseNum(i.agvcPower / 10), 3) || []
    const series = [
      {
        name: "短期预测功率",
        type: "line",
        ...echartsLineColor.huang,
        showSymbol: false,
        smooth: true,
        data: shortPredPowerLs.current,
        yAxisIndex: 0,
      },
      {
        name: "超短期预测功率",
        type: "line",
        ...echartsLineColor.green,
        showSymbol: false,
        smooth: true,
        data: ultraShortPredPowerLs.current,
        yAxisIndex: 0,
      },
      {
        name: "全场实际功率",
        type: "line",
        ...echartsLineColor.purple,
        showSymbol: false,
        smooth: true,
        data: agvcPowerLs.current,
        yAxisIndex: 0,
      },
      // {
      //   name: "预测功率",
      //   type: "line",
      //   ...echartsLineColor.red,
      //   showSymbol: false,
      //   smooth: true,
      //   data: [9, 5, 3, 4, 7, 3],
      //   yAxisIndex: 1,
      // },
    ]
    setChartData({
      series: series,
      xAxis: timeList.current,
      screenWidth: winWidth.current || window.innerWidth,
      axisLabel: {
        interval: 6,
      },
    })
  }
  const setSite = (e) => {
    clearInterval(timer.current)
    setChooseStn(e ?? "ALL")
  }
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      initChartData()
      setTimeout(() => {
        timer.current = setInterval(() => {
          initChartData()
        }, reload.current)
      }, 300)
    }
    return () => clearInterval(timer.current)
  }, [chooseStn])
  const { chartRef, chartOptions } = useChartRender(chartData, lineOption)
  return (
    <div className="screen-box day-load">
      {/* children={<ComRadioClk options={optionsType} onChange={setCurrentIdx} />} */}
      <HBCommonTitle title="日负荷趋势" />
      <div className="day-chart">
        <div className="station-select">
          <StationTreeSelect
            size="small"
            popupClassName="hb2-screen-select"
            onChange={setSite}
            style={{ width: "100%", zIndex: 2, fontSize: (10 * winWidth.current) / 4480 + "px", height: "90%" }}
          />
        </div>
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
