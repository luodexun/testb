/*
 * @Author: chenmeifeng
 * @Date: 2024-12-09 15:15:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-04 17:14:45
 * @Description:
 */
import "./state.less"

import { useAtomValue } from "jotai"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"

import DvsDetailContext from "@/contexts/dvs-detail-context"
import { getDvsMainStateList } from "@/hooks/use-matrix-device-list"
import { AtomConfigMap } from "@/store/atom-config"
import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config"
import { IDeviceData } from "@/types/i-device"
interface IProps {
  realtimeDvsData: IDeviceData[]
}
export default function MatrixState(props: IProps) {
  const { realtimeDvsData } = props
  const [state, setState] = useState([])

  const { currentChooseState, setCurrentChooseState, deviceType } = useContext(DvsDetailContext)
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map

  const options = useMemo<IConfigDeviceStateData[]>(() => {
    if (!deviceType) return []
    // 获取设备类型下的主状态列表
    const { stateInfoList } = getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN", "old")
    return stateInfoList
  }, [deviceStdStateMap, deviceType])
  const dvsStateCountLs = useMemo<{ [state: number | string]: { count: number } }>(() => {
    const result = options?.reduce((prev, cur) => {
      if (!prev?.[cur.state]) {
        const count = realtimeDvsData?.filter((i) => i.runData?.mainState == cur.state)?.length || 0
        prev[cur.state] = {
          count: count,
        }
      }
      return { ...prev }
    }, {})
    return result
  }, [options, realtimeDvsData, deviceType])
  // 选中的样式
  const activeStyle = useCallback(
    (state: IConfigDeviceStateData) => {
      if (!currentChooseState?.length || !currentChooseState?.includes(state.state)) return {}
      return {
        borderColor: state.color,
        // color: state.color,
        background: `linear-gradient(180deg, ${state.color} 0%, rgba(19,102,19,0.1) 40%)`,
      }
    },
    [currentChooseState],
  )
  const chooseState = (item) => {
    if (state.includes(item)) {
      const ls = state.filter((i) => i !== item) || []
      setCurrentChooseState(ls)
      setState([...ls])
    } else {
      const ls = state.concat([item])
      setCurrentChooseState(ls)
      setState([...ls])
    }
  }
  useEffect(() => {
    setCurrentChooseState([])
    setState([])
  }, [deviceType])
  return (
    <div className="mtx-state-list">
      {options?.map((state) => {
        const count = dvsStateCountLs?.[state.state]?.count || 0
        return (
          <div
            key={state.state}
            className="mtx-state-item"
            style={activeStyle(state)}
            onClick={() => chooseState(state.state)}
          >
            <i className="icon" style={{ backgroundColor: state.color }}></i>
            <span>{`${state.stateDesc}(${count})`}</span>
          </div>
        )
      })}
    </div>
  )
}
