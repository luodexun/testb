import "./index.less"
import ChartRender from "@/components/chart-render"
import HnCommonBox from "../common-box"
import { useEffect, useState } from "react"
import { doBaseServer } from "@/api/serve-funs"
import { isNumVal, validResErr } from "@/utils/util-funs"
import CommonElecBox from "./elec-box"
import useHourScreen from "@/hooks/use-usehour-screen"
import { echartsLineColor } from "../../configs"
import { TYear0Month } from "@/types/i-config"
import useChartRender from "@/hooks/use-chart-render"
import { LineOrBarOption } from "../../configs/line-bar-options"
import ComRadioClk from "../common-radio"
import { calcRate } from "@/utils/device-funs"
import { MS_HOUR } from "@/configs/time-constant"
import { useRefresh } from "@/hooks/use-refresh"
import { getStationProductionData } from "../../methods"
const monthOption = [
  { name: "月实际", unit: "万kWh", key: "monthlyProduction" },
  { name: "月计划", unit: "万kWh", key: "monthlyProductionPlan" },
]
const yearOption = [
  { name: "年实际", unit: "万kWh", key: "yearlyProduction" },
  { name: "年计划", unit: "万kWh", key: "yearlyProductionPlan" },
]
const ymOption = [
  { name: "月", value: "monthly" },
  { name: "年", value: "yearly" },
]
export default function HnElecOvw() {
  const [chartAllData, setChartAllData] = useState(null)
  const [allData, setAllData] = useState([])

  const [chartType, setChartType] = useState("monthly")
  const [chartData, setChartData] = useState({
    color: ["rgba(255, 95, 45, 1)", "rgba(224, 232, 9, 1)", "rgba(224, 232, 9, 1)"],
    value: 0,
    screenWidth: 5120 || window.innerWidth,
  })
  const [data, setData] = useState(null)
  const [yearData, setYearData] = useState({
    color: ["rgba(45, 198, 255, 1)", "rgba(123, 48, 255, 1)", "rgba(123, 48, 255, 1)"],
    value: 0,
    screenWidth: 5120 || window.innerWidth,
  })

  const [reload, setReload] = useRefresh(MS_HOUR) // 一小时
  const { chartRef, chartOptions } = useChartRender(chartAllData, LineOrBarOption)

  const initData = async () => {
    const res = await doBaseServer("getCenterProduction")
    const valid = validResErr(res)
    if (valid) return
    const result = res
    console.log(result, "result")

    result.monthlyProduction = result?.monthlyProduction / 10000 || 0
    result.monthlyProductionPlan = result?.monthlyProductionPlan / 10000 || 0
    result.yearlyProduction = result?.yearlyProduction / 10000 || 0
    result.yearlyProductionPlan = result?.yearlyProductionPlan / 10000 || 0

    setChartData((prev) => {
      prev.value = result?.monthlyProductionPlan ? (result?.monthlyProduction / result?.monthlyProductionPlan) * 100 : 0
      return { ...prev }
    })
    setYearData((prev) => {
      prev.value = result?.yearlyProductionPlan ? (result?.yearlyProduction / result?.yearlyProductionPlan) * 100 : 0
      return { ...prev }
    })

    setData(result)
  }

  useEffect(() => {
    if (!reload) return
    getStationProductionData()
      .then(setAllData)
      .then(() => setReload(false))
  }, [reload, setReload])
  useEffect(() => {
    if (!allData?.length) return
    const planKey = `${chartType}ProductionPlan`
    const realKey = `${chartType}Production`
    const xAxis = allData?.map((i) => i.stationShortName)
    const plan = allData?.map((i) => (isNumVal(i[planKey]) ? i[planKey] / 10000 : null))
    const actual = allData?.map((i) => (isNumVal(i[realKey]) ? i[realKey] / 10000 : null))
    const rate = allData?.map((i) =>
      isNumVal(i[planKey]) && isNumVal(i[realKey]) && i[planKey] ? (i[realKey] / i[planKey]) * 100 : null,
    )
    setChartAllData(() => {
      return {
        unit: "万kWh",
        series: [
          {
            ...echartsLineColor.realityElec,
            data: actual,
          },
          {
            ...echartsLineColor.planElec,
            data: plan,
          },
          {
            ...echartsLineColor.finishRate,
            yAxisIndex: 1,
            data: rate,
            smooth: true,
            showSymbol: false,
          },
        ],
        xAxis,
        yAxisTwoUnit: "%",
        screenWidth: 3456 || window.innerWidth,
      }
    })
  }, [allData, chartType])

  useEffect(() => {
    initData()
  }, [])
  return (
    <HnCommonBox
      title="发电量概览"
      className="hn-elev-ovw"
      titleBox={
        <ComRadioClk
          options={ymOption}
          onChange={(e) => {
            setChartType(e)
          }}
        />
      }
    >
      <div className="elev-ovw-top">
        <CommonElecBox option={monthOption} data={data} chartData={chartData} />
        <CommonElecBox option={yearOption} data={data} chartData={yearData} />
      </div>
      <div className="elev-ovw-bottom">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </HnCommonBox>
  )
}
