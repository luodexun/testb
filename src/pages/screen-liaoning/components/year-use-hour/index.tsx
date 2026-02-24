/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 16:43:22
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-09 17:17:24
 * @Description: 年利用小时数
 */
import "./index.less"
import LNCommonBox from "../common-box"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { DVS_TYPE_WP_OPTION, SELECT_OPTIONS, echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useHourScreen from "@/hooks/use-usehour-screen"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import ComRadioClk from "../common-radio"
import { Select } from "antd"

export default function YearUseHour() {
  const [chartData, setChartData] = useState(null)

  const [selectVal, setSelectVal] = useState("STATION_CODE")
  const { series, xAxis } = useHourScreen({ stnType: selectVal })
  useEffect(() => {
    setChartData((prev) => {
      return {
        unit: "h",
        series: [
          {
            barWidth: 40,
            ...echartsLineColor.yearUseRate,
            data: series,
          },
        ],
        xAxis,
        screenWidth: 5440 || window.innerWidth,
        showLegend: false,
      }
    })
  }, [series])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <LNCommonBox
      title="年利用小时数"
      titleBox={
        <Select
          popupClassName="ln-screen-select"
          options={SELECT_OPTIONS}
          value={selectVal}
          style={{ zIndex: 2, fontSize: "10px" }}
          onChange={(e) => setSelectVal(e)}
          className="use-slt"
        ></Select>
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </LNCommonBox>
  )
}
