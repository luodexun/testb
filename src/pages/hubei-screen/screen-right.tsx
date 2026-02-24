import { Suspense, lazy } from "react"
import "./screen-left.less"
const HbSrnRight = lazy(() => import("./components/right/index"))
export default function HbSrcTtRight() {
  return (
    <div className="hb2-tr">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hb2-tr-hd"></div>
        <div className="hb2-tr-ct">
          <HbSrnRight />
        </div>
      </Suspense>
    </div>
  )
}
