import "./limit-power-button.less"

import { Input } from "antd"
const { TextArea } = Input
export default function CustomTextInput(props) {
  const { value, ...otherProps } = props

  return (
    <div className="w-100 limit-power-button-wrap">
      <TextArea value={value} {...otherProps} />
    </div>
  )
}
