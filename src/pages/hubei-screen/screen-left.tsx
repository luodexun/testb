import { Suspense, lazy } from "react"
import "./screen-left.less"
const HbElecView = lazy(() => import("./components/elec-view"))
export default function HbSrcTtLeft() {
  return (
    <div className="hb2-tl">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hb2-tl-hd"></div>
        <div className="hb2-tl-ct">
          {/* <HbSrnLeft /> */}
          <HbElecView />
        </div>
      </Suspense>
    </div>
  )
}
