/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 14:27:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-13 16:50:16
 * @Description: 年利用小时数
 */
import "./year-use-hour.less"

import { Select } from "antd"
import { useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { validResErr } from "@/utils/util-funs"

import { optionsType, selectOptions } from "../configs"
import { yuBarOption } from "../configs/year-use-option"
import ComRadioClk from "./common-radio"
import HBCommonTitle from "./common-title"
export default function YearUseHour() {
  const [chartData, setChartData] = useState(null)
  const [currentIdx, setCurrentIdx] = useState("wtYearlyUtilizationHour")

  const [selectVal, setSelectVal] = useState("REGION_COM_ID")
  const winWidth = useRef(4480)
  const getScreenPointData = async (name = "REGION_COM_ID", currentIdx = "wtYearlyUtilizationHour") => {
    const res = await doBaseServer("getScreenPoint", { groupByPath: name })
    const valid = validResErr(res)
    if (valid) return
    setChartData({
      series: res?.map((i) => i.yearlyUtilizationHour) || [],
      xAxis:
        res?.map((i) =>
          name === "REGION_COM_ID"
            ? i.regionComShortName
            : name === "MAINTENANCE_COM_ID"
              ? i.maintenanceComFullName
              : i.stationShortName,
        ) || [],
      axisLabel: {
        interval: 0,
      },
      screenWidth: winWidth.current || window.innerWidth,
    })
  }
  const chooseType = (e) => {
    setSelectVal(e)
    getScreenPointData(e, currentIdx)
  }
  const changeYear = (e) => {
    setCurrentIdx(e)
    getScreenPointData(selectVal, e)
  }
  useEffect(() => {
    // getScreenPointData()
    setTimeout(() => {
      getScreenPointData()
    }, 500)
  }, [])
  const { chartRef, chartOptions } = useChartRender(chartData, yuBarOption)
  return (
    <div className="screen-box year-rate">
      <HBCommonTitle
        title="年利用小时数"
        // children={
        //   <ComRadioClk
        //     options={optionsType}
        //     onChange={(e) => {
        //       changeYear(e)
        //     }}
        //   />
        // }
      />
      <div className="year-chart">
        <div className="station-select">
          <Select
            options={selectOptions}
            value={selectVal}
            popupClassName="hb2-screen-select"
            style={{ width: "100%", fontSize: (10 * winWidth.current) / 4480 + "px", height: "90%" }}
            onChange={(e) => chooseType(e)}
          ></Select>
        </div>
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
