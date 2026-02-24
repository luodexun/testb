/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 10:33:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 15:10:02
 * @Description:
 */
import { parseNum } from "@/utils/util-funs"
import { CENTER_QUOTA_BOTTOM } from "../../configs"
import { isNullNumber } from "../../methods"
import LargeScreenContext from "@/contexts/screen-context"
import { useContext } from "react"

export default function HnQtBtm() {
  const { quotaInfo } = useContext(LargeScreenContext)
  return (
    <div className="hn-qt-btm">
      {CENTER_QUOTA_BOTTOM?.map((i) => {
        return (
          <div className="hn-qt-btm-item" key={i.key}>
            <div className="btm-top">
              {i.children?.map((child) => {
                return (
                  <div className="btm-top-item" key={child.key}>
                    <span className="val">
                      {isNullNumber(quotaInfo?.[child.key]) ? parseNum(quotaInfo?.[child.key]) : "-"}
                    </span>
                    <span className="name">
                      {child.name}({child.unit})
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="btm-bottom">
              <span className="bt-name">{i.name}</span>
              <span className="bt-val">
                场站数：{isNullNumber(quotaInfo?.[i.key]) ? parseNum(quotaInfo?.[i.key]) : "-"}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
