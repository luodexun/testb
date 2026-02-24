/*
 * @Author: chenmeifeng
 * @Date: 2024-07-04 10:23:54
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-04 15:42:29
 * @Description: 公用外框
 */
import { ReactElement } from "react"
import "./index.less"

interface IProps {
  direction?: string
  children?: ReactElement | any
  title?: string
}
export default function CommonCtBox(props: IProps) {
  const { direction = "left", children, title } = props
  return (
    <div className="ah-screen-box">
      <div className="ah-snbox">
        <i className={`ah-snbox-top ${direction === "left" ? "ah-snbox-top1" : "ah-snbox-top2"}`}></i>
        <i className={`ah-snbox-center ${direction === "left" ? "ah-snbox-center1" : "ah-snbox-center2"}`}></i>
        <i className={`ah-snbox-bottom ${direction === "left" ? "ah-snbox-bottom1" : "ah-snbox-bottom2"}`}></i>
      </div>
      <div className="ah-box-content">
        {title ? (
          <div className="ah-snbox-header">
            <i className="header-icon"></i>
            <span className="header-title">{title}</span>
          </div>
        ) : (
          ""
        )}
        <div className="ah-snbox-con">{children}</div>
      </div>
    </div>
  )
}
