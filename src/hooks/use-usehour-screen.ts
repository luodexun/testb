/*
 * @Author: chenmeifeng
 * @Date: 2024-06-20 09:46:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 11:33:18
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { judgeNull, validResErr } from "@/utils/util-funs"
import { useEffect, useRef, useState } from "react"
import { useRefresh } from "./use-refresh"
interface IProps {
  stnType?: string
  valkey?: string // 默认返回的数据数组，默认的排序属性key
  reloadTime?: number
  isStart?: boolean
  sort?: "toBig" | "toSmall"
}
export default function useHourScreen(props: IProps) {
  const {
    stnType = "STATION_CODE",
    valkey = "yearlyUtilizationHour",
    reloadTime = 60 * 60 * 1000,
    isStart = true,
    sort = "toBig",
  } = props
  // const reload = useRef(60 * 60 * 1000) //1h
  const timer = useRef(null)
  const isFirst = useRef(true)
  const [series, setSeries] = useState([])
  const [xAxis, setxAxis] = useState([])
  const [allData, setAllData] = useState([])
  const [reload, setReload] = useRefresh(reloadTime)
  // const sd = [1, 2, 3, 4, 5, 6, 7]
  // const dff = [2, 3, 4, 5, 6, 7, 9, 8, 2, 4]
  // const tests = [
  //   {
  //     regionComShortName: "1",
  //     maintenanceComFullName: "34",
  //     stationShortName: "sdf",
  //     yearlyProduction: 12,
  //     dailyProduction: 34,
  //     yearlyUtilizationHour: 23,
  //   },
  //   {
  //     regionComShortName: "1",
  //     maintenanceComFullName: "89",
  //     stationShortName: "sdf1",
  //     yearlyProduction: 12,
  //     dailyProduction: 36,
  //     yearlyUtilizationHour: 25,
  //   },
  //   {
  //     regionComShortName: "1",
  //     maintenanceComFullName: "34",
  //     stationShortName: "sdf2",
  //     yearlyProduction: 1,
  //     dailyProduction: 38,
  //     yearlyUtilizationHour: 22,
  //   },
  //   {
  //     regionComShortName: "1",
  //     maintenanceComFullName: "34",
  //     stationShortName: "sdf3",
  //     yearlyProduction: 23,
  //     dailyProduction: 39,
  //     yearlyUtilizationHour: 4,
  //   },
  //   {
  //     regionComShortName: "1",
  //     maintenanceComFullName: "34",
  //     stationShortName: "sdf4",
  //     yearlyProduction: 34,
  //     dailyProduction: 34,
  //     yearlyUtilizationHour: 2,
  //   },
  //   {
  //     regionComShortName: "1",
  //     maintenanceComFullName: "34",
  //     stationShortName: "sdf5",
  //     yearlyProduction: 4,
  //     dailyProduction: 34,
  //     yearlyUtilizationHour: 12,
  //   },
  // ]
  const count = useRef(0)
  const getScreenPointData = async (name = "STATION_CODE") => {
    const res = await doBaseServer("getScreenPoint", { groupByPath: stnType })
    setReload(false)
    isFirst.current = true
    const valid = validResErr(res)
    if (valid) return
    const result = res?.sort((a, b) => {
      const resSort = sort === "toSmall" ? b[valkey] - a[valkey] : a[valkey] - b[valkey]
      return resSort
    })
    setAllData(() => [...result])
    setSeries(() => [...result?.map((i) => judgeNull(i[valkey]))] || [])
    const xAxisData =
      result?.map((i) =>
        stnType === "REGION_COM_ID"
          ? i.regionComShortName
          : stnType === "MAINTENANCE_COM_ID"
            ? i.maintenanceComFullName
            : i.stationShortName,
      ) || []
    setxAxis(() => [...xAxisData])
  }

  useEffect(() => {
    setReload(true)
  }, [stnType])
  useEffect(() => {
    if (reload && isStart) {
      getScreenPointData()
    }
  }, [stnType, isStart, reload])

  return { series, xAxis, allData }
}
