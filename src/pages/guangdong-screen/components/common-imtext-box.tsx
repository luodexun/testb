/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 17:17:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-22 10:00:09
 * @Description:
 */
import "./common-imtext-box.less"
export default function CommonImtextBox(props) {
  const { type, name, value } = props
  return (
    <div className="com-imt" key={value}>
      <i className={"i-" + type} />
      <div className="com-imt-right">
        <span className="imt-right-value">{value}</span>
        <span className="imt-right-value">{name}</span>
      </div>
    </div>
  )
}
