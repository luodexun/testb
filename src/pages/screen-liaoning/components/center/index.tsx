/*
 * @Author: chenmeifeng
 * @Date: 2024-06-28 15:23:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-02 15:26:20
 * @Description: 大屏中间
 */
import { getScreenPointData } from "@/utils/screen-funs"
import "./index.less"
import JsCenterLeft from "./left"
import HbScreenContext from "@/contexts/hubei-screen-context"
import { useEffect, useRef, useState } from "react"
import JsCenterRight from "./right"
import JsCenterMap from "./map"
export default function LNCenter() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const timer = useRef(null)
  const timeout = useRef(3000) // 3s
  // const getMainInfo = async () => {
  //   const mainInfo = await getScreenPointData()
  //   if (!mainInfo) return
  //   setQuotaInfo(mainInfo)
  // }
  // const cancelMainMap = () => {
  //   clearInterval(timer.current)
  //   getMainInfo()
  //   timer.current = setInterval(() => {
  //     getMainInfo()
  //   }, timeout.current)
  // }
  // useEffect(() => {
  //   cancelMainMap()
  //   return () => {
  //     clearInterval(timer.current)
  //   }
  // }, [])
  return (
    <HbScreenContext.Provider value={{ quotaInfo, setQuotaInfo }}>
      <div className="ln-center">
        <div className="ln-center-map">
          <JsCenterMap />
        </div>
        <div className="ln-center-right">
          <JsCenterRight />
        </div>
      </div>
    </HbScreenContext.Provider>
  )
}
