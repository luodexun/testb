/*
 * @Author: chenmeifeng
 * @Date: 2024-05-29 10:03:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-31 10:24:18
 * @Description: 模块头部
 */
import "./box-header.less"
export default function BoxHeader(props) {
  const { type, title, children } = props
  return (
    <div className="nhb-box-header">
      <i className={`box-icon-${type}`}></i>
      <div className="box-con">
        <span className="box-con-title">{title}</span>
        <div className="box-con-right">{children}</div>
      </div>
    </div>
  )
}
