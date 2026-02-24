/*
 * @Author: chenmeifeng
 * @Date: 2024-07-10 10:22:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-11 16:25:12
 * @Description:
 */
import AhCtBt from "./center-bottom"
import AhCtTop from "./center-top"
import "./index.less"
import AhCenterMap from "./map"
export default function AhScreenCenter() {
  return (
    <div className="ah-scn-center">
      <div className="ah-center-top">
        <AhCtTop />
      </div>
      <div className="ah-center-center">
        <AhCenterMap />
      </div>
      <div className="ah-center-bottom">
        <AhCtBt />
      </div>
    </div>
  )
}
