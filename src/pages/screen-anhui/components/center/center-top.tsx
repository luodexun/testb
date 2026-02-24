/*
 * @Author: chenmeifeng
 * @Date: 2024-07-10 10:29:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-12 16:42:20
 * @Description:
 */
import "./center-top.less"
import { mainComAtom } from "@/store/atom-screen-data"
import { parseNum } from "@/utils/util-funs"
import { useAtomValue } from "jotai"
import { useRef } from "react"

export default function AhCtTop() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  const ddd = 23456
  const transNum = useRef((value) => {
    if (!value) return ["-"]
    const VirVal = parseNum(value).toString()
    return VirVal.split("")
  })
  return (
    <div className="ah-cqt">
      <span className="ah-cqt-name">总装机</span>
      <div className="ah-cqt-val">
        {transNum.current(mainCpnInfo?.["totalInstalledCapacity"])?.map((i, idx) => {
          return (
            <span key={idx} className="ah-cqt-vitem">
              {i}
            </span>
          )
        })}
      </div>
      <span className="ah-cqt-name">万kW</span>
    </div>
  )
}
