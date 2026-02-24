/*
 * @Author: chenmeifeng
 * @Date: 2024-01-31 18:18:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-13 17:38:56
 * @Description: 区域中心-能量管理总览
 */

import "./index.less"

import { validResErr } from "@utils/util-funs"
import { useEffect, useState } from "react"

import { doNoParamServer } from "@/api/serve-funs"
import { IStationData } from "@/types/i-station"

import TabAreaEnergy from "./components/tab-model"
import { getDvsMeasurePointsData } from "@/utils/device-funs"
export default function AreaEnergy() {
  useEffect(() => {
    // const res = getDvsMeasurePointsData({ modelId: 90, deviceId: 1188, pointTypes: "3" })
  }, [])
  return (
    <div className="l-full">
      <TabAreaEnergy />
    </div>
  )
}
