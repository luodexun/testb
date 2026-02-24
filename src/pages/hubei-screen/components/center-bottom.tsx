/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 10:40:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-27 16:48:08
 * @Description: 大屏地图底部
 */
import "./center-bottom.less"

import { useRef } from "react"

import { mapTypeQuota } from "../configs"
import TypeQuotaBox from "./type-quota-box"
export default function TypeQuota() {
  const typeList = useRef(mapTypeQuota)
  return (
    <div className="hb-map-btm-quota">
      {typeList.current.map((i) => {
        return (
          <div className="btm-quota-item" key={i.key}>
            <div className="btm-item-top">
              <i className={`type-${i.key}`}></i>
              <span className="name">{i.name}</span>
            </div>
            <TypeQuotaBox list={i.children} />
          </div>
        )
      })}
    </div>
  )
}
