/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 14:50:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-26 14:50:30
 * @Description: 模块框
 */
import "./index.less"
import CommonBoxHeader from "../common-box-header"

export default function JsCommonBox(props) {
  const { title, children } = props
  return (
    <div className="js-cbox">
      <CommonBoxHeader title={title} />
      <div className="js-cbox-content">{children}</div>
    </div>
  )
}
