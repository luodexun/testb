/*
 * @Author: chenmeifeng
 * @Date: 2025-04-10 14:57:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-10 16:59:48
 * @Description:
 */
import "./dvs-state-alarmbox.less"
import { IDvsAlarmData } from "@/types/i-alarm"
import { CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useRef } from "react"
import Draggable from "react-draggable"

interface IProps {
  info: IDvsAlarmData
  btnClick?: (type) => void
}
export default function DvsStateBox(props: IProps) {
  const { info, btnClick } = props
  const nodeRef = useRef(null)
  return (
    <Draggable nodeRef={nodeRef}>
      <div className="state-alarm-box" ref={nodeRef}>
        <CloseOutlined
          style={{ cursor: "pointer" }}
          className="close"
          onClick={() => {
            btnClick?.("close")
          }}
        />
        <span>{info?.stationDesc + info?.deviceDesc + "风机通讯中断、限电"}</span>
      </div>
    </Draggable>
  )
}
