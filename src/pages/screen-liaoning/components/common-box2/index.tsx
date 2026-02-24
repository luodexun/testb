import "./index.less"
import { useEffect } from "react"

export default function CommonBox2(props) {
  const { title, unit, icon, value, width = "28em" } = props
  useEffect(() => {
    // effect logic
  }, [])
  return (
    <div className="common-box2" style={{ width }}>
      <div className="box2-left">
        <div className="left-icon">
          <i className={`icon icon-${icon}`}></i>
        </div>
        <span className="name">{title}</span>
      </div>
      <div className="box2-right">
        <span className="value">{value}</span>
        <span className="unit">{unit}</span>
      </div>
    </div>
  )
}
