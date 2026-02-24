/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 14:50:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-26 14:50:30
 * @Description: 模块框
 */
import "./index.less"
import CommonBoxHeader from "../common-box-header"
import { ReactNode } from "react"
interface IProps {
  title?: string
  className?: string
  titleBox?: ReactNode
  children?: ReactNode
}
export default function HnCommonBox(props: IProps) {
  const { title, className, titleBox, children } = props
  return (
    <div className={`hn-cbox ${className}`}>
      <CommonBoxHeader title={title} rightBox={titleBox} />
      <div className="hn-cbox-content">{children}</div>
    </div>
  )
}
