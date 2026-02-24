/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 15:40:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-29 09:36:31
 * @Description: 广东大屏-年利用小时数
 */
import "./year-use-hour.less"

import { Select } from "antd"
import { useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { validResErr } from "@/utils/util-funs"

import { SELECTOPTION, TREND_OPTION, yearUseBarStyle } from "../../configs"
import { lineOrBarOption } from "../../configs/day-load-trend"
import ComRadioClk from "../common-radio"
import HBCommonTitle from "../common-title"
import useHourScreen from "@/hooks/use-usehour-screen"

export default function GDYearUseHour() {
  const [chartData, setChartData] = useState(null)
  // const [currentIdx, setCurrentIdx] = useState("wtYearlyUtilizationHour")

  const [selectVal, setSelectVal] = useState("MAINTENANCE_COM_ID")
  const { series, xAxis } = useHourScreen({ stnType: selectVal })
  useEffect(() => {
    setChartData({
      series: [
        {
          type: "line",
          name: "年利用小时数",
          // barWidth: 20,
          ...yearUseBarStyle,
          data: series,
        },
      ],
      xAxis,
      yUnit: "h",
      screenWidth: window.innerWidth,
      showLegend: false,
    })
  }, [series, xAxis])
  const chooseType = (e) => {
    setSelectVal(e)
  }
  // const changeYear = (e) => {
  //   setCurrentIdx(e)
  //   getScreenPointData(selectVal, e)
  // }
  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)
  return (
    <div className="screen-box gd-year-use">
      <HBCommonTitle
        title="年利用小时数"
        // children={
        //   <ComRadioClk
        //     options={TREND_OPTION}
        //     onChange={(e) => {
        //       changeYear(e)
        //     }}
        //   />
        // }
      />
      <div className="screen-box-content">
        <div className="station-select">
          <Select
            options={SELECTOPTION}
            value={selectVal}
            style={{ width: "100%", zIndex: 2 }}
            onChange={(e) => chooseType(e)}
          ></Select>
        </div>
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
