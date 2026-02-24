/*
 * @Author: xiongman
 * @Date: 2023-08-30 12:32:20
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-31 09:24:26
 * @Description:
 */

import "./state-btn-group.less"

import { getDvsMainStateList } from "@hooks/use-matrix-device-list.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { useAtomValue } from "jotai"
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

import StateButton from "@/components/state-button/index.tsx"
import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config.ts"

interface IProps {
  data?: Record<string, number>
  deviceType: TDeviceType
  value?: IConfigDeviceStateData["stateDesc"][]
  onChange?: (checked: IProps["value"]) => void
  style?: CSSProperties
}

type TCheckedMap = Partial<Record<IProps["value"][0], boolean>>

export default function StateBtnGroup(props: IProps) {
  const { value, data, onChange, deviceType, style } = props
  const [checkedMap, setCheckedMap] = useState<TCheckedMap>({})
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map
  const valRef = useRef(value)

  const options = useMemo<IConfigDeviceStateData[]>(() => {
    if (!deviceType) return []
    // 获取设备类型下的主状态列表
    const { stateInfoList } = getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN", "old")
    return stateInfoList
  }, [deviceStdStateMap, deviceType])

  useEffect(() => {
    valRef.current = value || []
    // 设置选中的值
    if (!value) return
    setCheckedMap((prevState) => {
      const checkedKeys = Object.keys(prevState)
      if (value.length === checkedKeys.length) return prevState
      if (!value.length) return {}
      const checkedArr = checkedKeys.filter((key) => prevState[key])
      if (checkedArr.length !== value.length || checkedArr.find((k) => !value.includes(k))) {
        return value.reduce((prev, key) => (prev[key] = true) && prev, prevState)
      }
      return prevState
    })
  }, [value])

  const onChgRef = useRef(onChange)
  onChgRef.current = onChange
  useEffect(() => {
    const checkedArr = Object.keys(checkedMap).filter((key) => checkedMap[key])
    const valueStr = valRef.current?.join(";")
    if (checkedArr.length !== valRef.current.length || !!checkedArr.find((k) => !valueStr.includes(k))) {
      onChgRef.current?.(checkedArr)
    }
  }, [checkedMap])

  const chgRef = useRef((key: IProps["value"][0], checked: boolean) => {
    // 按钮点击处理方法
    setCheckedMap((prevState) => ({ ...prevState, [key]: checked }))
  })

  return (
    <div className="state-btn-group" style={style}>
      {(options || []).map((info) => (
        <StateButton
          key={info.id}
          info={info}
          value={data?.[info?.stateDesc ?? "-"] || 0}
          checked={checkedMap[info.stateDesc]}
          onChange={onChange ? chgRef.current : undefined}
        />
      ))}
    </div>
  )
}
