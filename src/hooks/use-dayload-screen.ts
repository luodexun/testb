/*
 * @Author: chenmeifeng
 * @Date: 2024-06-18 11:27:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-22 17:19:40
 * @Description: 日负荷公用
 */
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"

import { dayH2Mi } from "@/configs/time-constant"
import { echartsLineColor } from "@/pages/hb-new-screen/configs"
import { getPowerInfo } from "@/pages/hb-new-screen/methods"
import { getStartAndEndTime } from "@/utils/form-funs"
import { parseNum, uDate } from "@/utils/util-funs"
import { useRefresh } from "./use-refresh"
interface IProps {
  stnCode: string
  reload: number
  isStaticInfo?: boolean
  staticInfo?: any
  screenName?: string
}
export default function useDayloadScreen(props: IProps) {
  const { stnCode, reload, isStaticInfo, staticInfo, screenName } = props
  const [refresh, setRefresh] = useRefresh(reload)
  const [series, setSeries] = useState([])
  const [xAxis, setxAxis] = useState([])
  const [allData, setAllData] = useState([])
  const initChartData = async () => {
    const startOfDay = dayjs().startOf("day")
    const endOfDay = startOfDay
    const { startTime, endTime } = getStartAndEndTime<number>([startOfDay as any, endOfDay as any], "", {
      startTime: 1,
      endTime: 1,
    })
    let result = []
    if (!isStaticInfo) {
      const params = {
        startTime,
        endTime,
        stationCode: stnCode,
        preDays: 1,
        preQrts: screenName === "nxscreen" ? 8 : 16,
      }
      result = await getPowerInfo(params)
      setRefresh(false)
      if (!result) return
    } else {
      result = staticInfo
      console.log(result, "result")
    }

    // const actualRes = stnCode === "ALL" ? result["ALL"] : result
    // const actualRes = stnCode === "ALL" ? result["ALL"] : result
    const timeList = isStaticInfo
      ? result?.map((i) => i.forecastTime)
      : result?.map((i) => uDate(new Date(i.forecastTime).valueOf(), dayH2Mi))
    const shortPredPowerLs = result?.map((i) => parseNum(i.shortPredPower / 10000), 3) || []
    const ultraShortPredPowerLs = result?.map((i) => parseNum(i.ultraShortPredPower / 10000), 3) || []
    const agvcPowerLs = result?.map((i) => parseNum(i.agvcPower / 10), 3) || []
    const curSeries = [
      {
        ...echartsLineColor.huang,
        data: shortPredPowerLs,
        // yAxisIndex: 0,
      },
      {
        ...echartsLineColor.green,
        data: ultraShortPredPowerLs,
        // yAxisIndex: 0,
      },
      {
        ...echartsLineColor.purple,
        data: agvcPowerLs,
        // yAxisIndex: 0,
      },
    ]
    setAllData(result)
    setSeries([...curSeries])
    setxAxis([...timeList])
  }

  useEffect(() => {
    if (!refresh) return
    initChartData()
  }, [refresh])
  useEffect(() => {
    setRefresh(true)
  }, [stnCode])

  return { series, xAxis, allData }
}
