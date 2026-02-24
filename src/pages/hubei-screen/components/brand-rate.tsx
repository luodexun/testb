/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 11:15:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-23 17:24:19
 * @Description:品牌占比
 */
import "./brand-rate.less"

import { useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"

import { brand2DPie } from "../configs/brand-2d-pie"
import { getPie3D } from "../configs/brand-3d-pie"
import { IBrandData } from "../types"
import HBCommonTitle from "./common-title"
const color = ["#139CFF", "#28C648", "#6DEBDF", "#B177F0"]
const optionData = [
  {
    value: 26,
    name: "综合",
    itemStyle: {
      color: "#139CFF",
    },
  },
  {
    value: 50,
    name: "好地方",
    itemStyle: {
      color: "#139CFC",
    },
  },
  {
    value: 9,
    name: "儿童",
    itemStyle: {
      color: "#28C648",
    },
  },
  {
    value: 12,
    name: "妇女",
    itemStyle: {
      color: "#6DEBDF",
    },
  },
  {
    value: 18,
    name: "特殊群体",
    itemStyle: {
      color: "#B177F0",
    },
  },
]
export default function BrandRate() {
  const [wtChartData, setWtChartData] = useState({
    pieData: [],
    internalDiameterRatio: 0.5,
    name: "风机",
    screenWidth: 4480 || window.innerWidth,
  })
  const [pvChartData, setPvChartData] = useState({
    pieData: [],
    internalDiameterRatio: 0.5,
    name: "光伏",
    screenWidth: 4480 || window.innerWidth,
  })
  const [esChartData, setEsChartData] = useState({
    pieData: [],
    internalDiameterRatio: 0.5,
    name: "储能",
    screenWidth: 4480 || window.innerWidth,
  })
  const { chartRef, chartOptions } = useChartRender(wtChartData, brand2DPie)
  const { chartRef: pvRef, chartOptions: pvOption } = useChartRender(pvChartData, brand2DPie)
  const { chartRef: esRef, chartOptions: esOption } = useChartRender(esChartData, brand2DPie)

  const initData = async () => {
    const res = await doBaseServer("queryBrand")
    const wtData: IBrandData[] = Object.values(res?.["wt"] || {})
    const pvData: IBrandData[] = Object.values(res?.["pvinv"] || {})
    const esData: IBrandData[] = Object.values(res?.["espcs"] || {})

    setWtChartData((prev) => {
      prev = commonDeal(prev, wtData)
      return { ...prev }
    })
    setPvChartData((prev) => {
      prev = commonDeal(prev, pvData)
      return { ...prev }
    })
    setEsChartData((prev) => {
      prev = commonDeal(prev, esData)
      return { ...prev }
    })
  }
  const commonDeal = (prev, data) => {
    prev.pieData = data?.map((i, idx) => {
      const deviceCapacity = i.deviceCapacity / 10000
      const capacityCent = i.capacityCent * 100
      return {
        ...i,
        deviceCapacity,
        capacityCent,
        value: parseInt(i.deviceQuantity),
        name: i.manufacturer,
        itemStyle: {
          color: color[idx] || "#B177F0",
        },
      }
    })
    return prev
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="screen-box brand">
      <HBCommonTitle title="品牌占比" />
      <div className="brand-chart">
        <div className="chart-3d">
          <ChartRender ref={chartRef} empty option={chartOptions} />
        </div>
        <div className="chart-3d">
          <ChartRender ref={pvRef} empty option={pvOption} />
        </div>
        <div className="chart-3d">
          <ChartRender ref={esRef} empty option={esOption} />
        </div>
      </div>
    </div>
  )
}
