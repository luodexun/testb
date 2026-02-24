/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 16:37:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-23 10:21:32
 * @Description: 模块头部
 */
import { ReactNode } from "react"
import "./index.less"
interface IProps {
  title?: string
  rightBox?: ReactNode
}
export default function CommonBoxHeader(props: IProps) {
  const { title, rightBox } = props
  return (
    <div className="nx-cbox-header">
      <i className="icon"></i>
      <span className="title">{title}</span>
      <div className="nx-cbox-header-right">{rightBox}</div>
    </div>
  )
}
