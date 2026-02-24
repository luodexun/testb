/*
 * @Author: chenmeifeng
 * @Date: 2025-02-17 10:49:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-18 15:43:14
 * @Description: 公用模块
 */
import "./index.less"
interface IProps {
  name: string
  value: number
  unit?: string
}
export default function CommonBox1(props: IProps) {
  const { value, unit, name } = props
  return (
    <div className="cm-box-one1">
      <div className="item-right-top">
        <span className="item-num-val">{value}</span>
        <span className="item-num-unit">{unit}</span>
      </div>
      <div className="item-right-bottom">{name}</div>
    </div>
  )
}
