/*
 * @Author: chenmeifeng
 * @Date: 2024-01-16 10:07:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-19 15:41:38
 * @Description:
 */
import { useMemo } from "react"

import { getStateList } from "../methods"
//无通讯或未知
export default function useStateType(deviceType) {
  const currntStateList = useMemo(() => {
    return getStateList(deviceType) || []
  }, [deviceType])
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
