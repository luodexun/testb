/*
 * @Author: chenmeifeng
 * @Date: 2024-04-11 11:35:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-12 14:38:06
 * @Description:
 */
import "./elec-view.less"

import AreaElec from "@/pages/area-elec"

import HBCommonTitle from "./common-title"

export default function HbElecView() {
  return (
    <div className="screen-box elec-view">
      <HBCommonTitle title="电气总览" />
      <div className="hb-elec-content screen-box-content">
        <AreaElec showTop={false} />
      </div>
    </div>
  )
}
