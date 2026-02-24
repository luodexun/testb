/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-15 11:13:00
 * @Description: 日负荷模块
 */
import "./day-load.less"

import { useContext, useEffect, useMemo, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import useChartRender from "@/hooks/use-chart-render"
import useDayloadScreen from "@/hooks/use-dayload-screen"
import { lineOption } from "../../configs/day-rate-option"
import HB1CommonBox from "../common-box"
import LargeScreenContext from "@/contexts/screen-context"
const optionsType = [
  { name: "风", value: "1" },
  { name: "光", value: "2" },
]
export default function DayLoad() {
  const [chartData, setChartData] = useState(null)
  // const [currentIdx, setCurrentIdx] = useState("1")
  const reload = useRef(5 * 60 * 1000) // 五分钟
  const [chooseStn, setChooseStn] = useState("ALL")

  const { quotaInfo } = useContext(LargeScreenContext)
  const actualShowInfo = useMemo(() => {
    if (quotaInfo?.dayTrendInfo && !quotaInfo?.dayTrendInfo?.useInterfaceData) {
      return quotaInfo?.dayTrendInfo?.data || []
    }
  }, [quotaInfo])
  const { series, xAxis } = useDayloadScreen({
    stnCode: chooseStn,
    reload: reload.current,
    isStaticInfo: quotaInfo?.dayTrendInfo && !quotaInfo?.dayTrendInfo?.useInterfaceData,
    staticInfo: actualShowInfo,
  })

  const setSite = useRef((e) => {
    setChooseStn(e ?? "ALL")
  })
  useEffect(() => {
    setChartData({
      series,
      xAxis,
      screenWidth: 4480 || window.innerWidth,
    })
  }, [series, xAxis])
  const { chartRef, chartOptions } = useChartRender(chartData, lineOption)
  return (
    <HB1CommonBox
      headerName="日负荷趋势"
      headerType="trend"
      stationBox={
        <StationTreeSelect
          size="small"
          popupClassName="nhb-screen-select"
          onChange={setSite.current}
          style={{ width: "100%", zIndex: 2, fontSize: "16px" }}
        />
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </HB1CommonBox>
  )
}
