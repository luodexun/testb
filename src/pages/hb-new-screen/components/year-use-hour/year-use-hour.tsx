/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 14:27:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-17 14:06:46
 * @Description: 年利用小时数
 */
import "./year-use-hour.less"

import { Select } from "antd"
import { useContext, useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { validResErr } from "@/utils/util-funs"

import { echartsLineColor, optionsType, selectOptions } from "../../configs"
import { LineOrBarOption } from "../../configs/line-bar-options"
import HBCommonTitle from "../common-box-header/box-header"
import ComRadioClk from "../common-radio"
import HB1CommonBox from "../common-box"
import LargeScreenContext from "@/contexts/screen-context"
import { useRefresh } from "@/hooks/use-refresh"
export default function YearUseHour() {
  const [chartData, setChartData] = useState(null)
  const [currentIdx, setCurrentIdx] = useState("wtYearlyUtilizationHour")

  const [selectVal, setSelectVal] = useState("STATION_CODE")
  const [reload, setReload] = useRefresh(60 * 60 * 1000)
  const { quotaInfo } = useContext(LargeScreenContext)
  const getScreenPointData = async (name = "STATION_CODE", currentIdx = "wtYearlyUtilizationHour") => {
    let res
    if (quotaInfo?.yearHourData && !quotaInfo?.yearHourData?.useInterfaceData) {
      const data = quotaInfo?.yearHourData.data?.[name] || []
      const key =
        name === "REGION_COM_ID"
          ? "regionComShortName"
          : name === "MAINTENANCE_COM_ID"
            ? "maintenanceComFullName"
            : "stationShortName"
      res = data?.map((i) => {
        return {
          ...i,
          [key]: i.name,
        }
      })
    } else {
      res = await doBaseServer("getScreenPoint", { groupByPath: name })
      const valid = validResErr(res)
      if (valid) return
    }
    setReload(false)
    const result = res?.sort((a, b) => {
      return b.yearlyUtilizationHour - a.yearlyUtilizationHour
    })
    const xAxis =
      result?.map((i) =>
        name === "REGION_COM_ID"
          ? i.regionComShortName
          : name === "MAINTENANCE_COM_ID"
            ? i.maintenanceComFullName
            : i.stationShortName,
      ) || []
    setChartData({
      unit: "h",
      series: [
        {
          ...echartsLineColor.yearUseRate,
          // data: res?.map((i) => i[currentIdx]) || [],
          data: result?.map((i) => i.yearlyUtilizationHour) || [],
        },
      ],
      xAxis,
      axisLabel: {
        interval: 0,
      },
      screenWidth: 4480 || window.innerWidth,
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
    if (!reload) return
    getScreenPointData()
  }, [reload])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <HB1CommonBox
      headerName="年利用小时数"
      headerType="time"
      stationBox={
        <Select
          options={selectOptions}
          value={selectVal}
          style={{ width: "100%", zIndex: 2, fontSize: "16px" }}
          onChange={(e) => chooseType(e)}
          popupClassName="nhb-screen-select"
        ></Select>
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </HB1CommonBox>
  )
}
