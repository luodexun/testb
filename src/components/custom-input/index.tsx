/*
 * @Author: xiongman
 * @Date: 2023-10-20 20:42:21
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-20 20:42:21
 * @Description:
 */

import "./limit-power-button.less"

import { Input, InputProps } from "antd"

export default function CustomInput(props: InputProps) {
  const { value, ...otherProps } = props

  return (
    <div className="w-100 limit-power-button-wrap">
      <Input value={value} {...otherProps} />
    </div>
  )
}
