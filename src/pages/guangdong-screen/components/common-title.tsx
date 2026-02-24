/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-16 11:40:46
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
        {/* <img src="/src/assets/hubei-screen/tl-box-line.png" className="box-name-line"></img> */}
      </div>
      <div className="box-right">{children}</div>
    </div>
  )
}
