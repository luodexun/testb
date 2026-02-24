/*
 * @Author: chenmeifeng
 * @Date: 2024-07-10 10:29:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-15 16:47:41
 * @Description:
 */
import { mainComAtom } from "@/store/atom-screen-data"
import "./center-bottom.less"
import { useAtomValue } from "jotai"
import { parseNum } from "@/utils/util-funs"
const mapQuota = [
  {
    capacityName: "风电装机",
    capacityKey: "wtInstalledCapacity",
    capacityUnit: "万kW",
    numName: "风电场数量",
    numKey: "stationWNum",
    numUnit: "座",
  },
  // {
  //   capacityName: "光伏装机",
  //   capacityKey: "pvinvInstalledCapacity",
  //   capacityUnit: "万kW",
  //   numName: "光伏站数量",
  //   numKey: "stationSNum",
  //   numUnit: "座",
  // },
]
export default function AhCtBt() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  return (
    <div className="ah-cbt">
      {mapQuota?.map((i) => {
        return (
          <div key={i.capacityKey} className="ah-cbt-item">
            <div className="item-left">
              <span className="item-cp-name">{i.capacityName}</span>
              <span className="item-cp-val">{parseNum(mainCpnInfo?.[i.capacityKey]) || "-"}</span>
              <span className="item-cp-unit">{i.capacityUnit}</span>
            </div>
            <div className="item-right">
              <div className="item-right-top">
                <span className="item-num-val">{parseNum(mainCpnInfo?.[i.numKey]) || "-"}</span>
                <span className="item-num-unit">{i.numUnit}</span>
              </div>
              <div className="item-right-bottom">{i.numName}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
