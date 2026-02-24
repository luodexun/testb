/*
 * @Author: xiongman
 * @Date: 2023-11-20 14:22:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-28 09:41:53
 * @Description:
 */
import "./index.less"
import { CheckboxOptionType } from "antd/es/checkbox/Group"
import { CheckboxChangeEvent, CheckboxGroupProps } from "antd/lib/checkbox"
import { useMemo, useRef } from "react"

import CustomCheckbox from "./custom-checkbox.tsx"

interface IProps extends Omit<CheckboxGroupProps, "options" | "onChange"> {
  options: (Omit<CheckboxOptionType, "value"> & { value: string })[]
  active?: IProps["options"][0]["value"]
  onClick?: (value?: IProps["active"]) => void
  onChange?: (value?: string[]) => void
}
export default function CustomCheckboxGroup(props: IProps) {
  const { value, options, active, onClick, onChange, disabled } = props
  const checkedMapRef = useRef<Partial<Record<string, boolean>>>({})

  const checkedMap = useMemo(() => value.reduce((prev, next) => (prev[`${next}`] = true) && prev, {}), [value])
  checkedMapRef.current = checkedMap

  const groupChgRef = useRef(onChange)
  groupChgRef.current = onChange
  const checkChgRef = useRef((key: IProps["active"], e: CheckboxChangeEvent) => {
    checkedMapRef.current[key] = e.target.checked
    const result = Object.keys(checkedMapRef.current).filter((key) => checkedMapRef.current[key])
    groupChgRef.current?.(result)
  })

  return (
    <div className="custom-checkbox-group-wrap">
      {options.map(({ value, ...info }) => (
        <CustomCheckbox
          key={`check_${value}`}
          checked={checkedMap[`${value}`]}
          active={active === value}
          onChange={checkChgRef.current.bind(null, value)}
          onClick={onClick?.bind(null, value)}
          disabled={disabled}
          {...info}
        />
      ))}
    </div>
  )
}
