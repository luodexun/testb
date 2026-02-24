/*
 * @Author: chenmeifeng
 * @Date: 2024-02-02 09:47:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-11 14:20:57
 * @Description:
 */
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import { getDvsMeasurePointsData } from "@/utils/device-funs"

import { IPointInfo } from "../../types"

export interface IPerateRef {}
export interface ISvgPointMdlProps {
  pointInfo: IPointInfo
}
const SvgPointBox = forwardRef<IPerateRef, ISvgPointMdlProps>((props, ref) => {
  const { pointInfo } = props
  const [currentInfo, setCurrentInfo] = useState(null)
  const getPiontName = async () => {
    const point = await getDvsMeasurePointsData({ deviceId: pointInfo?.deviceId, pointName: pointInfo?.pointName })
    setCurrentInfo(point?.[0] || null)
  }
  useEffect(() => {
    if (pointInfo) {
      getPiontName()
    }
  }, [])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return <div>测点中文名称：{currentInfo?.pointDesc || "-"}</div>
})
export default SvgPointBox
