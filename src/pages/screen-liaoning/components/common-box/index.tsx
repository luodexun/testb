/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 14:50:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-17 11:21:16
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
export default function LNCommonBox(props: IProps) {
  const { title, titleBox, children } = props
  return (
    <div className="ln-cbox">
      {title ? <CommonBoxHeader title={title} rightBox={titleBox} /> : ""}
      <div className="ln-cbox-content">{children}</div>
    </div>
  )
}
