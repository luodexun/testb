/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 10:34:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-26 11:20:29
 * @Description: 河南大屏中间
 */
import { getScreenPointData } from "@/utils/screen-funs"
import "./index.less"
import { useEffect, useState } from "react"
import { useRefresh } from "@/hooks/use-refresh"
import HnQtBtm from "./bottom"
import HNCenterTop from "./top"
import LargeScreenContext from "@/contexts/screen-context"
export default function HNCenter() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  return (
    <div className="hn-screen-center">
      <LargeScreenContext.Provider value={{ quotaInfo, setQuotaInfo }}>
        <div className="hn-sct-top">
          <HNCenterTop />
        </div>
        <div className="hn-sct-bottom">
          <HnQtBtm />
        </div>
      </LargeScreenContext.Provider>
    </div>
  )
}
