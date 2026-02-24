/*
 * @Author: chenmeifeng
 * @Date: 2025-04-03 16:34:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-07 11:08:10
 * @Description:
 */
import "./index.less"
import MonitorTableTab from "@/components/device-point-tab/table-tabs"
import { forwardRef } from "react"
export interface ISvgFPtTblRef {}
export interface ISvgFPtTblProps {
  deviceCode: string
}
const SvgFourPointTable = forwardRef<ISvgFPtTblRef, ISvgFPtTblProps>((props, ref) => {
  const { deviceCode } = props
  return (
    <div className="Four-point">
      <MonitorTableTab deviceCode={deviceCode} />
    </div>
  )
})
export default SvgFourPointTable
