/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 16:13:37
 * @Description:
 */
import { Button, Upload, UploadProps } from "antd"

interface IProps extends UploadProps {
  title?: string
  onChange?: (val: any) => void
}
export default function CustomUpload(props: IProps) {
  const { title, onChange, disabled, ...otherProps } = props
  return (
    <div className="limit-power-lnnterval">
      <Upload {...otherProps}>
        <Button disabled={disabled}>{title}</Button>
      </Upload>
    </div>
  )
}
