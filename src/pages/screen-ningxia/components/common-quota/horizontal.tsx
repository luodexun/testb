/*
 * @Author: chenmeifeng
 * @Date: 2024-12-25 17:11:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-02 14:22:52
 * @Description:
 */
import "./index.less"
interface IProps {
  name: string
  unit?: string
  value: number | string
  horizontal?: boolean
  nameLineColor?: string
}
export default function NXCommonQuotaHtBox(props: IProps) {
  const { name, unit, value } = props
  return (
    <div className="yn-com-quota-htbox">
      <span className="htbox-name">{name}</span>
      <span className="htbox-value">{value}</span>
      <span className="htbox-unit">{unit}</span>
    </div>
  )
}
