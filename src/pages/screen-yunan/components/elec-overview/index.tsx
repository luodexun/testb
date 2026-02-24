/*
 * @Author: chenmeifeng
 * @Date: 2024-07-22 11:32:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-02 17:25:32
 * @Description:
 */
import "./index.less"
import { parseNum } from "@/utils/util-funs"
import YNCommonQuotaBox from "../common-quota"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import { getElecData } from "@/utils/screen-funs"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRefresh } from "@/hooks/use-refresh"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import { elecOvPie } from "../../configs/elec-overview"

const mapQtlist = [
  { name: "年发电量", key: "yearlyProduction", unit: "万kWh" },
  { name: "月发电量", key: "monthlyProduction", unit: "万kWh" },
  { name: "日发电量", key: "dailyProduction", unit: "万kWh" },
]
const planElecOption = [
  { name: "年计划", key: "yearlyProductionPlan", unit: "万kWh" },
  { name: "月计划", key: "monthlyProductionPlan", unit: "万kWh" },
]
export default function YNElecOverview() {
  const [reload, setReload] = useRefresh(3000) // 3s
  const count = useRef(1)
  const [monthChartData, setMChartData] = useState({
    screenWidth: 3456,
    value: 0,
  })
  const [yearChartData, setYChartData] = useState({
    screenWidth: 3456,
    value: 0,
  })
  const [productionInfo, setProductionInfo] = useState(null)
  const mainCpnInfo = useAtomValue(mainComAtom)
  const actualShowData = useMemo(() => {
    return {
      ...productionInfo,
      dailyProduction: mainCpnInfo?.dailyProduction,
    }
  }, [productionInfo, mainCpnInfo])

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
    setMChartData((prev) => {
      prev.value = result.monthRate
      return { ...prev }
    })
    setYChartData((prev) => {
      prev.value = result.yearRate
      return { ...prev }
    })
    setReload(false)
  }
  const { chartRef, chartOptions } = useChartRender(monthChartData, elecOvPie)
  const { chartRef: yearChartRef, chartOptions: yearChartOpt } = useChartRender(yearChartData, elecOvPie)

  useEffect(() => {
    if (!reload) return
    count.current = count.current + 1
    initData()
  }, [reload])
  return (
    <div className="yn-elec-ovw">
      <div className="elec-ovw-top">
        {mapQtlist.map((i) => {
          return (
            <div key={i.key} className="pdt-item">
              <YNCommonQuotaBox name={i.name} unit={i.unit} value={`${parseNum(actualShowData?.[i.key])}` || "-"} />
            </div>
          )
        })}
      </div>
      <div className="elec-ovw-bottom">
        {planElecOption.map((i) => {
          return (
            <div key={i.key} className="pdt-item">
              <YNCommonQuotaBox name={i.name} unit={i.unit} value={`${parseNum(actualShowData?.[i.key])}` || "-"} />
              <div className="pdt-item-chart">
                <ChartRender
                  ref={i.key !== "yearlyProductionPlan" ? chartRef : yearChartRef}
                  empty
                  option={i.key !== "yearlyProductionPlan" ? chartOptions : yearChartOpt}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
