/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 10:02:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-15 17:32:50
 * @Description: 发电量概览
 */
import "./elec-overview.less"

import { useEffect, useMemo, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

import HBCommonTitle from "../common-title"
import ElecChartBox from "./elec-chart-box"

const monthOption = [
  { name: "月实际(万kWh)", key: "monthlyProduction" },
  { name: "月计划(万kWh)", key: "monthlyProductionPlan" },
]
const yearOption = [
  { name: "年实际(万kWh)", key: "yearlyProduction" },
  { name: "年计划(万kWh)", key: "yearlyProductionPlan" },
]
export default function GDElecOverview(props) {
  const { isScreenOne = true } = props
  const [chartData, setChartData] = useState({
    color: "#57D2F3",
    value: 0,
    screenWidth: window.innerWidth,
    gaugeStyle: null,
  })
  const [data, setData] = useState(null)
  const [yearData, setYearData] = useState({
    color: "#BFFD90",
    value: 76,
    screenWidth: window.innerWidth,
    gaugeStyle: null,
  })
  const initData = async () => {
    const res = await doBaseServer("getCenterProduction")
    const valid = validResErr(res)
    if (valid && !res) return
    const result = res
    result.monthlyProduction = result?.monthlyProduction / 10000 || 0
    result.monthlyProductionPlan = result?.monthlyProductionPlan / 10000 || 0
    result.yearlyProduction = result?.yearlyProduction / 10000 || 0
    result.yearlyProductionPlan = result?.yearlyProductionPlan / 10000 || 0
    setChartData((prev) => {
      prev.value = (result?.monthlyProduction / result?.monthlyProductionPlan) * 100
      prev.gaugeStyle = !isScreenOne
      return { ...prev }
    })
    setYearData((prev) => {
      prev.value = (result?.yearlyProduction / result?.yearlyProductionPlan) * 100
      prev.gaugeStyle = !isScreenOne
      return { ...prev }
    })

    setData(result)
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="screen-box gd-elec-ov">
      <HBCommonTitle title="发电量概览" />
      <div className="screen-box-content gd-elec-content">
        <div className="elec-com">
          <ElecChartBox data={data} option={monthOption} chartData={chartData} />
        </div>
        <div className="elec-com">
          <ElecChartBox data={data} option={yearOption} chartData={yearData} />
        </div>
      </div>
    </div>
  )
}
