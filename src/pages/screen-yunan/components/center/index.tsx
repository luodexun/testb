/*
 * @Author: chenmeifeng
 * @Date: 2024-07-23 15:03:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-03 17:08:20
 * @Description: 中间模块
 */
import "./index.less"
import { parseNum } from "@/utils/util-funs"
import { CENTER_QUOTA } from "../../configs"
import YNCommonQuotaBox from "../common-quota"
import { useRef, useState } from "react"
import YNCenterMap from "./map"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"

export default function YNCenter() {
  const [quotaInfo, setQuotaInfo] = useState(null)
  const mainCpnInfo = useAtomValue(mainComAtom)
  const [isControl, setIsControl] = useState(true)
  const setQtInfo = useRef((e) => {
    setQuotaInfo(e)
    if (e.name === "集控中心") {
      setIsControl(true)
      return
    }
    setIsControl(false)
  })
  return (
    <div className="yn-center">
      <div className="yn-center-top">
        <YNCenterMap setQuotaInfo={setQtInfo.current} />
        <span className="site-name">{quotaInfo?.name || "集控中心"}</span>
      </div>
      <div className="yn-center-bottom">
        {CENTER_QUOTA?.map((i) => {
          const unitTrans = i.needUnitTrans ? i.needUnitTrans : 1 // 单位转换
          const value = isControl ? (mainCpnInfo?.[i.key] || 0) * unitTrans : (quotaInfo?.[i.key] || 0) * unitTrans
          return (
            <div key={i.key} className="ct-quota">
              <YNCommonQuotaBox horizontal={false} name={i.name} unit={i.unit} value={parseNum(value)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
