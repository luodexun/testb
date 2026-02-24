/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 15:40:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-23 16:23:00
 * @Description: 广东大屏-预测电量
 */
import "./prediction-elec.less"

import { Select } from "antd"
import dayjs from "dayjs"
import { useContext, useEffect, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import StationTreeSelect from "@/components/station-tree-select"
import useChartRender from "@/hooks/use-chart-render"
import { getStnPduTrendData, stnPduTrendData2ChartData } from "@/pages/area-index/power-daily-trend/methods"
import { IStnPduTrendDataAfterDeal } from "@/pages/area-index/power-daily-trend/types"
import { getStartAndEndTime } from "@/utils/form-funs"
import { parseNum, vDate } from "@/utils/util-funs"

import { echartsLineColor, SELECTOPTION } from "../../configs"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { getPowerFutureInfo, getScreenStnPduTrendData } from "../../methods"
import HBCommonTitle from "../common-box-header/box-header"
import HB1CommonBox from "../common-box"
import { useRefresh } from "@/hooks/use-refresh"
import LargeScreenContext from "@/contexts/screen-context"

export default function GDPrediction() {
  const [chartData, setChartData] = useState(null)
  const [selectVal, setSelectVal] = useState("MAINTENANCE_COM_ID")
  const [allSource, setAllSource] = useState<IStnPduTrendDataAfterDeal>()
  const [chooseStn, setChooseStn] = useState("")
  const [reload, setReload] = useRefresh(60 * 60 * 1000) // 一小时
  const timer = useRef(null)

  const { quotaInfo } = useContext(LargeScreenContext)
  const actualShowInfo = useMemo(() => {
    return {
      data: quotaInfo?.yearElecPredict?.data?.map((i) => i.dailyProduction) || [],
      xAxis: quotaInfo?.yearElecPredict?.data?.map((i) => i.Time) || [],
    }
  }, [quotaInfo])
  const useInterfaceData = useMemo(() => {
    return quotaInfo?.yearElecPredict?.useInterfaceData
  }, [quotaInfo])
  const initData = async () => {
    const allSource = await getStnPduTrendData()
    setAllSource(allSource)
    setReload(false)
  }
  const initChartData = async () => {
    const result = stnPduTrendData2ChartData(allSource, chooseStn)
    setChart(result)
  }
  const setChart = (result) => {
    setChartData({
      unit: "万kWh",
      series: [
        {
          name: "发电量趋势",
          type: "line",
          ...echartsLineColor.pridict,
          showSymbol: false,
          data: result?.data.map((i) => i / 10000), // 返回的是kWh，展示万kWh
        },
      ],
      xAxis: result?.xAxis,
      screenWidth: 4480 || window.innerWidth,
      showLegend: false,
    })
  }
  const setSite = (e) => {
    clearInterval(timer.current)
    setChooseStn(e)
  }
  useEffect(() => {
    // 当数据自定义接口返回useInterfaceData为false时，取自定义数据
    if (quotaInfo?.yearElecPredict && !useInterfaceData) setChart(actualShowInfo)
  }, [useInterfaceData])
  useEffect(() => {
    if (allSource) {
      initChartData()
    }
  }, [allSource, chooseStn])
  useEffect(() => {
    if (!reload) return
    if (quotaInfo && quotaInfo?.yearElecPredict && !useInterfaceData) return
    initData()
  }, [reload])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <HB1CommonBox
      headerName="发电量趋势"
      headerType="elec"
      className="gd-prediction"
      stationBox={
        <StationTreeSelect
          size="small"
          onChange={setSite}
          style={{ width: "100%", zIndex: 2, fontSize: "16px" }}
          popupClassName="nhb-screen-select"
        />
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </HB1CommonBox>
  )
}
