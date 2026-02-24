
import "./index.less"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { IModelListData } from "@/pages/setting-state-model/types"

import { getStateNumberInfo } from "../methods"
import useStateType from "../useStateType"
import { getStorage, setStorage } from "@/utils/util-funs"
import { StorageStateChoose } from "@/configs/storage-cfg"

export default function AreaStateList(props) {
  const { deviceType, setState, chooseAll, combineData } = props
  const [stateKeyList, setStateKeyList] = useState([])
  const { currntStateList, unKnownState } = useStateType(deviceType)
  const storageStateStatus = useRef(getStorage(StorageStateChoose))
  const stateNumberInfo = useMemo<IModelListData[]>(() => {
    return getStateNumberInfo(currntStateList, combineData, unKnownState)
  }, [currntStateList, combineData])

  const hexToRgba = useRef((hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  })

  // 设备类型改变，置空所选的
  useEffect(() => {
    setStateKeyList([])
  }, [deviceType])
  const chooseState = (state) => {
    const isExist = stateKeyList.indexOf(state)
    const actualExist = [...stateKeyList]
    isExist !== -1 ? actualExist.splice(isExist, 1) : actualExist.push(state)
    setStateKeyList(actualExist)
  }

  const chooseStateList = useCallback(
    (info) => {
      const gorupList = info.children.map((i) => i.state) // 当前组所有状态
      const activeGroupList = stateKeyList.filter((i) => gorupList.includes(i)) // 当前组活动的状态
      const unactiveGroupList = gorupList.filter((i) => !activeGroupList.includes(i)) // 当前组不活动的状态
      const otherActiveGroupList = stateKeyList.filter((i) => !gorupList.includes(i)) // 其它组活动的状态
      if (gorupList.length !== activeGroupList.length || !activeGroupList.length) {
        // 全选
        setStateKeyList(stateKeyList.concat(unactiveGroupList))
      } else {
        // 全不选
        setStateKeyList(otherActiveGroupList)
      }
    },
    [stateKeyList],
  )

  useEffect(() => {
    setStateKeyList([])
  }, [chooseAll])
  useEffect(() => {
    setState([...stateKeyList])
    setStorage([...stateKeyList], StorageStateChoose)
  }, [stateKeyList])
  useEffect(() => {
    const stateStatus = storageStateStatus.current || []
    setStateKeyList(stateStatus)
  }, [])
  return (
    <div className="area-state-list">
      {stateNumberInfo?.map((i) => {
        return (
          <div key={i.id} className="state-item" style={{ borderColor: i.color }}>
            <div
              className="state-item-title"
              onClick={() => chooseStateList(i)}
              style={{ backgroundColor: hexToRgba.current(i.color, 0.6) }}
            >
              {i.stateDesc}
              {`(${i.num})`}
            </div>
            <div className="state-item-children">
              {i.children.map((state) => {
                return (
                  <div key={state.id} className="item-children">
                    <div
                      className="item-children-item"
                      style={{
                        color: i.color,
                        backgroundColor: stateKeyList.includes(state.state)
                          ? hexToRgba.current(i.color, 0.4)
                          : "transparent",
                      }}
                      onClick={() => {
                        chooseState(state.state)
                      }}
                    >
                      <span className="state-icon" style={{ backgroundColor: hexToRgba.current(i.color, 0.9) }}>
                        {state.state}
                      </span>
                      <span className="state-name">{`${state.stateDesc}(${state.num})`}</span>
                    </div>
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
