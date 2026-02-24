/*
 * @Author: xiongman
 * @Date: 2023-10-17 10:39:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 11:17:09
 * @Description:
 */

import "./operate-step.less"
import { sm3 } from "sm-crypto"
import { showMsg } from "@utils/util-funs.tsx"
import { Button, Steps } from "antd"
import classNames from "classnames"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { STEP_ITEMS, STEP_KEY } from "@/components/device-control/configs.ts"
import {
  IDualPsdSafeLoginForm,
  IOperateInfo,
  IStepContentInst,
  TAuthFormData,
} from "@/components/device-control/types.ts"
import { IFormValidError } from "@/types/i-antd.ts"

import Authentication from "./authentication.tsx"
import ConfirmInfo from "./confirm-info.tsx"
import { TDeviceType } from "@/types/i-config.ts"

function styleFun(step: number, target: number) {
  return classNames({ "content-item": true, show: step === target })
}

export interface IOperateStepRef {
  setStep: (step: number) => void
  setStepVal?: (step: number, data: IOperateInfo) => void
}
export interface IOperateStepProps {
  data: IOperateInfo
  buttonClick?: (type: "ok" | "close", currentStep: number, data?: IDualPsdSafeLoginForm) => Promise<boolean | void>
  loading?: boolean
  type?: string | number
  deviceType?: TDeviceType
}

const { STEP_INFO, AUTH_VERIFY } = STEP_KEY

const OperateStep = forwardRef<IOperateStepRef, IOperateStepProps>((props, ref) => {
  const { data, buttonClick, loading, deviceType } = props

  const [step, setStep] = useState(0)
  const infoRef = useRef<IStepContentInst>()
  const authVerifyRef = useRef<IStepContentInst<TAuthFormData>>()
  const dataRef = useRef(data)
  dataRef.current = data
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    setStep: stepChgRef.current,
  }))

  const stepChgRef = useRef((current: number) => {
    if (current > AUTH_VERIFY) current = AUTH_VERIFY
    setStep(current)
  })

  const btnClkRef = useRef((type: "prev" | "ok" | "close", current: number) => {
    if (!dataRef.current) return showMsg("未获取到操作数据，不能执行操作！")
    if (type === "prev") return stepChgRef.current(current - 1)
    if (type === "ok" && current === AUTH_VERIFY) {
      ;(async function () {
        const validInfo = await authVerifyRef.current?.getData()
        // 表单校验出错的返回值中有 errorFields 字段信息，无错时值是表单数据对象
        if ((validInfo as IFormValidError<IDualPsdSafeLoginForm>).errorFields) return
        const validSucessData = validInfo as IDualPsdSafeLoginForm
        const params: IDualPsdSafeLoginForm = {
          name1: validSucessData.name1,
          name2: validSucessData.name2,
          pwd1: sm3(validSucessData.pwd1),
          pwd2: validSucessData.pwd2 ? sm3(validSucessData.pwd2) : "",
        }
        const excuteResult = await buttonClick?.(type, current, params)
        // console.log(excuteResult, "excuteResult")
        if (!excuteResult) {
          authVerifyRef.current?.setData({ pwd1: "", pwd2: "" })
        } else {
          authVerifyRef.current?.setData()
        }
        if (excuteResult) buttonClick?.("close", current)?.then((r) => r)
      })()
      return
    }
    buttonClick?.(type, current)?.then((r) => r)
  })

  const isAuth = useMemo(() => step === AUTH_VERIFY, [step])
  return (
    <div className="operate-step-wrap">
      <Steps size="small" current={step} items={STEP_ITEMS} />
      <div className="content-wrap">
        <div className={styleFun(step, STEP_INFO)} children={<ConfirmInfo ref={infoRef} data={data} />} />
        <div
          className={styleFun(step, AUTH_VERIFY)}
          children={<Authentication ref={authVerifyRef} data={data} step={step} deviceType={deviceType} />}
        />
      </div>
      <div className="step-footer">
        {isAuth ? (
          <Button
            size="small"
            children="返回"
            loading={loading}
            disabled={loading}
            onClick={btnClkRef.current.bind(null, "prev", step)}
          />
        ) : null}
        <Button
          size="small"
          type="primary"
          children="确认"
          loading={loading}
          disabled={loading}
          onClick={btnClkRef.current.bind(null, "ok", step)}
        />
        <Button
          size="small"
          children="关闭"
          loading={loading}
          disabled={loading}
          onClick={btnClkRef.current.bind(null, "close", step)}
        />
      </div>
    </div>
  )
})

export default OperateStep
