/*
 * @Author: chenmeifeng
 * @Date: 2025-05-26 10:14:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-26 10:19:26
 * @Description: 遥测框
 */
import "./yaoce-box.less"
export function YCBox(props) {
  const { color, name, value, unit } = props
  return (
    <div className="yaoce-box">
      <span className="monitor-tbt-name" style={{ color: color }}>
        {name}
      </span>
      <span className="monitor-tbt-value">{value}</span>
      <span className="monitor-tbt-unit">{unit}</span>
    </div>
  )
}
