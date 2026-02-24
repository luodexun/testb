/*
 * @Author: chenmeifeng
 * @Date: 2024-07-22 11:32:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-15 11:01:50
 * @Description:
 */
import "./index.less"
import { judgeNull, parseNum } from "@/utils/util-funs"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import { getElecData } from "@/utils/screen-funs"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useRefresh } from "@/hooks/use-refresh"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import { elecOvPie } from "../../configs/elec-overview"
import NXCommonQuotaHtBox from "../common-quota/horizontal"
import LargeScreenContext from "@/contexts/screen-context"
import ElecForm from "./elec-form"

const mapQtlist = {
  day: [
    { name: "日发电", key: "dailyProduction", unit: "万kWh" },
    { name: "日计划", key: "dailyProductionPlan", unit: "万kWh" },
  ],
  month: [
    { name: "月发电", key: "monthlyProduction", unit: "万kWh" },
    { name: "月计划", key: "monthlyProductionPlan", unit: "万kWh" },
  ],
  year: [
    { name: "年发电", key: "yearlyProduction", unit: "万kWh" },
    { name: "年计划", key: "yearlyProductionPlan", unit: "万kWh" },
  ],
}
export default function NXElecOverview() {
  const [reload, setReload] = useRefresh(60 * 60 * 1000) // 3s
  const count = useRef(1)
  const [showModal, setshowModal] = useState(false)
  const [monthChartData, setMChartData] = useState({
    screenWidth: 4320,
    value: 0,
    type: "month",
  })
  const [yearChartData, setYChartData] = useState({
    screenWidth: 4320,
    value: 0,
    type: "year",
  })
  const [dayChartData, setDChartData] = useState({
    screenWidth: 4320,
    value: 0,
    type: "day",
  })
  const [productionInfo, setProductionInfo] = useState(null)
  const [actualShowData, setActualShowData] = useState(null)
  const mainCpnInfo = useAtomValue(mainComAtom)
  const { quotaInfo } = useContext(LargeScreenContext)
  const initData = async () => {
    const result = await getElecData()
    if (!result) return
    // const result = {
    //   monthlyProduction: 12 + count.current,
    //   monthlyProductionPlan: 11 + count.current,
    //   yearlyProduction: 23 + count.current,
    //   yearlyProductionPlan: 2 + count.current,
    //   monthRate: parseNum((12 / 11) * 100),
    //   yearRate: parseNum((23 / 2) * 100),
    // }
    setProductionInfo({ ...result })

    setReload(false)
  }
  const operateModal = useRef(() => {
    setshowModal((prev) => !prev)
  })
  const { chartRef, chartOptions } = useChartRender(dayChartData, elecOvPie)
  const { chartRef: yearChartRef, chartOptions: yearChartOpt } = useChartRender(yearChartData, elecOvPie)
  const { chartRef: monthChartRef, chartOptions: monthChartOpt } = useChartRender(monthChartData, elecOvPie)
  useEffect(() => {
    // console.log(quotaInfo, "quotaInfo")
    const sd = {
      monthlyProduction: 12,
      monthlyProductionPlan: 0,
      yearlyProduction: 20,
      yearlyProductionPlan: 0,
      monthRate: 0,
      yearRate: 0,
    }
    const data = quotaInfo?.electricity?.data || {}
    const virtualData = Object.keys(data)
      .filter((key) => data[key] !== null)
      .reduce((acc, key) => {
        acc[key] = data[key]
        return acc
      }, {})
    const params = {
      ...productionInfo,
      dailyProduction: mainCpnInfo?.dailyProduction,
      ...virtualData,
    }
    params.monthRate = parseNum((params?.monthlyProduction / params?.monthlyProductionPlan) * 100)
    params.yearRate = parseNum((params?.yearlyProduction / params?.yearlyProductionPlan) * 100)
    params.dayRate = parseNum((params?.dailyProduction / params?.dailyProductionPlan) * 100)
    setActualShowData(params)
    setDChartData((prev) => {
      prev.value = params.dayRate
      return { ...prev }
    })
    setMChartData((prev) => {
      prev.value = params.monthRate
      return { ...prev }
    })
    setYChartData((prev) => {
      prev.value = params.yearRate
      return { ...prev }
    })
  }, [productionInfo, mainCpnInfo, quotaInfo]) //
  useEffect(() => {
    if (!reload) return
    count.current = count.current + 1
    initData()
  }, [reload])
  return (
    <div className="nx-elec-ovw">
      {Object.keys(mapQtlist)?.map((i) => {
        return (
          <div key={i} className="pdt-item" onClick={operateModal.current}>
            <div className="pdt-item-left">
              {mapQtlist[i].map((child) => {
                return (
                  <NXCommonQuotaHtBox
                    key={child.key}
                    name={child.name}
                    unit={child.unit}
                    value={judgeNull(actualShowData?.[child.key], 1, 2, "-")}
                  />
                )
              })}
            </div>
            <div className="pdt-item-chart">
              <ChartRender
                ref={i === "year" ? yearChartRef : i === "month" ? monthChartRef : chartRef}
                empty
                option={i === "year" ? yearChartOpt : i === "month" ? monthChartOpt : chartOptions}
              />
            </div>
          </div>
        )
      })}
      {showModal ? <ElecForm setshowModal={operateModal.current} /> : ""}
    </div>
  )
}
