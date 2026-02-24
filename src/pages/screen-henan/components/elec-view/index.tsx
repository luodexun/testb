/*
 * @Author: chenmeifeng
 * @Date: 2024-04-11 11:35:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-12 14:38:06
 * @Description:
 */
import "./index.less"
import HnCommonBox from "../common-box"
import AreaElec from "@/pages/area-elec"

export default function HnElecView() {
  return (
    <HnCommonBox title="电气总览" className="hn-elec-view">
      <AreaElec showTop={false} />
    </HnCommonBox>
  )
}
