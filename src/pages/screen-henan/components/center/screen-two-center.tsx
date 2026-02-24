import "./screen-two-center.less"
import { getScreenPointData } from "@/utils/screen-funs"

import { useEffect, useState } from "react"
import { useRefresh } from "@/hooks/use-refresh"
import HnQtBtm from "./bottom"
import HNCenterTop from "./top"
import HnQtBox from "./qt-box"
import { IGroupType } from "@/types/i-screen"
import LargeScreenContext from "@/contexts/screen-context"
import HnDayLoad from "../day-load"
export default function Hn2Center() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  return (
    <div className="hn-screen-center2">
      <LargeScreenContext.Provider value={{ quotaInfo, setQuotaInfo }}>
        <div className="hn-sct-top">
          <HNCenterTop />
        </div>
        <HnQtBox />
        <div className="hn-sct-btm">
          <HnDayLoad />
        </div>
      </LargeScreenContext.Provider>
    </div>
  )
}
