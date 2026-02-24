/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 15:40:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-16 15:43:20
 * @Description: 广东大屏-预测电量
 */
import "./brand-rate.less"

import { useContext, useEffect, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"

// import { echartsLineColor, SELECTOPTION } from "../configs"
import { brand2DPie } from "../../configs/brand-2d-pie"
import { IBrandData } from "../../types"
import HB1CommonBox from "../common-box"
import LargeScreenContext from "@/contexts/screen-context"
const color = [
  "RGBA(8, 162, 255, 1)",
  "RGBA(209, 86, 255, 1)",
  "RGBA(255, 162, 243, 1)",
  "RGBA(255, 243, 166, 1)",
  "RGBA(254, 194, 109, 1)",
  "RGBA(208, 252, 197, 1)",
  "RGBA(15, 253, 253, 1)",
  "RGBA(69, 113, 255, 1)",
]
interface IBrandTypeList {
  product: string
  wt?: number
  pvinv?: number
  espcs?: number
}
export default function HBBrandRata() {
  const [chartData, setChartData] = useState(null)
  // const allSource = useRef([])
  const { quotaInfo } = useContext(LargeScreenContext)

  const initData = async () => {
    let res
    let wtData: IBrandData[], pvData: IBrandData[], esData: IBrandData[]
    if (quotaInfo?.modelData && !quotaInfo?.modelData?.useInterfaceData) {
      const data = quotaInfo?.modelData.data
      wtData = data?.["wt"] || []
      pvData = data?.["pvinv"] || []
      esData = data?.["espcs"] || []
    } else {
      res = await doBaseServer("queryBrand")
      wtData = Object.values(res?.["wt"] || {})
      pvData = Object.values(res?.["pvinv"] || {})
      esData = Object.values(res?.["espcs"] || {})
    }
    // const res = {
    //   wt: [
    //     { manufacturer: "快解放昆仑山", deviceQuantity: 12 },
    //     { manufacturer: "快解放昆仑山2", deviceQuantity: 12 },
    //     { manufacturer: "快解放昆仑山3", deviceQuantity: 12 },
    //   ],
    //   pvinv: [
    //     { manufacturer: "快解仑山", deviceQuantity: 12 },
    //     { manufacturer: "快解2", deviceQuantity: 12 },
    //     { manufacturer: "ghjj", deviceQuantity: 12 },
    //   ],
    //   espcs: [
    //     { manufacturer: "快解仑山", deviceQuantity: 12 },
    //     { manufacturer: "快2sdfsdfsfgh", deviceQuantity: 12 },
    //     { manufacturer: "lyutyu", deviceQuantity: 12 },
    //   ],
    // }

    const source = dealSource({ wtData, pvData, esData, allSource: res })

    setChartData(() => {
      const wtInfo = commonDeal(wtData)
      const pvInfo = commonDeal(pvData)
      const esInfo = commonDeal(esData)
      return {
        screenWidth: 4480 || window.innerWidth,
        wtInfo,
        pvInfo,
        esInfo,
        source,
      }
    })
  }
  const dealSource = ({ wtData, pvData, esData, allSource }) => {
    let arr: IBrandTypeList[] = []
    arr =
      wtData?.map((i) => {
        return {
          product: i.manufacturer,
          wt: parseInt(i.deviceQuantity),
          pvinv: 0,
          espcs: 0,
        }
      }) || []
    pvData.forEach((i) => {
      const info = arr.find((item) => item.product === i.manufacturer)
      if (info) {
        info.pvinv = parseInt(i.deviceQuantity)
      } else {
        arr.push({ product: i.manufacturer, wt: 0, pvinv: parseInt(i.deviceQuantity), espcs: 0 })
      }
    })
    esData.forEach((i) => {
      const info = arr.find((item) => item.product === i.manufacturer)
      if (info) {
        info.espcs = parseInt(i.deviceQuantity)
      } else {
        arr.push({ product: i.manufacturer, wt: 0, pvinv: 0, espcs: parseInt(i.deviceQuantity) })
      }
    })
    // let arr = Object.keys(allSource)?.reduce((prev, cur) => {
    //   allSource[cur] =
    // }, [])
    // console.log(arr, "source")
    return arr
  }
  const commonDeal = (data) => {
    const res = data?.map((i, idx) => {
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
    return res
  }
  useEffect(() => {
    initData()
  }, [])
  const { chartRef, chartOptions } = useChartRender(chartData, brand2DPie)
  return (
    <HB1CommonBox headerName="装机容量品牌占比" headerType="book" className="nhb-brand">
      <ChartRender ref={chartRef} option={chartOptions} />
    </HB1CommonBox>
  )
}
