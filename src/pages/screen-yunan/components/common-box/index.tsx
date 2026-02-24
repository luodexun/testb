/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 14:50:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-19 16:41:27
 * @Description: 模块框
 */
import "./index.less"
import CommonBoxHeader from "../common-box-header"
import { ReactNode } from "react"
interface IProps {
  title?: string
  titleBox?: ReactNode
  children?: ReactNode
}
export default function YNCommonBox(props: IProps) {
  const { title, titleBox, children } = props
  return (
    <div className="yn-cbox">
      {title ? <CommonBoxHeader title={title} rightBox={titleBox} /> : ""}
      <div className="yn-cbox-content">{children}</div>
    </div>
  )
}
