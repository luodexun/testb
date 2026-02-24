/*
 * @Author: chenmeifeng
 * @Date: 2024-07-16 17:20:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 17:07:18
 * @Description:
 */
import useChartRender from "@/hooks/use-chart-render"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import { brand2DPie } from "../../configs/pie-options"
import { useContext, useEffect, useMemo, useState } from "react"
import ChartRender from "@/components/chart-render"
import LargeScreenContext from "@/contexts/screen-context"
import { parseNum } from "@/utils/util-funs"
import { getElecData } from "@/utils/screen-funs"
import { useRefresh } from "@/hooks/use-refresh"

export default function SXElecTop(props) {
  const [chartData, setChartData] = useState(null)
  // const mainCpnInfo = useAtomValue(mainComAtom)
  const [elecData, setElecData] = useState(null)
  const [reload, setReload] = useRefresh(60 * 60 * 1000)
  const { quotaInfo } = useContext(LargeScreenContext)

  const actualShowInfo = useMemo(() => {
    if (quotaInfo?.electricity && !quotaInfo?.electricity?.useInterfaceData) {
      return quotaInfo?.electricity?.rate || null
    }
    return elecData
  }, [quotaInfo, elecData])

  const getRate = async () => {
    const res = await getElecData()
    setReload(false)
    setElecData(res)
  }
  useEffect(() => {
    if (!reload) return
    getRate()
  }, [reload])
  useEffect(() => {
    if (!actualShowInfo) return
    setChartData({
      yearRate: parseNum(actualShowInfo?.yearRate),
      monthRate: parseNum(actualShowInfo?.monthRate),
    })
  }, [actualShowInfo])
  const { chartRef, chartOptions } = useChartRender(chartData, brand2DPie)
  return (
    <div className="l-full sx-etop">
      <ChartRender ref={chartRef} option={chartOptions} />
    </div>
  )
}
