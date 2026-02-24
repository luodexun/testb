/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-09 15:17:04
 * @Description: 湖北大屏-小模块公用头部
 */
import "./common-title.less"
export default function HBCommonTitle(props) {
  const { title, children } = props
  return (
    <div className="screen-box-title">
      <div className="box-name">
        <span className="box-name-t">{title}</span>
        <i className="box-name-line"></i>
      </div>
      <div className="box-right">{children}</div>
    </div>
  )
}
