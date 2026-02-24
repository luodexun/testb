/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 13:51:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-19 15:41:00
 * @Description:
 */
import "./center.less"

import { useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { getStationType } from "@/utils/device-funs"
import { validResErr } from "@/utils/util-funs"

// import { IGroupType } from "../types"
import TypeQuota from "./center-bottom"
import MapSiteProvic from "./map"
import CenterTopBox from "./center-top"
import { IGroupType } from "@/types/i-screen"
import HbScreenContext from "@/contexts/hubei-screen-context"
export default function GDCenterContent(props) {
  const { province = "guangdong" } = props
  const [quotaInfo, setQuotaInfo] = useState(null)
  const [currentMode, setCurrentMode] = useState<IGroupType>("REGION_COM_ID")
  return (
    <div className="gd-center">
      <HbScreenContext.Provider value={{ quotaInfo, setQuotaInfo, currentMode, setCurrentMode }}>
      <div className="map-top">
        <CenterTopBox />
      </div>
      <div className="map-center">
        <MapSiteProvic />
      </div>
      <div className="map-bottom">
        <TypeQuota />
      </div>
      </HbScreenContext.Provider>
    </div>
  )
}
