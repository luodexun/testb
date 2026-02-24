/*
 * @Author: chenmeifeng
 * @Date: 2024-12-30 15:38:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-30 17:39:57
 * @Description:
 */
import "./right.less"
import { QUOTA_LIST_TWO } from "../../configs"
import { judgeNull } from "@/utils/util-funs"

export default function CpctRight(props) {
  const { quotaInfo } = props
  return (
    <div className="cpct-right">
      {QUOTA_LIST_TWO.map((i) => {
        return (
          <div className="cpct-right-item" key={i.key}>
            <div className="item-icon">
              <i className={`icon ${i.icon}`}></i>
            </div>
            <span className="name">{i.name}</span>
            <div className="item-right">
              <span className="value">{judgeNull(quotaInfo?.[i.key], 1, 2, "-")}</span>
              <span className="unit">{i.unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
