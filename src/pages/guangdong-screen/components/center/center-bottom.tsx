/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 13:52:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-16 14:35:20
 * @Description: 广东大屏-中间下边模块
 */
import "./center-bottom.less"

import { useContext, useRef } from "react"

import ScreenQuotaItem from "@/components/screen-quota-item"

import { mapTypeQuota } from "../../configs"
import HbScreenContext from "@/contexts/hubei-screen-context"
export default function GDTypeQuota(props) {
  const { quotaInfo } = useContext(HbScreenContext)
  const typeList = useRef(mapTypeQuota)
  return (
    <div className="gd-map-quota">
      {typeList.current.map((i) => {
        return (
          <div className="btm-quota-item" key={i.key}>
            <div className="btm-item-top">
              <i className={`type-${i.key}`}></i>
              <span className="name">{i.name}</span>
            </div>
            <div className="btm-item-list">
              {i.children.map((item) => {
                return <ScreenQuotaItem key={item.key} name={item.name} value={quotaInfo?.[item.key]} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
