/*
 *@Author: chenmeifeng
 *@Date: 2023-10-19 15:30:40
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-19 15:30:40
 *@Description: 删除内容
 */

import "./remoce-content.less"

import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { forwardRef, useImperativeHandle, useRef } from "react"

import { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step.tsx"
import { ILoginParams } from "@/types/i-auth.ts"

interface IProps extends Omit<IOperateStepProps, "buttonClick" | "data"> {
  buttonClick?: (type: "ok" | "close" | "delete_ok", currentStep?: number, data?: ILoginParams) => void
}

const RemoveContent = forwardRef<IOperateStepRef, IProps>((props, ref) => {
  const { buttonClick, loading } = props
  const stepChgRef = useRef(() => {})

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    setStep: stepChgRef.current,
  }))

  const btnClkRef = useRef((type: "ok" | "close" | "delete_ok") => {
    buttonClick?.(type)
  })

  return (
    <div className="remove-wrap">
      <p className="icon">
        <ExclamationCircleOutlined twoToneColor="#eb2f96" style={{ color: "#FF7A04", fontSize: "2rem" }} />
      </p>
      <p className="text">是否确认删除？</p>
      <div className="step-footer">
        <Button
          size="small"
          type="primary"
          children="确认"
          loading={loading}
          disabled={loading}
          onClick={btnClkRef.current.bind(null, "delete_ok")}
        />

        <Button
          size="small"
          children={"取消"}
          loading={loading}
          disabled={loading}
          onClick={btnClkRef.current.bind(null, "close")}
        />
      </div>
    </div>
  )
})

export default RemoveContent
