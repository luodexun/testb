/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 10:02:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-15 17:13:57
 * @Description: 发电量概览
 */
import "./elec-overview.less"

import { useContext, useEffect, useMemo, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

import HBCommonTitle from "../common-box-header/box-header"
import ElecChartBox from "../common-elec-box"
import HB1CommonBox from "../common-box"
import LargeScreenContext from "@/contexts/screen-context"
import { useRefresh } from "@/hooks/use-refresh"

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
  // const []
  const [chartData, setChartData] = useState({
    color: "#76BC2E",
    value: 0,
    screenWidth: window.innerWidth,
    gaugeStyle: null,
  })
  const [data, setData] = useState(null)
  const [yearData, setYearData] = useState({
    color: "#007CFF",
    value: 0,
    screenWidth: window.innerWidth,
    gaugeStyle: null,
  })

  const [reload, setReload] = useRefresh(5 * 60 * 1000) // 5分钟
  const { quotaInfo } = useContext(LargeScreenContext)
  const useInterfaceData = useMemo(() => {
    return quotaInfo?.electricity?.useInterfaceData
  }, [quotaInfo])

  const initData = async () => {
    let result = {
      monthlyProduction: null,
      monthlyProductionPlan: null,
      yearlyProduction: null,
      yearlyProductionPlan: null,
    }
    // 当数据自定义接口返回useInterfaceData为false时，取自定义数据
    if (quotaInfo?.electricity && !useInterfaceData) {
      result = { ...quotaInfo?.electricity?.data }
    } else {
      result = await doBaseServer("getCenterProduction")
      const valid = validResErr(result)
      if (valid && !result) return
    }
    // const result = res
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
    setReload(false)
    setData(result)
  }
  useEffect(() => {
    if (!reload) return
    initData()
  }, [reload])
  return (
    <HB1CommonBox headerName="发电量概览" headerType="elec" className="nhb-elec-ov">
      <div className="elec-chart">
        <div className="elec-com">
          <ElecChartBox data={data} title="月" option={monthOption} chartData={chartData} />
        </div>
        <div className="elec-com">
          <ElecChartBox data={data} title="年" option={yearOption} chartData={yearData} />
        </div>
      </div>
    </HB1CommonBox>
  )
}
