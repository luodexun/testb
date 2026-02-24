/*
 * @Author: chenmeifeng
 * @Date: 2024-03-25 17:35:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-06 14:08:58
 * @Description: 大屏中间
 */
import "./center.less"

import { useState } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"

import { IGroupType } from "@pages/hb-new-screen/types"
import TypeQuota from "@pages/hb-new-screen/components/center/center-bottom"
import MapSiteProvic from "./center-map"
import CenterTopBox from "@pages/hb-new-screen/components/center/center-top"
export default function CenterContent() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const [currentMode, setCurrentMode] = useState<IGroupType>("REGION_COM_ID")
  return (
    <div className="nhb-center">
      <HbScreenContext.Provider value={{ quotaInfo, setQuotaInfo, currentMode, setCurrentMode }}>
        <div className="nhb-map-top">
          <CenterTopBox />
        </div>
        <div className="nhb-map-center">
          <MapSiteProvic />
        </div>
        <div className="nhb-map-bottom">
          <TypeQuota />
        </div>
      </HbScreenContext.Provider>
    </div>
  )
}
