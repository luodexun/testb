/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-23 15:31:01
 * @Description: 单选按钮组件
 */

import { ConfigProvider, Radio, ThemeConfig } from "antd"
import type { CheckboxValueType } from "antd/es/checkbox/Group"
import type { RadioGroupProps } from "antd/es/radio/interface"
import { useEffect, useState } from "react"

import type { TOptions } from "@/types/i-antd.ts"

const RADIO_THEME: ThemeConfig = {
  components: {
    Radio: {
      colorBorder: "none",
      buttonColor: "var(--graycolor)",
      colorTextDisabled: "var(--graycolor)",
      buttonBg: "transparent",
      colorPrimary: "transparent",
      buttonSolidCheckedHoverBg: "transparent",
      colorText: "var(--fontcolor)",
      buttonSolidCheckedColor: "var(--fontcolor)",
    },
  },
}
interface IProps<TVal extends CheckboxValueType> extends Omit<RadioGroupProps, "onChange" | "value" | "options"> {
  options?: TOptions<TVal>
  value?: TVal
  onChange?: (value: IProps<TVal>["value"]) => void
}
export default function RadioButton<TVal extends CheckboxValueType>(props: IProps<TVal>) {
  const { value, onChange, options, ...others } = props
  const [theValue, setTheValue] = useState<IProps<TVal>["value"]>(options?.[0]?.value)

  useEffect(() => {
    if (!options?.length) return
    setTheValue(options[0].value)
  }, [options])

  useEffect(() => {
    if (!value || value === theValue) return
    setTheValue(value)
  }, [theValue, value])

  useEffect(() => {
    onChange?.(theValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theValue])

  return (
    <ConfigProvider theme={RADIO_THEME}>
      <Radio.Group
        {...others}
        value={theValue}
        buttonStyle="solid"
        optionType="button"
        options={options}
        onChange={(e) => setTheValue(e.target.value)}
        className="radio-button"
      />
    </ConfigProvider>
  )
}
