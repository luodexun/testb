/*
 * @Author: xiongman
 * @Date: 2023-09-07 15:32:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-05 17:02:30
 * @Description: 头部时钟组件
 */

import "./head-clock.less"

import { day4YDot2S } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { uDate } from "@utils/util-funs.tsx"
import { useEffect, useRef, useState } from "react"
export default function HeadClock() {
  // const [reload, setReload] = useRefresh(1000)
  const [clock, setClock] = useState<string>(uDate("", day4YDot2S))
  const intervals = useRef(null)
  useEffect(() => {
    setClock(uDate("", day4YDot2S))
    intervals.current = setInterval(() => {
      setClock(uDate("", day4YDot2S))
    }, 1000)
    return () => clearInterval(intervals.current)
  }, [])

  return <div className="head-clock-wrap" children={clock} />
}
