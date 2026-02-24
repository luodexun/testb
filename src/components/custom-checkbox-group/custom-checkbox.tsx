/*
 * @Author: xiongman
 * @Date: 2023-11-20 15:03:42
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-20 15:03:42
 * @Description:
 */

import "./custon-checkbox.less"

import { Checkbox, CheckboxProps } from "antd"
import classnames from "classnames"
import { MouseEventHandler, ReactNode, useRef } from "react"

interface IProps extends Omit<CheckboxProps, "onClick"> {
  label?: ReactNode
  active?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}
export default function CustomCheckbox(props: IProps) {
  const { label, onChange, active, onClick, ...checkProps } = props

  const checkChgRef = useRef(onChange)
  checkChgRef.current = onChange
  return (
    <div className="custom-checkbox-wrap">
      <Checkbox {...checkProps} onChange={checkChgRef.current} />
      <div className={classnames("check-label", { active, pointer: !!onClick })} onClick={onClick} children={label} />
    </div>
  )
}
