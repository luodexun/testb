/*
 * @Author: chenmeifeng
 * @Date: 2024-07-22 17:05:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-05 10:02:00
 * @Description:
 */
import "./index.less"
import { mainComAtom } from "@/store/atom-screen-data"
import YNCommonQuotaBox from "../common-quota"

import { useAtomValue } from "jotai"
import { parseNum, validResErr } from "@/utils/util-funs"
import { WT_PV_CAPACITY_OPTION } from "../../configs"
import { doBaseServer } from "@/api/serve-funs"
import { useEffect, useMemo, useState } from "react"
export default function YNCapacity() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  const [typeInfo, setTypeInfo] = useState({
    wtTypeNum: 0,
    pvTypeNum: 0,
  })
  const stationNum = useMemo(() => {
    if (!mainCpnInfo) return 0
    return (mainCpnInfo.stationWNum || 0) + (mainCpnInfo.stationSNum || 0) + (mainCpnInfo.stationENum || 0)
  }, [mainCpnInfo])
  const initData = async () => {
    const res = await doBaseServer("queryBrand")
    if (validResErr(res)) return
    const wtData = Object.values(res?.["wt"] || {})
    const pvData = Object.values(res?.["pvinv"] || {})
    setTypeInfo({
      wtTypeNum: Object.keys(wtData).length,
      pvTypeNum: Object.keys(pvData).length,
    })
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="yn-capacity">
      <div className="yn-cpty-left">
        <YNCommonQuotaBox
          horizontal={false}
          name="总装机容量"
          unit="MW"
          value={parseNum(mainCpnInfo?.totalInstalledCapacity * 10) || "-"}
        />
        <div className="cpty-left-box">
          <div className="box-site">
            <div className="item-right-top">
              <span className="item-num-val">{stationNum}</span>
              <span className="item-num-unit">座</span>
            </div>
            <div className="item-right-bottom">电场总个数</div>
          </div>
        </div>
      </div>
      <div className="yn-cpty-right">
        {WT_PV_CAPACITY_OPTION?.map((i) => {
          return (
            <div className="cpty-item" key={i.key}>
              <YNCommonQuotaBox
                nameLineColor={i.color}
                horizontal={false}
                name={i.name}
                unit="MW"
                value={parseNum((mainCpnInfo?.[i.key] || 0) * 10)}
              />
              <div className="cpty-right-dsc">
                <div className="dsc-ls">
                  <span>场站数:</span>
                  <span>{mainCpnInfo?.[i.stnNum]}</span>
                </div>
                <div className="dsc-ls">
                  <span>{i.deviceNumName}:</span>
                  <span>{mainCpnInfo?.[i.deviceNumKey]}</span>
                </div>
                <div className="dsc-ls">
                  <span>{i.typeName}:</span>
                  <span>{typeInfo?.[i.typeKey]}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
