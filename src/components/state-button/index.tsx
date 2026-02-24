import "./index.less"

import classnames from "classnames"
import { useMemo } from "react"

import { IConfigDeviceStateData } from "@/types/i-config.ts"

interface IProps {
  value: number
  info: IConfigDeviceStateData
  checked?: boolean
  onChange?: (id: IProps["info"]["stateDesc"], checked: IProps["checked"]) => void
}
export default function StateButton(props: IProps) {
  const { info, checked, value, onChange } = props
  const style = useMemo(() => {
    if (!info?.styleInfo?.color) return undefined
    const { color } = info.styleInfo
    return { color, backgroundColor: color }
  }, [info?.styleInfo])
  return (
    <div
      key={info.id}
      style={style}
      onClick={() => onChange?.(info.stateDesc, !checked)}
      className={classnames("state-button pointer", { point: !!onChange, checked })}
    >
      <span className="state-btn-name">{info.stateDesc}</span>
      <span className="state-btn-count">{value ?? "-"}</span>
    </div>
  )
}
