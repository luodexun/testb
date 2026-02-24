/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 10:17:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 17:29:48
 * @Description:
 */
import "./index.less"

import CommonCtBox from "../common-box"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import LargeScreenContext from "@/contexts/screen-context"
import { useContext, useMemo } from "react"
import { judgeNull } from "@/utils/util-funs"
const capacityOvLs = [
  { name: "运营总装机容量", key: "totalInstalledCapacity", icon: "c-total", unit: "万千瓦" },
  { name: "并网总装机容量", key: "totalInstalledCapacity", icon: "c-total", unit: "万千瓦" },
  { name: "风电运营总装机容量", key: "wtInstalledCapacity", icon: "c-wt", unit: "万千瓦" },
  { name: "风机运营总台数", key: "wtOperationDeviceCount", icon: "c-wt", unit: "台" },
  { name: "光伏运营总装机容量", key: "pvinvInstalledCapacity", icon: "c-pv", unit: "万千瓦" },
  { name: "逆变器运营总台数", key: "pvinvOperationDeviceCount", icon: "c-pv", unit: "台" },
]
export default function SXOverview() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  const { quotaInfo } = useContext(LargeScreenContext)

  const actualShowInfo = useMemo(() => {
    if (quotaInfo?.capacityOverview && !quotaInfo?.capacityOverview?.useInterfaceData) {
      return quotaInfo?.capacityOverview?.data || null
    }
    return mainCpnInfo
  }, [quotaInfo, mainCpnInfo])
  return (
    <CommonCtBox title="装机概况">
      <div className="sx-overview">
        {capacityOvLs?.map((i) => {
          return (
            <div key={i.key + i.name} className="sx-ovw-item">
              <i className={`ovw-item-left ${i.icon}`}></i>
              <div className="ovw-item-right">
                <span className="item-name">{i.name}</span>
                <div className="item-btm">
                  <span className="item-val">{judgeNull(actualShowInfo?.[i.key], 1, 2, "-")}</span>
                  <span className="item-unit">{i.unit}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </CommonCtBox>
  )
}
