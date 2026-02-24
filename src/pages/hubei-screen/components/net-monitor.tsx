import "./net-monitor.less"

import AreaNet from "@/pages/area-net"

import HBCommonTitle from "./common-title"

export default function HbNetMnt() {
  return (
    <div className="screen-box hb-net-view">
      <HBCommonTitle title="网络监视" />
      <div className="hb-net-content screen-box-content">
        <AreaNet isScreen={true} />
      </div>
    </div>
  )
}
