/*
 * @Author: chenmeifeng
 * @Date: 2024-12-23 17:16:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-13 11:43:59
 * @Description:
 */
import "./index.less"
import TransfromTime from "./TransfromTime"
import { CSSProperties, useCallback, useRef, useState } from "react"
import { IRpPowerData } from "../../types"
import { saveFormData } from "../../methods"
import { CloseOutlined } from "@ant-design/icons"
interface IProps {
  record: IRpPowerData
  nameKey: string
  text: number | string
  rate?: number
}
export default function ComparePopower(props: IProps) {
  const { text, nameKey, record, rate = 1 } = props
  const [overlayStayle, setOverlayStayle] = useState(null)
  const [showPoper, setShowPoper] = useState(false)
  const clickCell = useRef((e) => {
    // console.log(e, "er", record)
    const { clientX, clientY } = e
    setOverlayStayle({
      x: clientX,
      y: clientY,
    })
    setShowPoper((prev) => !prev)
  })
  const closePoper = useCallback(() => {
    setShowPoper(false)
  }, [])
  return (
    <div className="rp-popver-wai">
      <span className="rp-popver-span" onClick={(e) => clickCell.current(e)}>
        {text}
      </span>
      {showPoper ? (
        <div className="pp-div">
          <CloseOutlined onClick={closePoper} style={{ float: "right" }} />
          <TransfromTime rate={rate} saveFormData={saveFormData} record={record} nameKey={nameKey} />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
