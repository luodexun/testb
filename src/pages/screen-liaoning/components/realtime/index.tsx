/*
 * @Author: chenmeifeng
 * @Date: 2025-02-20 16:33:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-09 16:46:22
 * @Description:
 */
import { judgeNull } from "@/utils/util-funs"
import CommonBox1 from "../common-box1"
import BoxQuota from "./box"
import "./index.less"
import { useEffect } from "react"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
const ls = [
  { name: "风电有功功率", key: "wtActivePower" },
  { name: "光伏有功功率", key: "pvinvActivePower" },
]
export default function LNRealtime(props) {
  const mainCpnInfo = useAtomValue(mainComAtom)
  useEffect(() => {
    // effect logic
  }, [])
  return (
    <div className="ln-realtime">
      <BoxQuota
        // describeName="历史最高"
        describeValue={12}
        name="总有功功率"
        unit="MW"
        key="activePower"
        icon="actPower"
        value={judgeNull(mainCpnInfo?.activePower, 0.1, 2, "-")}
      />
      <div className="realtime-box">
        {ls?.map((i) => {
          return <CommonBox1 key={i.key} name={i.name} value={judgeNull(mainCpnInfo?.[i.key], 0.1, 2, "-")} unit="MW" />
        })}
      </div>
      <BoxQuota name="风电实时风速" unit="m/s" key="windSpeed" icon="speed" value={mainCpnInfo?.windSpeed} />
      <BoxQuota
        name="光伏实时辐照度"
        unit="W/㎡"
        key="totalIrradiance"
        icon="radiation"
        value={mainCpnInfo?.totalIrradiance}
      />
    </div>
  )
}
