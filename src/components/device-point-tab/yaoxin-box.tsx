import "./yaoxin-box.less"
import { BulbFilled } from "@ant-design/icons"

export function YXBox(props) {
  const { color, name, value, className } = props
  return (
    <div className="yaoxin-box">
      <span className="monitor-tbt-name" style={{ color: color }}>
        {name}
      </span>
      <span title={`${name}: ${value}`} className="monitor-tbt-icon">
        <BulbFilled className={className || "no"} />
      </span>
    </div>
  )
}
