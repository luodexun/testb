/*
 * @Author: xiongman
 * @Date: 2023-09-01 10:14:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-19 16:13:58
 * @Description: 场站设备矩阵-单场站、单设备类型
 */

import "./device-matrix-for-type.less"

import { SITE_LAYOUT, TSiteLayout } from "@configs/option-const.tsx"
import { AtomDvsStateCountMap, AtomDvsStFilter4GlbMap } from "@store/atom-run-device.ts"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import SelectWithAll from "@/components/select-with-all"
import StateBtnGroup from "@/components/state-button/state-btn-group.tsx"
import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config.ts"
import { IDeviceData } from "@/types/i-device.ts"
import { IStationData } from "@/types/i-station.ts"

import DeviceMatrixByGroup from "./device-matrix-by-group.tsx"
import DvsTypeInfoPanel, { TDvsTypeInfo } from "./dvs-type-info-panel.tsx"
import { getSortSelectOpts } from "@/utils/util-funs.tsx"

interface IProps {
  dvsType: TDeviceType
  dvsList: IDeviceData[]
  station: IStationData
}

export default function DeviceMatrixForType(props: IProps) {
  const { dvsType, dvsList, station } = props
  const [checkedState, setCheckedState] = useState<IConfigDeviceStateData["stateDesc"][]>([])
  const [layout, setLayout] = useState<TSiteLayout>("site")
  const [dvsTypeInfo, setDvsTypeInfo] = useState<TDvsTypeInfo>()
  const setDvsStateCountMap = useSetAtom(AtomDvsStateCountMap)
  const glbDvsStFilter = useAtomValue(AtomDvsStFilter4GlbMap)
  const { pathname } = useLocation()
  const isSite = useMemo(() => {
    const isSite = pathname?.startsWith("/site")
    return isSite
  }, [pathname])
  // const actualLayout = useMemo(() => {
  //   const dvsTypeBelong = SITE_LAYOUT?.filter((i) => i.belongType === dvsType)
  //   const other = SITE_LAYOUT?.filter((i) => !i.belongType)
  //   return [...other, ...dvsTypeBelong]
  // }, [dvsType])
  useEffect(() => {
    // 获取设备类型信息
    if (dvsTypeInfo) return
    const { deviceName, deviceType, deviceCode, deviceTypeLabel } = dvsList?.[0] || {}
    if (!deviceCode || !deviceType || !deviceName) return
    setDvsTypeInfo({ deviceName, deviceType, deviceCode, deviceTypeLabel })
  }, [dvsList, dvsTypeInfo])

  useEffect(() => {
    const { glbLayout, glbCheckedState } = glbDvsStFilter
    // 在场站设备矩阵页面不受全站配置影响
    if (isSite && (dvsType === "ESPCS" || dvsType === "PVINV")) {
      setLayout("lineName")
    } else if (isSite && dvsType === "WT") {
      setLayout("site")
    } else {
      // 第一选择是全站配置
      setLayout((prevState) => (prevState === glbLayout ? prevState : glbLayout))
    }
    if (!glbCheckedState?.[dvsType]) return
    setCheckedState(glbCheckedState[dvsType])
  }, [dvsType, glbDvsStFilter, isSite])

  // 是否有运行数据的标记
  const hasRunDataRef = useRef(false)

  // 按状态过滤设备标签，数各个状态的设备数量
  const { matrixList, countMap: dvsStCountMap } = useMemo(() => {
    const result = { matrixList: dvsList, countMap: {} }

    if (!dvsTypeInfo || !hasRunDataRef.current) {
      hasRunDataRef.current = !!dvsList?.find((item) => item.runData)
      return result
    }
    // 按所选状态id过滤，没选择状态则全部添加
    if (checkedState?.length) result.matrixList = []

    let mainStateLabel: string
    // 遍历迭代设备列表，执行状态过滤和状态数量统计
    return dvsList.reduce((prev, item) => {
      // 运行状态中文标签
      // 无通讯或未知
      mainStateLabel = item.runData?.["mainStateLabel"] || "无通讯"
      // 按所选状态id过滤，没选择状态则全部添加
      if (checkedState.includes(mainStateLabel)) prev.matrixList.push(item)

      // 状态数量统计，形成 状态标签-数量 的映射对象，作为状态选择按钮组的数据
      prev.countMap[mainStateLabel] = (prev.countMap[mainStateLabel] ?? 0) + 1
      return prev
    }, result)
  }, [dvsTypeInfo, checkedState, dvsList])

  useEffect(() => {
    if (!dvsType || !station) return
    const { stationCode } = station
    setDvsStateCountMap({ stateCountMap: dvsStCountMap, deviceType: dvsType, stationCode })
  }, [dvsStCountMap, dvsType, setDvsStateCountMap, station])

  return (
    <div className="device-matrix-for-type">
      <div className="device-info-and-operate">
        <DvsTypeInfoPanel typeInfo={dvsTypeInfo} station={station} />
        <SelectWithAll
          size="small"
          value={layout}
          options={getSortSelectOpts(dvsType)}
          onChange={setLayout}
          placeholder="场站排列"
        />
      </div>
      <StateBtnGroup deviceType={dvsType} data={dvsStCountMap} value={checkedState} onChange={setCheckedState} />
      <DeviceMatrixByGroup list={matrixList} layout={layout} deviceType={dvsType} />
    </div>
  )
}
