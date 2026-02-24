/*
 * @Author: xiongman
 * @Date: 2023-08-30 16:17:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-19 15:05:15
 * @Description:
 */

import "./popover-content.less"

import type { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"
import { useRef } from "react"

import CustomProgress from "@/components/custom-progress"
import MetricTag from "@/components/metric-tag"

const PROGRESS_PROPS = { width: "8px", bordered: false, trailColor: "#1741A2FF", strokeColor: ["#AD8E564D", "#af8842"] }
interface IProps<TD> {
  data?: TD
  list: IDvsRunStateInfo<keyof TD, string>[]
}

type TParticalTD<TD> = Partial<Record<keyof TD, number | string>>
export default function PopoverContent<TD extends TParticalTD<TD>>(props: IProps<TD>) {
  const { list } = props
  const tagValueRef = useRef((unit: string, value: number | string) => {
    if (typeof value === "number" && unit === UNIT.PERCENT) {
      return <CustomProgress {...PROGRESS_PROPS} percent={value ?? 0} />
    }
    return value ?? "-"
  })
  return (
    <div className="popover-content">
      {(list || []).map(({ title, field, color, unit, value, digits }) => (
        <MetricTag
          key={field as string}
          unit={unit as string}
          title={title}
          digits={digits}
          value={tagValueRef.current(unit, value)}
          valueStyle={{ color }}
        />
      ))}
    </div>
  )
}
