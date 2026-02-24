
import { useMemo } from "react"

// import { getStateList } from "./methods"

export default function useStateType(deviceType) {
  const currntStateList = useMemo(() => {
    return  []
    // return getStateList(deviceType) || []
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
