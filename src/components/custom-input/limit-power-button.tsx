/*
 * @Author: xiongman
 * @Date: 2023-10-20 20:42:21
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-20 20:42:21
 * @Description:
 */

import "./limit-power-button.less"

import { Button, ButtonProps, InputNumber } from "antd"
import classnames from "classnames"

interface IProps {
  value?: number
  onChange?: (value: number) => void
  buttonProps?: ButtonProps
}
export default function LimitPowerButton(props: IProps) {
  const { buttonProps, onChange, value } = props
  const { className, ...btnProps } = buttonProps

  return (
    <div className="limit-power-button-wrap">
      <InputNumber
        size={buttonProps?.size}
        controls={false}
        value={value}
        onChange={onChange}
        placeholder="请输入数值"
        addonAfter={<Button {...(btnProps || {})} className={classnames("limit-power-btn", className)} />}
      />
    </div>
  )
}
