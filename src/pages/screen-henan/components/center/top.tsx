/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 10:34:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 15:04:44
 * @Description: 河南大屏中间
 */
import LargeScreenContext from "@/contexts/screen-context"
import { CENTER_QUOTA_LEFT, CENTER_QUOTA_RIGHT } from "../../configs"
import HnQuotaBox from "../common-quota-box"
import MapSiteProvic from "./center-map"
import "./top.less"
import { useContext } from "react"
export default function HNCenterTop() {
  const { quotaInfo } = useContext(LargeScreenContext)
  return (
    <div className="hn-sct-com">
      <div className="hn-qt-list">
        {CENTER_QUOTA_LEFT?.map((i) => {
          return <HnQuotaBox key={i.key} title={i.name} value={quotaInfo?.[i.key] / (i.caculate || 1)} unit={i.unit} />
        })}
      </div>
      <div className="hn-map">
        <MapSiteProvic />
      </div>
      <div className="hn-qt-list">
        {CENTER_QUOTA_RIGHT?.map((i) => {
          return <HnQuotaBox key={i.key} title={i.name} value={quotaInfo?.[i.key]} unit={i.unit} />
        })}
      </div>
    </div>
  )
}
