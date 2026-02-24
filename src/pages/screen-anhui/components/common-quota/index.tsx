/*
 * @Author: chenmeifeng
 * @Date: 2024-07-09 10:15:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-11 14:26:08
 * @Description:
 */
import { memo } from "react"
import "./index.less"
interface IProps {
  name: string
  unit?: string
  value: number | string
}
const CommonQuotaBox = memo((props: IProps) => {
  const { name, unit, value } = props
  return (
    <div className="ah-common-quota-box">
      <div className="cquota-box-name">
        <span className="name">{name}</span>
        {unit ? <span className="unit">({unit})</span> : ""}
      </div>
      <span className="cquota-box-value">{value}</span>
    </div>
  )
})
export default CommonQuotaBox
