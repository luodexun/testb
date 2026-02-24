/*
 * @Author: chenmeifeng
 * @Date: 2024-06-18 11:27:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-14 16:45:36
 * @Description: 实时功率
 */
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"

import { dayH2Mi } from "@/configs/time-constant"
import { getStartAndEndTime } from "@/utils/form-funs"
import { parseNum, uDate, validResErr } from "@/utils/util-funs"
import { doBaseServer } from "@/api/serve-funs"
interface IOption {
  time?: number
  value?: number
}
interface IData {
  AGCActivePowerOrderBySchedule?: Array<IOption>
  realTimeTotalActivePowerOfSubStation?: Array<IOption>
  shortPredPower?: Array<IOption>
  activePower?: Array<IOption>
  availablePower?: Array<IOption>
  AGCAvailablePower?: Array<IOption>
}
interface IProps {
  reload?: number
}
export default function usePredictPowerScreen(props: IProps) {
  const { reload = 5 * 60 * 1000 } = props
  const timer = useRef(null)
  const isFirst = useRef(true)
  const [dataMap, setDataMap] = useState<IData>()
  const [allData, setAllData] = useState([])
  const initChartData = async () => {
    const startOfDay = dayjs().startOf("day")
    const endOfDay = startOfDay
    const { startTime, endTime } = getStartAndEndTime<number>([startOfDay as any, endOfDay as any], "", {
      startTime: 1,
      endTime: 1,
    })
    const res = await doBaseServer("getCenterTrend", { startTime, endTime })
    if (validResErr(res)) return
    isFirst.current = true
    // const Time = res?.map((i) => uDate(new Date(i.forecastTime).valueOf(), dayH2Mi))
    // const Time = res?.map((i) => i.time)
    const AGCActivePowerOrderBySchedule =
      res?.["AGCActivePowerOrderBySchedule"]?.map((i) => [i.time, parseNum(i.value, 3, null)]) || []
    const realTimeTotalActivePowerOfSubStation =
      res?.["realTimeTotalActivePowerOfSubStation"]?.map((i) => [i.time, parseNum(i.value, 3, null)]) || []
    const shortPredPower =
      res?.["shortPredPower"]?.map((i) => [i.time, i.value ? parseNum(i.value / 1000, 3, null) : null]) || []
    const activePower =
      res?.["activePower"]?.map((i) => [i.time, i.value ? parseNum(i.value / 1000, 3, null) : null]) || []
    const availablePower =
      res?.["availablePower"]?.map((i) => [i.time, i.value ? parseNum(i.value / 1000, 3, null) : null]) || []
    const AGCAvailablePower = res?.["AGCAvailablePower"]?.map((i) => [
      i.time,
      i.value ? parseNum(i.value, 3, null) : null,
    ])
    setDataMap({
      AGCActivePowerOrderBySchedule,
      realTimeTotalActivePowerOfSubStation,
      shortPredPower,
      activePower,
      availablePower,
      AGCAvailablePower,
    })
    setAllData(res)
    // setxAxis([...Time])
  }

  useEffect(() => {
    clearInterval(timer.current)
    if (isFirst.current) {
      isFirst.current = false
      initChartData()
      setTimeout(() => {
        timer.current = setInterval(() => {
          initChartData()
        }, reload)
      }, 300)
    }
    return () => clearInterval(timer.current)
  }, [])

  return { dataMap, allData }
}
