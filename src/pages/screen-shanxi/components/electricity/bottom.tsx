import LargeScreenContext from "@/contexts/screen-context"
import { mainComAtom } from "@/store/atom-screen-data"
import { judgeNull } from "@/utils/util-funs"
import { useAtomValue } from "jotai"
import { useContext, useMemo } from "react"

/*
 * @Author: chenmeifeng
 * @Date: 2024-07-16 17:21:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 17:06:46
 * @Description:
 */
const list = [
  { name: "年发电量", icon: "year", key: "yearlyProduction", unit: "万千瓦时" },
  { name: "月发电量", icon: "month", key: "monthlyProduction", unit: "万千瓦时" },
  { name: "日发电量", icon: "day", key: "dailyProduction", unit: "万千瓦时" },
]
export default function SXElecBottom() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  const { quotaInfo } = useContext(LargeScreenContext)

  const actualShowInfo = useMemo(() => {
    if (quotaInfo?.electricity && !quotaInfo?.electricity?.useInterfaceData) {
      return quotaInfo?.electricity?.data || null
    }
    return mainCpnInfo
  }, [quotaInfo, mainCpnInfo])
  return (
    <div className="sx-ebom">
      {list?.map((i) => {
        return (
          <div className="ex-ebom-item" key={i.key}>
            <i className={`icon type-${i.icon}`}></i>
            <div className="item-con">
              <span className="item-name">{i.name}</span>
              <span className="item-value">{judgeNull(actualShowInfo?.[i.key], 1, 2, "-")}</span>
              <span className="item-unit">{i.unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
