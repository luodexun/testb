/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-15 10:54:31
 * @Description: 日负荷模块
 */

import { useEffect, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import useDayloadScreen from "@/hooks/use-dayload-screen"

import { echartsLineColor } from "../../configs"
import HnCommonBox from "../common-box"
import { LineOrBarOption } from "../../configs/line-bar-options"
import StationTreeSelect from "@/components/station-tree-select"
import { parseNum } from "@/utils/util-funs"
const optionsType = [
  { name: "风", value: "1" },
  { name: "光", value: "2" },
]
export default function HnDayLoad() {
  const [chartData, setChartData] = useState(null)
  // const [currentIdx, setCurrentIdx] = useState("1")
  const reload = useRef(5 * 60 * 1000) // 五分钟
  const [chooseStn, setChooseStn] = useState("ALL")
  const { series, xAxis, allData } = useDayloadScreen({ stnCode: chooseStn, reload: reload.current })

  const setSite = useRef((e) => {
    setChooseStn(e ?? "ALL")
  })
  useEffect(() => {
    if (!series) return
    // const xAxis = ["23", "57"]
    // const allData = [
    //   { agvcPower: 1000, syzzzPower: 24567, shortPredPower: 95959, ultraShortPredPower: 485967 },
    //   { agvcPower: 1000, syzzzPower: 24567, shortPredPower: 95959, ultraShortPredPower: 485967 },
    // ]
    setChartData({
      series: [
        {
          ...echartsLineColor.agvcPower,
          data: allData?.map((i) => parseNum(i.agvcPower / 10), 3) || [],
        },
        {
          ...echartsLineColor.syzzzPower,
          data: allData?.map((i) => parseNum(i.syzzzPower / 10), 3) || [],
        },
        {
          ...echartsLineColor.shortPredPower,
          data: allData?.map((i) => parseNum(i.shortPredPower / 10000), 3) || [],
        },
        {
          ...echartsLineColor.ultraShortPredPower,
          data: allData?.map((i) => parseNum(i.ultraShortPredPower / 10000), 3) || [],
        },
      ],
      xAxis,
      unit: "万kW",
      screenWidth: 5120 || window.innerWidth,
    })
  }, [series])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <HnCommonBox
      title="日负荷趋势"
      titleBox={
        <StationTreeSelect
          size="small"
          popupClassName="nhb-screen-select"
          onChange={setSite.current}
          style={{ width: "10em", zIndex: 2, fontSize: "16px" }}
        />
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </HnCommonBox>
  )
}
