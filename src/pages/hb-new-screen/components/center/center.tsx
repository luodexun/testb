/*
 * @Author: chenmeifeng
 * @Date: 2024-03-25 17:35:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-16 13:51:43
 * @Description: 大屏中间
 */
import "./center.less"

import { useState } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"

import { IGroupType } from "../../types"
import TypeQuota from "./center-bottom"
import MapSiteProvic from "./center-map"
import CenterTopBox from "./center-top"
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
