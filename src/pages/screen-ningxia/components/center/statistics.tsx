import "./statistics.less"
import { useMemo, useRef } from "react"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
import NXCommonQuotaBox from "../common-quota"
import { judgeNull, parseNum } from "@/utils/util-funs"
import CpctRate from "./rate"
import { DVS_STATISTICS_QUOTA } from "../../configs"

export default function Statistics() {
  const typeList = useRef(DVS_STATISTICS_QUOTA)
  const quotaInfo = useAtomValue(mainComAtom)
  // const { quotaInfo } = useContext(HbScreenContext)
  const transData = useMemo(() => {
    if (!quotaInfo) return null

    const wtInstalledCapacityTRate = (quotaInfo?.wtInstalledCapacity / quotaInfo?.totalInstalledCapacity) * 100
    const pvinvInstalledCapacityTRate = (quotaInfo?.pvinvInstalledCapacity / quotaInfo?.totalInstalledCapacity) * 100
    const espcsInstalledCapacityTRate = (quotaInfo?.espcsInstalledCapacity / quotaInfo?.totalInstalledCapacity) * 100
    return Object.assign({}, quotaInfo, {
      wtInstalledCapacityTRate,
      pvinvInstalledCapacityTRate,
      espcsInstalledCapacityTRate,
    })
  }, [quotaInfo])
  return (
    <div className="nx-center-statistics">
      {DVS_STATISTICS_QUOTA?.map((i) => {
        return (
          <div className="quota-item" key={i.key}>
            <div className="quota-item-top">
              <span className="type-name">{i.name}</span>
              <div className="type-num">
                <span>场站数</span>
                <span>{quotaInfo?.[i.stationNumKey]}个</span>
              </div>
            </div>
            <div className="quota-item-content">
              {i?.children?.map((item) => {
                return item["type"] === "line" ? (
                  <div className="quota-nx" key={item.key}>
                    <CpctRate name={item.name} value={judgeNull(transData?.[item.key], 1, 2)} />
                  </div>
                ) : (
                  <div className="quota-nx" key={item.key}>
                    <NXCommonQuotaBox
                      name={item.name}
                      unit={item.unit}
                      value={judgeNull(transData?.[item.key], 1, 2, "-")}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
