import "./index.less"
interface IProps {
  name: string
  unit?: string
  value: number | string
  horizontal?: boolean
  nameLineColor?: string
}
export default function YNCommonQuotaBox(props: IProps) {
  const { name, unit, value, horizontal = true, nameLineColor } = props
  return (
    <div className="yn-com-quota-box">
      <div className="cquota-box-name">
        {nameLineColor ? <i className="name-line" style={{ backgroundColor: nameLineColor }}></i> : ""}
        <span className="name">{name}</span>
        {unit && horizontal ? <span className="unit">({unit})</span> : ""}
      </div>
      <span className="cquota-box-value">{value}</span>
      {unit && !horizontal ? <span className="unit unit-btm">({unit})</span> : ""}
    </div>
  )
}
