/*
 * @Author: chenmeifeng
 * @Date: 2023-10-26 14:12:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-26 14:13:37
 * @Description:
 */

import { InputNumber } from "antd"
import type { InputNumberProps } from "antd/es/input-number"
import { forwardRef, useImperativeHandle, useRef } from "react"

export interface ICustomIptNumRef {
  getValue: () => number | string | null
}
interface IProps extends InputNumberProps {
  value?: number
  defaultValue?: number
}

const CustomInputNumber = forwardRef<ICustomIptNumRef, IProps>((props, ref) => {
  const { value, defaultValue, ...otherProps } = props
  const iptRef = useRef<HTMLInputElement>()

  useImperativeHandle(ref, () => ({
    getValue: () => iptRef.current?.value ?? value,
  }))

  return (
    <div className="limit-power-interval">
      <InputNumber ref={iptRef} value={value} defaultValue={defaultValue} {...otherProps} />
    </div>
  )
})

export default CustomInputNumber
