/*
 * @Author: xiongman
 * @Date: 2023-08-24 10:18:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-19 11:28:41
 * @Description: 区域中心-指标总览-机组指标-机组单元标签
 */

import "./index.less"

import { evoLargeNum4Unit } from "@utils/util-funs.tsx"
import { Select, SelectProps } from "antd"
import { CSSProperties, ReactNode, useEffect, useMemo, useRef } from "react"

interface IProps {
  value: ReactNode
  title?: string
  unit?: string
  digits?: number
  className?: string
  style?: CSSProperties
  valueStyle?: CSSProperties
  color?: string
  notEvo?: boolean
  compType?: string
  selectCompProps?: SelectProps
  onClickValue?: (e?) => void
}
export default function MetricTag(props: IProps) {
  const {
    title,
    unit,
    value,
    digits,
    className,
    style,
    valueStyle,
    color,
    notEvo,
    compType,
    selectCompProps,
    onClickValue,
  } = props
  const valueDomRef = useRef<HTMLSpanElement>()

  useEffect(() => {
    if (!valueDomRef.current || !valueStyle) return
    Object.entries(valueStyle).forEach(([key, value]) => {
      valueDomRef.current.style.setProperty(key, value)
    })
  }, [valueStyle])

  const { value: evoVal, unit: evoUnit } = notEvo
    ? { unit, value }
    : evoLargeNum4Unit({ value: value as string | number, unit, digits })
  const valTitle = useMemo(() => (typeof value === "object" ? undefined : `${value}`), [value])

  return (
    <div className={`${className ?? "metric-tag"}`} style={style}>
      {title ? <span className="info-title" title={title} children={title} /> : null}
      <div className="value-unit">
        {compType ? (
          <Select
            defaultValue={value}
            value={value}
            {...selectCompProps}
            className="info-value"
            style={{ height: "1.5rem", marginLeft: "0.3125rem" }}
            onChange={onClickValue}
          />
        ) : (
          <span
            ref={valueDomRef}
            style={{ color }}
            className="info-value"
            title={valTitle}
            children={evoVal}
            onClick={onClickValue}
          />
        )}

        {unit ? <span className="info-unit" title={title} children={evoUnit} /> : null}
      </div>
    </div>
  )
}
