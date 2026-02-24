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
      <span className="cquota-box-name">{name}</span>
      <div className="cquota-box-value">
        <span className="value">{value}</span>
        {unit ? <span className="unit">{unit}</span> : ""}
      </div>
    </div>
  )
}
