/*
 * @Author: xiongman
 * @Date: 2023-12-08 10:50:47
 * @LastEditors: xiongman
 * @LastEditTime: 2023-12-08 10:50:47
 * @Description:
 */

import "./device-global-filter.less"

import { SITE_LAYOUT, TSiteLayout } from "@configs/option-const.tsx"
import NamePanel from "@pages/area-matrix/components/name-panel.tsx"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomDvsStateCountMap, AtomDvsStFilter4GlbMap } from "@store/atom-run-device.ts"
import { Space } from "antd"
import { useAtom, useAtomValue } from "jotai"
import { useContext, useMemo, useRef } from "react"

import InfoCard from "@/components/info-card"
import SelectWithAll from "@/components/select-with-all"
import StateBtnGroup from "@/components/state-button/state-btn-group.tsx"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { TOptions } from "@/types/i-antd.ts"
import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config.ts"
import { getSortSelectOpts } from "@/utils/util-funs"

export default function DeviceGlobalFilter() {
  const dvsStateCountMap = useAtomValue(AtomDvsStateCountMap)
  const [glbDvsStFilter, setGlbDvsStFilter] = useAtom(AtomDvsStFilter4GlbMap)
  const { setDrawerOpenMap } = useContext(DvsDetailContext)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map

  const dvsTypeInfoList = useMemo(() => {
    const dvsTypeKeys = Object.keys(dvsStateCountMap || {})
    if (!dvsTypeKeys?.length) return []
    return dvsTypeKeys
      .map((dvsType) => ({ value: dvsType, label: deviceTypeMap?.[dvsType] }))
      .filter(({ label }) => !!label) as TOptions<TDeviceType>
  }, [deviceTypeMap, dvsStateCountMap])

  const dvsStCountMap = useMemo(() => {
    const dvsTypeKeys = Object.entries(dvsStateCountMap || {})
    if (!dvsTypeKeys?.length) return {}
    return dvsTypeKeys.reduce((prev, [dvsType, stCountMap4Site]) => {
      prev[dvsType] = Object.values(stCountMap4Site).reduce((prevCountMap, stCountMap) => {
        Object.entries(stCountMap).forEach(([stateLabel, count]) => {
          if (!prevCountMap[stateLabel]) prevCountMap[stateLabel] = 0
          prevCountMap[stateLabel] += count
        })
        return prevCountMap
      }, {})
      return prev
    }, {})
  }, [dvsStateCountMap])

  const setOpenFilterRef = useRef(setDrawerOpenMap)
  setOpenFilterRef.current = setDrawerOpenMap
  const onFilterClk = useRef(() => setOpenFilterRef.current?.({}))

  const setGlbDvsStFilterRef = useRef(setGlbDvsStFilter)
  setGlbDvsStFilterRef.current = setGlbDvsStFilter
  const setLayoutRef = useRef((layout: TSiteLayout) => {
    setGlbDvsStFilterRef.current((prev) => ({ ...prev, glbLayout: layout || "site" }))
  })

  const setCheckedStateRef = useRef((dvsType: TDeviceType, checked: IConfigDeviceStateData["stateDesc"][]) => {
    setGlbDvsStFilterRef.current((prev) => {
      if (!prev.glbCheckedState) prev.glbCheckedState = {}
      prev.glbCheckedState[dvsType] = checked
      return { ...prev }
    })
  })

  const layout = useMemo(() => glbDvsStFilter?.glbLayout, [glbDvsStFilter?.glbLayout])
  const checkedState = useMemo(() => glbDvsStFilter?.glbCheckedState, [glbDvsStFilter?.glbCheckedState])
  return (
    <InfoCard title="全站运行状态" titleClick={onFilterClk.current} className="l-full page-wrap dvs-glb-filter-wrap">
      <Space className="dvs-glb-layout-filter">
        <span>排列方式：</span>
        <SelectWithAll
          size="small"
          value={layout}
          options={getSortSelectOpts()}
          onChange={setLayoutRef.current}
          placeholder="场站排列"
        />
      </Space>
      <div className="dvs-glb-state-filter mt-1em">
        {dvsTypeInfoList.map(({ value, label }) => (
          <div key={value} className="l-full">
            <NamePanel name={label} />
            <StateBtnGroup
              deviceType={value}
              data={dvsStCountMap?.[value]}
              value={checkedState?.[value]}
              onChange={setCheckedStateRef.current.bind(null, value)}
            />
          </div>
        ))}
      </div>
    </InfoCard>
  )
}
