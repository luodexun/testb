/*
 * @Author: chenmeifeng
 * @Date: 2025-02-19 16:53:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-26 15:45:06
 * @Description:
 */
import "./index.less"
import { useEffect, useState } from "react"
import { IBrandData } from "../../types"
import { doBaseServer } from "@/api/serve-funs"
import { useRefresh } from "@/hooks/use-refresh"
import { MS_HOUR } from "@/configs/time-constant"
import { getPie3D } from "../../configs/echarts-3Dpie"
import useChartRender from "@/hooks/use-chart-render"
import ChartRender from "@/components/chart-render"
import LNCommonBox from "../common-box"
import CompanyList from "./company"
import { validResErr } from "@/utils/util-funs"

const colorList = [
  { subColor: "rgba(130, 255, 77, 0.5)", main: "rgba(130, 255, 77, 1)" },
  { subColor: "rgba(229, 191, 10, 0.5)", main: "rgba(229, 191, 10, 1)" },
  { subColor: "rgba(74, 161, 243, 0.5)", main: "rgba(74, 161, 243, 1)" },
  { subColor: "rgba(39, 239, 237, 0.5)", main: "rgba(39, 239, 237, 1)" },
  { subColor: "rgba(88, 99, 205, 0.5)", main: "rgba(88, 99, 205, 1)" },
  { subColor: "rgba(88, 99, 205, 0.2)", main: "rgba(88, 99, 205, 0.5)" },
  { subColor: "rgba(39, 239, 237, 0.2)", main: "rgba(39, 239, 237, 0.5)" },
]
export default function LNBrand(props) {
  const [reload, setReload] = useRefresh(MS_HOUR)
  const [wtData, setWtDate] = useState<IBrandData[]>([])
  const [pvinvData, setPvinvData] = useState<IBrandData[]>([])
  const [chartData, setChartData] = useState({
    pieData: [],
    screenWidth: 5440,
    internalDiameterRatio: 0.8,
    type: "wt",
  })
  const [pvchartData, setPvChartData] = useState({
    pieData: [],
    screenWidth: 5440,
    internalDiameterRatio: 0.8,
    type: "pvinv",
  })
  const { chartRef, chartOptions } = useChartRender(chartData, getPie3D)
  const { chartRef: pvRef, chartOptions: pvChartOptions } = useChartRender(pvchartData, getPie3D)
  const initData = async () => {
    const res = await doBaseServer("queryBrand")
    setReload(false)
    if (validResErr(res)) return

    const wtData: IBrandData[] = Object.values(res?.["wt"] || {})
    const actualWt: IBrandData[] = wtData?.map((i, idx) => {
      return {
        ...i,
        name: i.manufacturer,
        value: parseInt(i.deviceQuantity),
        color: colorList?.[idx]?.main,
        subColor: colorList?.[idx]?.subColor,
      }
    })

    const pvData: IBrandData[] = Object.values(res?.["pvinv"] || {})
    const actualPvData: IBrandData[] = pvData?.map((i, idx) => {
      return {
        ...i,
        name: i.manufacturer,
        value: parseInt(i.deviceQuantity),
        color: colorList?.[idx]?.main,
        subColor: colorList?.[idx]?.subColor,
      }
    })

    setWtDate(actualWt)
    setPvinvData(actualPvData)
    setChartData((prev) => {
      return {
        ...prev,
        pieData: actualWt,
      }
    })
    setPvChartData((prev) => {
      return {
        ...prev,
        pieData: actualPvData,
      }
    })
  }
  useEffect(() => {
    if (!reload) return
    initData()
  }, [])
  return (
    <LNCommonBox title="品牌占比">
      <div className="ln-brand">
        <div className="ln-brand-item" key="wt">
          <div className="ln-item-type">风机</div>
          <ChartRender ref={chartRef} option={chartOptions} />
          <CompanyList list={wtData} type="wt" />
        </div>
        <div className="ln-brand-item" key="pvinv">
          <div className="ln-item-type">光伏</div>
          <ChartRender ref={pvRef} option={pvChartOptions} />
          <CompanyList list={pvinvData} type="pvinv" />
        </div>
      </div>
    </LNCommonBox>
  )
}
