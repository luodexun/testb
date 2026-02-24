/*
 * @Author: chenmeifeng
 * @Date: 2024-09-26 14:06:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-29 15:58:18
 * @Description:
 */
import "./qt-box.less"
import { CENTER_QUOTA_BOTTOM } from "../../configs"
import { isNullNumber } from "../../methods"
import { parseNum } from "@/utils/util-funs"
import LargeScreenContext from "@/contexts/screen-context"
import { useContext } from "react"
function QuotaItem(props) {
  const { keyName, name, info } = props
  return (
    <div className="qt-item">
      <span className="val">{isNullNumber(info?.[keyName]) ? parseNum(info?.[keyName]) : "-"}</span>
      <span className="name">{name}</span>
    </div>
  )
}
export default function HnQtBox() {
  const { quotaInfo } = useContext(LargeScreenContext)
  return (
    <div className="hn-sctb-qtbox">
      {CENTER_QUOTA_BOTTOM.filter((j) => j.type === 1)?.map((i) => {
        return (
          <div className="qt-box-item" key={i.key}>
            <div className="item-left">{i.showName || i.name}</div>
            <div className="item-right">
              <QuotaItem key={i.key} keyName={i.key} name="场站数" info={quotaInfo} />
              {i.children?.map((child) => {
                return <QuotaItem key={child.key} keyName={child.key} name={child.name} info={quotaInfo} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
