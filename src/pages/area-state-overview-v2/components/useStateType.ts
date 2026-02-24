/*
 * @Author: chenmeifeng
 * @Date: 2024-01-16 10:07:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-10 16:14:54
 * @Description:
 */
import { useEffect, useMemo, useState } from "react"

import { getStateList } from "../methods"

export default function useStateType(deviceType) {
  // const currntStateList = useMemo(async () => {
  //   const res = await getStateList(deviceType)
  //   return res || []
  // }, [deviceType])
  const [currntStateList, setCurrntStateList] = useState([])
  const getState = async () => {
    const res = await getStateList(deviceType)
    setCurrntStateList(res)
  }
  useEffect(() => {
    getState()
  }, [deviceType])
  //无通讯或未知
  const unKnownState = useMemo(() => {
    const unKnownParent = currntStateList.filter((i) => i.stateDesc === "无通讯")
    const unKnownChild = unKnownParent?.length
      ? unKnownParent[0].children.filter((i) => i.stateDesc === "无通讯")
      : unKnownParent
    return unKnownChild?.[0] || { state: 15 }
  }, [currntStateList])
  return useMemo(() => {
    return { unKnownState, currntStateList }
  }, [unKnownState, currntStateList])
}
