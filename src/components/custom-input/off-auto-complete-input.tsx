/*
 * @Author: xiongman
 * @Date: 2023-10-17 18:00:51
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-17 18:00:51
 * @Description: 自定义密码输入框，避免浏览器保存密码
 */

import "./off-auto-complete-input.less"

import { createUUID } from "@utils/util-funs.tsx"
import { ConfigProvider, Input, InputProps, ThemeConfig } from "antd"
import { useEffect, useMemo, useState } from "react"

const ANT_THEME: ThemeConfig = {
  components: {
    Input: {
      colorText: "var(--fontcolor)",
      colorTextQuaternary: "#0b468d",
      colorTextTertiary: "#1857a1",
      colorBgContainer: "transparent",
      hoverBorderColor: "none",
      colorBorder: "transparent",
      controlOutline: "transparent",
    },
  },
}

interface IProps extends InputProps {
  type?: "password"
}
export default function OffAutoCompleteInput(props: IProps) {
  const { type } = props
  const [isDisable, setIsDisable] = useState(true)
  const Component = useMemo(() => (type === "password" ? Input.Password : Input), [type])
  useEffect(() => {
    if (props.value) return
    setIsDisable(true)
    window.setTimeout(() => setIsDisable(false), 500)
  }, [props.value])
  const hackProps = useMemo(() => {
    const p = { id: createUUID(), className: "hack-input" }
    // @ts-ignore
    if (type === "password") p.visibilityToggle = false
    return p
  }, [type])
  return (
    <div className="custom-psd-wrap">
      <ConfigProvider theme={ANT_THEME}>
        <Component {...hackProps} />
        <Component allowClear disabled={isDisable} {...props} autoComplete="off" className="main-input" />
      </ConfigProvider>
    </div>
  )
}
