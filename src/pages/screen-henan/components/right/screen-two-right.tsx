import "./index.less"
import HnStatinDetail from "../station-detail"
import HnElecView from "../elec-view"

export default function HN2Right() {
  return (
    <div className="hn2-screen-right">
      <div className="box-item">
        <HnStatinDetail />
      </div>
      <div className="box-item">
        <HnElecView />
      </div>
    </div>
  )
}
