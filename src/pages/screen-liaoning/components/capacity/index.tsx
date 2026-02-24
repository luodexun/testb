/*
 * @Author: chenmeifeng
 * @Date: 2025-02-18 10:30:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-04 09:54:54
 * @Description: 装机容量-场站设备详情
 */
import "./index.less"
import { judgeNull } from "@/utils/util-funs"
import LnCommonQuotaBox from "../common-quota"
import CommonBox2 from "../common-box2"
import { IStatisticsInfo } from "../../types"
import Statistics from "./statistics"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
const capacityOpts = [
  { title: "风电", key: "wtInstalledCapacity", unit: "MW", icon: "wt" },
  { title: "光伏", key: "pvinvInstalledCapacity", unit: "MW", icon: "pv" },
]
const statisticsInfo: IStatisticsInfo[] = [
  {
    typeName: "场站数",
    typeKey: "stationNum",
    unit: "座",
    child: [
      { name: "风电场", key: "stationWNum", unit: "座", color: "RGBA(44, 138, 226, 1)" },
      { name: "光伏场", key: "stationSNum", unit: "座", color: "RGBA(67, 195, 75, 1)" },
    ],
  },
  {
    typeName: "设备数",
    typeKey: "totalDeviceCount",
    unit: "台",
    child: [
      { name: "风机", key: "wtNum", unit: "台", color: "RGBA(218, 188, 17, 1)" },
      { name: "逆变器", key: "pvinvNum", unit: "台", color: "RGBA(31, 207, 211, 1)" },
    ],
  },
]
export default function LNCapacity() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  return (
    <div className="ln-capacity">
      <LnCommonQuotaBox
        name="总装机容量"
        unit="MW"
        value={judgeNull(mainCpnInfo?.["totalInstalledCapacity"], 0.1, 2, "-")}
        icon="/src/assets/liaoning-screen/feng.png"
        horizontal={false}
      />
      <div className="cpct-wp">
        {capacityOpts?.map((i) => {
          return (
            <CommonBox2
              key={i.key}
              title={i.title}
              unit={i.unit}
              icon={i.icon}
              value={judgeNull(mainCpnInfo?.[i.key], 0.1, 2, "-")}
              width="28em"
            />
          )
        })}
      </div>
      <i className="line"></i>
      <div className="cpct-statistics">
        {statisticsInfo?.map((i) => {
          return <Statistics {...i} key={i.typeKey} />
        })}
      </div>
    </div>
  )
}
