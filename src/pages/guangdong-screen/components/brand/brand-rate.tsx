/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 10:53:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-13 16:14:48
 * @Description: 广东大屏-品牌占比
 */
import "./brand-rate.less"

import { useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { validResErr } from "@/utils/util-funs.tsx"

import { BRAND_RATE_OPTION, brandBarStyle } from "../../configs/index.ts"
import { lineOrBarOption } from "../../configs/day-load-trend.tsx"
import { IBrandData } from "../../types.ts/index.ts"
import ComRadioClk from "../common-radio.tsx"
import HBCommonTitle from "../common-title.tsx"

export default function GDBrandRate() {
  const [chartData, setChartData] = useState(null)
  const [currentIdx, setCurrentIdx] = useState("wt")
  const [brandList, setbrandList] = useState(null)
  const initData = async () => {
    const res = await doBaseServer("queryBrand")
    if (validResErr(res)) return
    const wt: IBrandData[] = Object.values(res?.["wt"] || {})
    const pvinv: IBrandData[] = Object.values(res?.["pvinv"] || {})
    const espcs: IBrandData[] = Object.values(res?.["espcs"] || {})
    setbrandList({ wt, pvinv, espcs })
  }
  const initChartData = async () => {
    const oneTypeList = brandList?.[currentIdx] || []
    const data = oneTypeList?.map((i) => i.deviceQuantity)
    const name = oneTypeList?.map((i) => i.manufacturer)
    setChartData({
      series: [
        {
          // name: "品牌占比",
          type: "bar",
          barWidth: 20,
          ...brandBarStyle,
          data: data || [1, 2, 3, 4, 6, 3],
        },
      ],
      xAxis: name || [],
      screenWidth: window.innerWidth,
      isBrand: true,
      listData: oneTypeList.map((i) => {
        return {
          ...i,
          deviceCapacity: i.deviceCapacity / 10000,
          capacityCent: i.capacityCent * 100,
        }
      }),
      yUnit: "台数",
      axisLabel: {
        interval: 0,
      },
    })
  }
  useEffect(() => {
    initData()
  }, [])
  useEffect(() => {
    initChartData()
  }, [currentIdx, brandList])
  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)
  return (
    <div className="screen-box gd-brand">
      <HBCommonTitle title="品牌占比" children={<ComRadioClk options={BRAND_RATE_OPTION} onChange={setCurrentIdx} />} />
      <div className="screen-box-content">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
