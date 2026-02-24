/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 15:46:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-17 14:28:43
 * @Description: 云南头部
 */
import "./index.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { day4YDot2S } from "@/configs/time-constant"
import { uDate } from "@/utils/util-funs"
import { useRefresh } from "@/hooks/use-refresh"
export default function LNHeader() {
  const [reload, setReload] = useRefresh(1000)
  const [clock, setClock] = useState<string>(uDate("", day4YDot2S))
  const [securityDay, setSecurityDay] = useState("0")

  const navigate = useNavigate()
  const changeShow = () => {
    navigate("/")
  }
  const daysFromNow = (year, month, day) => {
    const now = new Date()
    const targetDate = new Date(year, month - 1, day)
    const timeDifference = (now as any) - (targetDate as any)
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference
  }
  const transNum = useRef((value) => {
    if (!value) return ["-"]
    const VirVal = value.toString()
    return VirVal.split("")
  })
  useEffect(() => {
    // 安全运行天数开始日期
    const days = daysFromNow(2024, 1, 1)
    setSecurityDay(days.toString())
  }, [])
  useEffect(() => {
    if (!reload) return
    setClock(uDate("", day4YDot2S))
    setReload(false)
  }, [reload])
  return (
    <div className="ln-header">
      <div className="ln-header-center">
        <span className="left">{clock.split(" ")[0]}</span>
        <span className="center" onClick={changeShow}>
          东北新能源智慧运营中心
        </span>
        <span className="right">{clock.split(" ")[1]}</span>
      </div>
      {/* <div className="security-day">
        <span className="scrt-name">安全运行天数</span>
        <div className="scrt-val">
          {transNum.current(securityDay)?.map((i, idx) => {
            return (
              <span key={idx} className="scrt-vitem">
                {i}
              </span>
            )
          })}
        </div>
        <span className="scrt-name">天</span>
      </div> */}
    </div>
  )
}
