/*
 *@Author: chenmeifeng
 *@Date: 2023-11-10 10:04:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-13 13:52:48
 *@Description: 卡片信息
 */
import "./card-info.less"

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"

import { CARD_INFO } from "../configs"
interface Iprops {
  data?: any
}
export default function CardInfo(props: Iprops) {
  const { data } = props
  return (
    <div className="card-info-wrap">
      {CARD_INFO.map(({ title, field, icon }) => (
        <div key={title} className="item">
          <span className="img">
            <img src={icon} alt="" />
          </span>
          <span className="info">
            <span className="title">{title}</span>
            <span className="value">{data?.[field] || 0}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
