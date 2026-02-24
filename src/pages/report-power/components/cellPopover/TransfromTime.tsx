/*
 * @Author: chenmeifeng
 * @Date: 2024-12-23 11:36:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-31 17:45:13
 * @Description:
 */
import { useEffect, useRef, useState } from "react"
import { IRpPowerData, IRpPowerSchForm } from "../../types"
import dayjs from "dayjs"
import { getStartAndEndTime } from "@/utils/form-funs"
import { getCompareList } from "../../methods"
import { judgeNull, vDate } from "@/utils/util-funs"
import { Spin } from "antd"
interface IProps {
  record: IRpPowerData
  nameKey: string
  saveFormData: IRpPowerSchForm
  rate: number
}
interface ICompare {
  curKeyLastYear: number
  curKeyLastYearRate: number
  curKeyLastMonth: number
  curKeyLastMonthRate: number
}
export default function GetTransfromTime(props: IProps) {
  const { record, nameKey, saveFormData, rate = 1 } = props
  const curTime = useRef(record.Time)
  if (!saveFormData) return <div></div>
  const isFirst = useRef(true)
  const { groupByTime, dateRange } = saveFormData
  const [compareData, setCompareData] = useState<ICompare>(null)
  const initData = async () => {
    let lastYearSameStime, lastYearSameEtime, lastMonthSameStime, lastMonthSameEtime // 同比开始，同比结束，环比开始，环比结束
    // 维度为日：获取同比、环比
    if (groupByTime === "1d") {
      // 获取去年同一天的时间
      lastYearSameStime = lastYearSameEtime = dayjs(curTime.current).subtract(1, "year")
      // lastYearSameEtime = dayjs(curTime.current).subtract(1, "year")
      // 获取上个月同一时间
      lastMonthSameStime = lastMonthSameEtime = dayjs(curTime.current).subtract(1, "month")
      // lastMonthSameEtime = dayjs(curTime.current).subtract(1, "month")
    } else if (groupByTime === "1mo") {
      // 获取当前月份的第一天
      const startOfCurrentMonth = dayjs(curTime.current).startOf("month")

      // 获取当前月份的最后一天
      const endOfCurrentMonth = dayjs(curTime.current).endOf("month")
      // 获取去年同一月的时间
      lastYearSameStime = startOfCurrentMonth.subtract(1, "year")
      lastYearSameEtime = endOfCurrentMonth.subtract(1, "year")
      // 获取上个月同一时间
      lastMonthSameStime = startOfCurrentMonth.subtract(1, "month")
      lastMonthSameEtime = endOfCurrentMonth.subtract(1, "month")
    } else if (groupByTime === "1y") {
      lastYearSameStime = lastMonthSameStime = dayjs(curTime.current).subtract(1, "year").startOf("year")
      lastYearSameEtime = lastMonthSameEtime = dayjs(curTime.current).subtract(1, "year").endOf("year")
    } else {
      const [startTime, endTime] = dateRange
      lastYearSameStime = startTime.subtract(1, "year")
      lastYearSameEtime = endTime.subtract(1, "year")
      lastMonthSameStime = startTime.subtract(1, "month")
      lastMonthSameEtime = endTime.subtract(1, "month")
    }
    const formData = { ...saveFormData, dateRange: [lastYearSameStime, lastYearSameEtime] } // 同比
    const formData1 = { ...saveFormData, dateRange: [lastMonthSameStime, lastMonthSameEtime] } // 环比
    const lastYearData = await getCompareList(record, formData as IRpPowerSchForm) // 同比
    const lastMonthData = await getCompareList(record, formData1 as IRpPowerSchForm) // 环比
    // console.log(lastYearData?.[nameKey], record?.[nameKey], nameKey)

    setCompareData({
      curKeyLastYear: lastYearData?.[nameKey], // 同比值
      curKeyLastYearRate: record?.[nameKey] / lastYearData?.[nameKey] - 1, // 同比增长率
      curKeyLastMonth: lastMonthData?.[nameKey], // 环比值
      curKeyLastMonthRate: record?.[nameKey] / lastMonthData?.[nameKey] - 1, // 环比增长率
    })
  }
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      initData()
    }
  }, [])
  return (
    <div className="tranform-time">
      <Spin spinning={!!!compareData}>
        <p>同比值：{judgeNull(compareData?.curKeyLastYear, rate, 2, "-")}</p>
        <p>同比增长率(%)：{judgeNull(compareData?.curKeyLastYearRate, 0.01, 2, "-")}</p>
        <p>环比值：{judgeNull(compareData?.curKeyLastMonth, rate, 2, "-")}</p>
        <p>环比增长率(%)：{judgeNull(compareData?.curKeyLastMonthRate, 0.01, 2, "-")}</p>
      </Spin>
    </div>
  )
}
