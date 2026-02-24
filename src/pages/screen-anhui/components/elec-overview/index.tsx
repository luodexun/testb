/*
 * @Author: chenmeifeng
 * @Date: 2024-07-04 15:42:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-30 14:58:33
 * @Description:
 */
import { useEffect, useState } from "react"
import CommonCtBox from "../common-box"
import useChartRender from "@/hooks/use-chart-render"
import { brand2DPie } from "../../configs/pie-options"
// import { getElecData } from "../../methods"
import ChartRender from "@/components/chart-render"
import { useAtomValue } from "jotai"
import { mainComAtom } from "@/store/atom-screen-data"
import { getElecData } from "@/utils/screen-funs"
import { parseNum } from "@/utils/util-funs"

export default function ElecOverview() {
  const [chartData, setChartData] = useState(null)
  const mainCpnInfo = useAtomValue(mainComAtom)
  const initData = async () => {
    const result = await getElecData()
    if (!result) return
    setChartData((prev) => {
      return {
        ...prev,
        monthlyProduction: parseNum(result.monthlyProduction),
        monthRate: result.monthRate,
        yearlyProduction: parseNum(result.yearlyProduction),
        yearRate: result.yearRate,
      }
    })
  }

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    setChartData((prev) => {
      return {
        ...prev,
        dailyProduction: parseNum(mainCpnInfo?.dailyProduction) || 0,
      }
    })
  }, [mainCpnInfo])

  const { chartRef, chartOptions } = useChartRender(chartData, brand2DPie)
  return (
    <CommonCtBox title="发电量统计">
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </CommonCtBox>
  )
}
