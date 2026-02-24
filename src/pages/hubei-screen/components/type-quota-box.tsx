/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 13:53:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-29 15:52:20
 * @Description:
 */
import { useContext, useMemo } from "react"

import HbScreenContext from "@/contexts/hubei-screen-context"
import { parseNum } from "@/utils/util-funs"

import { ITypeQuota } from "../types"

interface IProps {
  list: ITypeQuota[]
}
export default function TypeQuotaBox(props: IProps) {
  const { list } = props
  const { quotaInfo } = useContext(HbScreenContext)
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
    <div className="tlist-box">
      {list.map((i) => {
        return (
          <div className="tlist-box-item" key={i.key}>
            <i className="tlist-item-icon"></i>
            <div>
              <span className="tlist-item-value">{parseNum(transData?.[i.key]) || "-"}</span>
              <span className="tlist-item-name">{i.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
