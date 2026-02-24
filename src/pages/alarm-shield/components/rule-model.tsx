/*
 * @Author: chenmeifeng
 * @Date: 2024-03-07 10:38:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-07 14:04:22
 * @Description:
 */
import { Input, InputProps } from "antd"
import { useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"

import RuleTable from "./rule-table"

export default function RuleModel(props: InputProps) {
  const { value, onChange, ...otherProps } = props
  const [curVal, setCurVal] = useState("")
  const modelRef = useRef(null)
  const [cancelOpen, setCancelOpen] = useState(false)

  const getSelectInfo = useRef(() => {
    const { alarmDesc, alarmId } = modelRef.current?.getChildrenRef()?.selectedRows?.[0] || {}
    setCurVal(alarmDesc)
    setCancelOpen(false)
    onChange(alarmId)
  })
  return (
    <div className="w-100 limit-power-button-wrap">
      <Input value={curVal} onClick={() => setCancelOpen(true)} {...otherProps} />
      <CustomModal
        ref={modelRef}
        width="70%"
        title="屏蔽取消"
        destroyOnClose
        open={cancelOpen}
        onOk={getSelectInfo.current}
        onCancel={() => setCancelOpen(false)}
        Component={RuleTable}
        // componentProps={{ buttonClick: closeModal.current }}
      />
    </div>
  )
}
