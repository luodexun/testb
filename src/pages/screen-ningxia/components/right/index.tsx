/*
 * @Author: chenmeifeng
 * @Date: 2024-12-25 15:40:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-31 10:16:30
 * @Description:
 */
import NXAgc from "../AGC"
import CapacityBox from "../capacity"
import WtState from "../device-state"
import NXPredictElec from "../predict-elec"
import "./index.less"
export default function NXRight() {
  return (
    <div className="nx-right-content">
      <div className="nx-right-content--left">
        <WtState />
      </div>
      <div className="nx-right-content--right">
        <CapacityBox />
        <div className="nx-right-38">
          <NXPredictElec />
        </div>
        <div className="nx-right-flex">
          <NXAgc />
        </div>
      </div>
    </div>
  )
}
