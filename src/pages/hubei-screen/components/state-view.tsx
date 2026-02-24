/*
 * @Author: chenmeifeng
 * @Date: 2024-04-10 17:35:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-11 17:29:23
 * @Description: 湖北大屏-状态总览
 */
import "./state-view.less"

import AreaStateOvw from "@/pages/area-state-overview"

import HBCommonTitle from "./common-title"

export default function HbStateView() {
  return (
    <div className="screen-box state-view page-tabs-wrap">
      <HBCommonTitle title="状态总览" />
      <div className="state-view-content">
        <AreaStateOvw showName={false} />
      </div>
    </div>
  )
}
