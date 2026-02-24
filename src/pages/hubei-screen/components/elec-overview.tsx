/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 10:02:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-14 11:23:52
 * @Description: 发电量概览
 */
import "./elec-overview.less"

import { useEffect, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

import HBCommonTitle from "./common-title"
import ElecChartBox from "./elec-chart-box"

const monthOption = [
  { name: "月实际(万kWh)", key: "monthlyProduction" },
  { name: "月计划(万kWh)", key: "monthlyProductionPlan" },
]
const yearOption = [
  { name: "年实际(万kWh)", key: "yearlyProduction" },
  { name: "年计划(万kWh)", key: "yearlyProductionPlan" },
]
export default function ElecOverview(props) {
  const { isScreenOne = true } = props
  const winWidth = useRef(4480)
  const [chartData, setChartData] = useState({
    color: "#57D2F3",
    value: 0,
    screenWidth: winWidth.current || window.innerWidth,
    gaugeStyle: null,
  })
  const [data, setData] = useState(null)
  const [yearData, setYearData] = useState({
    color: "#BFFD90",
    value: 0,
    screenWidth: winWidth.current || window.innerWidth,
    gaugeStyle: null,
  })

  const actMonthOption = useMemo(() => {
    if (isScreenOne) {
      return monthOption
    }
    return [{ name: "月发电量(万kWh)", key: "monthlyProduction" }]
  }, [isScreenOne])
  const actYearOption = useMemo(() => {
    if (isScreenOne) {
      return yearOption
    }
    return [{ name: "年发电量(万kWh)", key: "yearlyProduction" }]
  }, [isScreenOne])
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
    <div className="screen-box elec-ov">
      <HBCommonTitle title="发电量概览" />
      <div className="elec-chart">
        <div className="elec-com">
          <ElecChartBox data={data} option={actMonthOption} chartData={chartData} />
        </div>
        <div className="elec-com">
          <ElecChartBox data={data} option={actYearOption} chartData={yearData} />
        </div>
      </div>
    </div>
  )
}
