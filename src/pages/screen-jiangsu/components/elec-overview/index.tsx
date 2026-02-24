/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 10:02:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-28 14:51:47
 * @Description: 发电量概览
 */
import "./index.less"

import { useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { parseNum, validResErr } from "@/utils/util-funs"

import ElecChartBox from "./common-elec-box"
import JsCommonBox from "../common-box"

const monthOption = [
  { name: "月实际", unit: "万kWh", key: "monthlyProduction" },
  { name: "月计划", unit: "万kWh", key: "monthlyProductionPlan" },
]
const yearOption = [
  { name: "年实际", unit: "万kWh", key: "yearlyProduction" },
  { name: "年计划", unit: "万kWh", key: "yearlyProductionPlan" },
]
export default function ElecOverview(props) {
  const { isScreenOne = true } = props
  const [chartData, setChartData] = useState({
    color: ["RGBA(253, 135, 8, 1)", "RGBA(252, 207, 21, 1)", "RGBA(253, 135, 8, 1)"],
    value: 0,
    screenWidth: 6400 || window.innerWidth,
    gaugeStyle: null,
  })
  const [data, setData] = useState(null)
  const [yearData, setYearData] = useState({
    color: ["RGBA(244, 0, 254, 1)", "RGBA(247, 15, 86, 1)", "RGBA(244, 0, 254, 1)"],
    value: 0,
    screenWidth: 6400 || window.innerWidth,
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
    console.log(result, "result")

    setChartData((prev) => {
      prev.value = parseNum((result?.monthlyProduction / result?.monthlyProductionPlan) * 100)
      prev.gaugeStyle = !isScreenOne
      return { ...prev }
    })
    setYearData((prev) => {
      prev.value = parseNum((result?.yearlyProduction / result?.yearlyProductionPlan) * 100)
      prev.gaugeStyle = !isScreenOne
      return { ...prev }
    })

    setData(result)
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="elec-overview">
      <div className="elec-com">
        <ElecChartBox data={data} title="月" option={monthOption} chartData={chartData} />
      </div>
      <div className="elec-com">
        <ElecChartBox data={data} title="年" option={yearOption} chartData={yearData} />
      </div>
    </div>
  )
}
