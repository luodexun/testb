/*
 * @Author: chenmeifeng
 * @Date: 2024-07-17 16:07:22
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 17:22:05
 * @Description:
 */
import { LineOrBarOption } from "../../configs/line-bar-options"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import CommonCtBox from "../common-box"
import LargeScreenContext from "@/contexts/screen-context"
import { useAtomValue } from "jotai"
import { mainComAtom } from "@/store/atom-screen-data"
import { getPowerFutureInfo } from "@/utils/screen-funs"
import { parseNum } from "@/utils/util-funs"
import { echartsLineColor } from "../../configs"
import { useRefresh } from "@/hooks/use-refresh"
import { modelPie } from "../../configs/model-pie"
import { modelData } from "../../methods"

export default function SXPredictPower() {
  const [chartData, setChartData] = useState(null)
  const [modelChartData, setModelChartData] = useState(null)
  const [isPrdCpn, setIsPrdCpn] = useState(true)

  const [reload, setReload] = useRefresh(10 * 60 * 1000) // 10min
  const { quotaInfo } = useContext(LargeScreenContext)

  const initChartData = async () => {
    if (!reload) return
    const params = {
      preDay: "7",
    }
    const result = await getPowerFutureInfo(params)
    setReload(false)
    const xData = result?.ALL?.map((i) => i.forecastTime) || []
    const yData = result?.ALL?.map((i) => parseNum(i.shortPredProduction / 10000), 3) || [] // 返回的是kWh，展示万kWh
    setCharts(xData, yData)
  }
  const setCharts = (xData, yData) => {
    setChartData({
      unit: "万kWh",
      name: "预测电量",
      series: [
        {
          type: "line",
          name: "预测电量",
          ...echartsLineColor.pridict,
          showSymbol: false,
          data: yData,
        },
      ],
      xAxis: xData,
      screenWidth: 1920 || window.innerWidth,
      showLegend: false,
    })
  }
  const setModelCt = (data, sum) => {
    setModelChartData({
      series: data,
      sum,
      screenWidth: 1920 || window.innerWidth,
    })
  }
  const initModelChart = async () => {
    const res = await modelData()
    if (!res) return
    setReload(false)
    const { result, sum } = res
    setModelCt(result, sum)
  }
  const clkHeader = useRef(() => {
    setIsPrdCpn((prev) => !prev)
    setReload(true)
  })
  useEffect(() => {
    if (quotaInfo?.yearElecPredict && !quotaInfo?.yearElecPredict?.useInterfaceData) {
      const { data = [] } = quotaInfo?.yearElecPredict
      const xData = data?.map((i) => i.forecastTime) || []
      const yData = data?.map((i) => parseNum(i.shortPredProduction), 3) || []
      setCharts(xData, yData)
    }
    if (quotaInfo?.modelData && !quotaInfo?.modelData?.useInterfaceData) {
      const list = quotaInfo?.modelData?.data
      const sum = list?.reduce((prev, cur) => {
        return prev + cur.value
      }, 0)
      setModelCt(list, sum)
    }
  }, [quotaInfo])
  useEffect(() => {
    if (
      (quotaInfo?.yearElecPredict && quotaInfo?.yearElecPredict?.useInterfaceData && isPrdCpn) ||
      (isPrdCpn && !quotaInfo?.yearElecPredict)
    ) {
      initChartData()
    }
    if (
      (quotaInfo?.modelData && quotaInfo?.modelData?.useInterfaceData && !isPrdCpn) ||
      (!isPrdCpn && !quotaInfo?.modelData)
    ) {
      initModelChart()
    }
  }, [reload, quotaInfo, isPrdCpn])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  const { chartRef: mdChartRef, chartOptions: mdChartOpt } = useChartRender(modelChartData, modelPie)
  return (
    <CommonCtBox title={isPrdCpn ? "发电量预测" : "机型占比"} headerClk={clkHeader.current}>
      {isPrdCpn ? (
        <ChartRender ref={chartRef} empty option={chartOptions} />
      ) : (
        <ChartRender ref={mdChartRef} empty option={mdChartOpt} />
      )}
    </CommonCtBox>
  )
}
