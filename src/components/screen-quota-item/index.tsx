/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 14:21:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 13:59:41
 * @Description:
 */
import "./index.less"

import { parseNum } from "@/utils/util-funs"
interface IProps {
  key: any
  name: string
  value: number
}
export default function ScreenQuotaItem(props: IProps) {
  const { name, value } = props
  return (
    <div className="screen-qbox-item">
      <i className="tlist-item-icon"></i>
      <div>
        <span className="tlist-item-value">{parseNum(value) || "-"}</span>
        <span className="tlist-item-name">{name}</span>
      </div>
    </div>
  )
}
