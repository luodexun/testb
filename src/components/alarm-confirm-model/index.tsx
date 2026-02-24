/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 14:04:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-24 12:38:39
 * @Description:
 */
import "./index.less"

import { Button, Input } from "antd"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"

export interface IPerateRef {
  setConfirmMsg: (step: string) => void
}
export interface IOperateProps {
  data?: any
  buttonClick?: (type: "ok" | "close", Msg: string) => void
  loading?: boolean
}
const AlarmConfirmModel = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { buttonClick } = props
  const [confirmMsg, setConfirmMsg] = useState("")

  const btnClkRef = useRef((type: "ok" | "close", confirmMsg: string) => {
    buttonClick?.(type, confirmMsg)
  })

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    confirmMsg: confirmMsg,
    setConfirmMsg,
  }))
  return (
    <div className="confirm-formItem">
      <div className="confirm-value">
        <div className="confirm-formItem-name">请输入确认备注:</div>
        <Input onChange={(e) => setConfirmMsg(e.target.value)} />
      </div>
      <div className="confirm-bottom">
        <Button onClick={btnClkRef.current.bind(null, "ok", confirmMsg)}>执行</Button>
        <Button onClick={btnClkRef.current.bind(null, "close", confirmMsg)}>取消</Button>
      </div>
    </div>
  )
})

export default AlarmConfirmModel
