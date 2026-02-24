/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 11:29:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-09 13:45:49
 * @Description:
 */
import "./index.less"
import HBCommonTitle from "@/pages/hubei-screen/components/common-title"
import { ReactNode } from "react"

interface IProps {
  headerType: string
  headerName: string
  children?: ReactNode
  titleBox?: ReactNode
  stationBox?: ReactNode
  className?: string
}
export default function HB1CommonBox(props: IProps) {
  const { headerType, headerName, className, titleBox, stationBox, children } = props
  return (
    <div className={`hb1-cmbox ${className}`}>
      <HBCommonTitle title={headerName} type={headerType} children={titleBox} />
      <div className="hb1-cmbox-content">
        <div className="station-select">{stationBox}</div>
        {children}
      </div>
    </div>
  )
}
