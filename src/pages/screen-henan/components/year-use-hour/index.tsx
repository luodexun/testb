/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 11:25:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-19 11:04:27
 * @Description:
 */
import HnCommonBox from "../common-box"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { THREE_OPTION, echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useHourScreen from "@/hooks/use-usehour-screen"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import { Select } from "antd"

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
      screenWidth: 5120 || window.innerWidth,
      showLegend: false,
    })
  }, [series, xAxis])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <HnCommonBox
      title="年利用小时数"
      titleBox={
        <Select
          options={THREE_OPTION}
          value={selectVal}
          style={{ width: "10em", zIndex: 2, fontSize: "16px" }}
          onChange={(e) => setSelectVal(e)}
          popupClassName="nhb-screen-select"
        ></Select>
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </HnCommonBox>
  )
}
