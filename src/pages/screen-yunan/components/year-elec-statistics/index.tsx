/*
 * @Author: chenmeifeng
 * @Date: 2024-07-22 10:49:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-14 17:53:53
 * @Description: 年发电量统计
 */
import YnCommonBox from "../common-box"
import { LineOrBarOption } from "../../configs/line-bar-options"
import { DVS_TYPE_OPTION, echartsLineColor } from "../../configs"
import { useEffect, useState } from "react"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import ComRadioClk from "../common-radio"
import { useRefresh } from "@/hooks/use-refresh"
import { doBaseServer } from "@/api/serve-funs"
import { judgeNull, parseNum, uDate, vDate, validResErr } from "@/utils/util-funs"
import { dayH2Mi } from "@/configs/time-constant"

export default function YearElecSts() {
  const [chartData, setChartData] = useState(null)
  const [reload, setReload] = useRefresh(60 * 60 * 1000)
  const [series, setSeries] = useState({ dailyProduction: [], productionPlan: [], rate: [] })
  const [xAxis, setXAxis] = useState([])
  const getProductionData = async () => {
    const currentYear = vDate().year()
    const res = await doBaseServer("getProductionPlanDetail", { year: currentYear, stationCode: "" })
    if (validResErr(res)) return
    const dailyProduction = res?.map((i) => judgeNull(i.dailyProduction, 10000, 3))
    const productionPlan = res?.map((i) => judgeNull(i.productionPlan, 10000, 3))
    const rate = res?.map((i) =>
      i.dailyProduction && i.productionPlan ? parseNum((i.dailyProduction / i.productionPlan) * 100, 3) : 0,
    )
    // const Time = res?.map((i) => uDate(new Date(i.Time).valueOf(), dayH2Mi))
    const Time = res?.map((i) => i.month)
    setReload(false)
    setSeries({
      dailyProduction,
      productionPlan,
      rate,
    })
    setXAxis(Time)
    // setQuotaInfo(res)
  }
  useEffect(() => {
    setChartData(() => {
      return {
        unit: "万kWh",
        series: [
          {
            ...echartsLineColor.realityElec,
            data: series?.dailyProduction,
          },
          {
            ...echartsLineColor.planElec,
            data: series?.productionPlan,
          },
          {
            ...echartsLineColor.finishRate,
            yAxisIndex: 1,
            data: series?.rate,
            smooth: true,
            showSymbol: false,
          },
        ],
        xAxis,
        yAxisTwoUnit: "%",
        screenWidth: 3456 || window.innerWidth,
      }
    })
  }, [series, xAxis])
  useEffect(() => {
    if (!reload) return
    getProductionData()
  }, [reload])
  const { chartRef, chartOptions } = useChartRender(chartData, LineOrBarOption)
  return (
    <YnCommonBox title="年发电量统计">
      {/* titleBox={<ComRadioClk options={DVS_TYPE_OPTION} />} */}
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </YnCommonBox>
  )
}
