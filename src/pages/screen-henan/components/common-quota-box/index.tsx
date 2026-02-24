/*
 * @Author: chenmeifeng
 * @Date: 2024-09-23 15:43:20
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-24 10:48:48
 * @Description:
 */
import { parseNum } from "@/utils/util-funs"
import "./index.less"
import { isNullNumber } from "../../methods"
interface IProps {
  title: string
  value: number
  unit?: string
}
export default function HnQuotaBox(props: IProps) {
  const { title, value, unit } = props
  return (
    <div className="hn-qt-box">
      <span className="hn-qt-box-name">{`${title}(${unit})`}</span>
      <span className="hn-qt-box-val">{isNullNumber(value) ? parseNum(value) : "-"}</span>
    </div>
  )
}
