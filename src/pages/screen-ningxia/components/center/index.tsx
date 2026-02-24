import "./index.less"
import NXCenterMap from "./map"
import Statistics from "./statistics"
export default function NXCenter() {
  return (
    <div className="nx-center">
      <div className="nx-center-stc">
        <Statistics />
      </div>
      <NXCenterMap />
    </div>
  )
}
