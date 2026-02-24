/*
 * @Author: xiongman
 * @Date: 2023-11-03 15:19:29
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-03 15:19:29
 * @Description: 验证码输入框组件
 */

import "./verify-code-input.less"

import { vDate } from "@utils/util-funs.tsx"
import { Input, InputProps } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs.ts"

export interface IVerifyCodeInputRef {
  refresh?: () => void
}
interface IProps extends Omit<InputProps, "value" | "onChange"> {
  value?: { code: string; uuid: string | null }
  onChange?: (value: IProps["value"]) => void
}
interface ICaptchaRes {
  image: string
  uuid: string
}

// eslint-disable-next-line react-refresh/only-export-components
export function codeInputValidator(_: any, value: IProps["value"]) {
  if (!value || !value.code) return Promise.reject()
  return Promise.resolve()
}

const VerifyCodeInput = forwardRef<IVerifyCodeInputRef, IProps>((props, ref) => {
  const { value, onChange, ...inputProps } = props
  const [imgSrc, setImgSrc] = useState<string>()
  const prevTimeRef = useRef(0)
  const imageUUIDRef = useRef(null)
  const chgRef = useRef(onChange)
  chgRef.current = onChange

  const refreshSrc = useRef(async () => {
    imageUUIDRef.current = null
    chgRef.current?.({ code: undefined, uuid: null })
    const timestamp = vDate().valueOf()
    if (timestamp - prevTimeRef.current < 1000) return
    prevTimeRef.current = timestamp
    const img = await doBaseServer<{ timestamp: number }, ICaptchaRes>("getCaptcha", { timestamp })
    if (!img?.image) return
    imageUUIDRef.current = img.uuid
    setImgSrc(img.image)
  })

  useImperativeHandle(ref, () => ({
    refresh: () => refreshSrc.current(),
  }))

  useEffect(() => {
    refreshSrc.current()
  }, [])

  const iptChgRef = useRef<InputProps["onChange"]>((event) => {
    const result = { code: event.target.value as string, uuid: imageUUIDRef.current }
    chgRef.current?.(result)
  })

  return (
    <div className="verify-code-input-wrap">
      <Input
        placeholder="请输入验证码"
        {...inputProps}
        className="verify-input"
        value={value?.code}
        onChange={iptChgRef.current}
      />
      <img src={imgSrc} title="换一张" className="verify-code" alt="错误" onClick={refreshSrc.current} />
    </div>
  )
})
export default VerifyCodeInput
