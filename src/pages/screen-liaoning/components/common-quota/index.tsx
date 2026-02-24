/*
 * @Author: chenmeifeng
 * @Date: 2025-02-17 11:00:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-19 15:07:33
 * @Description:
 */
import { ArrowUpOutlined } from "@ant-design/icons"
import "./index.less"
interface IProps {
  name: string
  value: number | string
  unit?: string
  horizontal?: boolean
  nameLineColor?: string
  icon?: any
  describeName?: string
  describeValue?: any
  describeIcon?: boolean
}
export default function LnCommonQuotaBox(props: IProps) {
  const { name, unit, value, horizontal = true, describeName, describeValue, describeIcon, nameLineColor, icon } = props
  return (
    <div className="ln-com-quota-box">
      <div className="cquota-box-name">
        {nameLineColor ? <i className="name-line" style={{ backgroundColor: nameLineColor }}></i> : ""}
        {icon ? <i className="quota-icon" style={{ backgroundImage: `url(${icon})` }}></i> : ""}
        <span className="name">{name}</span>
        {unit && horizontal ? <span className="unit">({unit})</span> : ""}
      </div>
      <span className="cquota-box-value">{value}</span>
      {unit && !horizontal ? <span className="unit unit-btm">({unit})</span> : ""}
      {describeName ? (
        <div className="describe">
          {describeIcon ? <ArrowUpOutlined style={{ color: "#0CFF08", fontSize: "16px" }} /> : ""}
          <span>
            {describeName}: {describeValue}
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
