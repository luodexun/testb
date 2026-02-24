/*
 * @Author: chenmeifeng
 * @Date: 2024-08-09 10:17:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-27 10:05:45
 * @Description:实际阶段数据质量
 */
import "./index.less"
import { DEVICE_DATA_ERROR } from "../../configs/site-quality"
import { useContext, useEffect, useState } from "react"
import { judgeNull } from "@/utils/util-funs"
import { useRefresh } from "@/hooks/use-refresh"
import { getErrorDeviceInfo } from "../../methods"
import AreaQualityContext from "../../configs/use-data-context"

export default function AreaActQuality() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const [refresh, setRefresh] = useRefresh(60 * 1000) // 一分钟
  const { areaQualityCt } = useContext(AreaQualityContext)
  const getQuotaInfo = async () => {
    const res = await getErrorDeviceInfo({ stationCode: areaQualityCt.stationCode })
    if (!res) return
    setQuotaInfo(res)
    setRefresh(false)
  }
  useEffect(() => {
    if (!areaQualityCt?.stationCode) return
    setRefresh(true)
  }, [areaQualityCt])
  useEffect(() => {
    if (!refresh || !areaQualityCt?.stationCode) return
    getQuotaInfo()
  }, [refresh, areaQualityCt])
  return (
    <div className="area-act-quality">
      {DEVICE_DATA_ERROR?.map((i) => {
        return (
          <div key={i.key} className="aq-item">
            <div className="aq-item-top">
              <span className="top-l">{judgeNull(quotaInfo?.[i.key])}</span>
              <span className="top-r">{judgeNull(quotaInfo?.[i.rate])}</span>
            </div>
            <span className="label">{i.label}</span>
          </div>
        )
      })}
    </div>
  )
}
