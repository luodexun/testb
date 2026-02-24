/*
 * @Author: chenmeifeng
 * @Date: 2025-02-20 16:58:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-20 17:21:10
 * @Description:
 */
import "./box.less"
import { judgeNull } from "@/utils/util-funs"
import { useEffect } from "react"
import LnCommonQuotaBox from "../common-quota"
interface IProps {
  key: string
  name: string
  icon: string
  value: any
  unit: string
  describeName?: string
  describeValue?: any
}
export default function BoxQuota(props: IProps) {
  const { name, icon, value, unit, describeName, describeValue } = props
  useEffect(() => {
    // effect logic
  }, [])
  return (
    <div className="tbox-q">
      <i className={`i-${icon}`} />
      <LnCommonQuotaBox
        name={name}
        unit={unit}
        value={judgeNull(value, 1, 2, "-")}
        describeName={describeName}
        describeValue={describeValue}
      />
    </div>
  )
}
