import "./common-quota-box.less"

import { parseNum } from "@/utils/util-funs"
interface IProps {
  name: string
  unit?: string
  value: number | string
}
export default function CommonQuotaBox(props: IProps) {
  const { name, unit, value } = props
  return (
    <div className="common-quota-box">
      <div className="cquota-box-name">
        <span className="name">{name}</span>
        {unit ? <span className="unit">({unit})</span> : ""}
      </div>
      <span className="cquota-box-value">{value}</span>
    </div>
  )
}
