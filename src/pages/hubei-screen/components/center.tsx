/*
 * @Author: chenmeifeng
 * @Date: 2024-03-25 17:35:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-14 10:42:28
 * @Description: 大屏中间
 */
import "./center.less"

import { useState } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"
import TypeQuota from "@/pages/hb-new-screen/components/center/center-bottom"
import MapSiteProvic from "@/pages/hb-new-screen/components/center/center-map"

import { IGroupType } from "../types"
// import MapSiteProvic from "./center-map"
import CenterTopBox from "./center-top"
export default function CenterContent() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const [currentMode, setCurrentMode] = useState<IGroupType>("REGION_COM_ID")
  return (
    <div className="hb-center">
      <HbScreenContext.Provider value={{ quotaInfo, setQuotaInfo, currentMode, setCurrentMode }}>
        <div className="map-top">
          <CenterTopBox />
        </div>
        <div className="map-center">
          <MapSiteProvic large={false} />
        </div>
        <div className="map-bottom">
          <TypeQuota />
        </div>
      </HbScreenContext.Provider>
    </div>
  )
}
