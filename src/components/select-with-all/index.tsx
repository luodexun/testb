/*
 * @Author: xiongman
 * @Date: 2023-04-20 15:47:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-16 11:07:31
 * @Description: 带全选的下拉框选择器
 */

import "./index.less"

import { CaretRightOutlined } from "@ant-design/icons"
import { Select } from "antd"
import type { DefaultOptionType, SelectProps } from "antd/es/select"
import { useCallback, useEffect, useMemo, useRef } from "react"

interface IProps extends SelectProps {
  showAll?: boolean
  needFirst?: boolean
}
const itemAll: DefaultOptionType = { value: "-all-", label: <span style={{ color: "#bdb3b3" }}>全选</span> }

function filterFun(inputValue: string, option?: DefaultOptionType) {
  if (option?.value === "-all-" || typeof option?.label !== "string") return false
  return option?.label?.includes(inputValue.trim())
}

export default function SelectWithAll(props: IProps) {
  const {
    value,
    defaultValue,
    allowClear = true,
    mode,
    onChange,
    options,
    labelInValue,
    style,
    needFirst,
    showAll,
    ...selectProps
  } = props || {}

  const onChangeRef = useRef<IProps["onChange"]>()
  const valueRef = useRef<any>()

  // 添加全选项后的选项们
  const allOptions: IProps["options"] = useMemo(() => {
    if (!options?.length || mode !== "multiple" || !showAll) return options
    // 添加全选项
    return [itemAll, ...options]
  }, [options, mode, showAll])

  onChangeRef.current = onChange
  valueRef.current = value

  // 处理下拉项选中事件，针对全选项点击处理，当全选时一定是多选模式
  const handleSelect = useCallback(
    (selected: SelectProps["value"]) => {
      if (!onChangeRef.current) return
      // labelInValue 为 true 时，选中值是对象
      const selectVal = labelInValue ? selected?.value : selected
      // 只对点选全选项做处理
      if (selectVal !== itemAll.value) return
      let allChecks: SelectProps["value"] = []
      let allOptions: DefaultOptionType[] = []
      // 值是空，则全选，有值则清空
      if (!valueRef.current?.length) {
        allChecks = labelInValue ? options : (options || []).map((item) => item.value)
        allOptions = options
      }

      onChangeRef.current(allChecks, allOptions)
    },
    [labelInValue, options],
  )

  useEffect(() => {
    // 处理默认值或者选项是全选的情况
    if (mode !== "multiple" || !showAll) return
    // 多选情况下的值或默认值应该是数组
    if ((defaultValue && !Array.isArray(defaultValue)) || (value && !Array.isArray(value))) {
      throw Error("SelectWithAll: 多选情况下的值或默认值应该是数组")
    }
    if (defaultValue?.includes(itemAll.value) || value?.includes(itemAll.value)) {
      valueRef.current = []
      handleSelect(itemAll.value)
    }
  }, [defaultValue, handleSelect, mode, showAll, value])

  useEffect(() => {
    // 处理需要首选项参数逻辑
    if (!needFirst || !allOptions?.length) return
    const theFirst = allOptions[0]
    if (theFirst.value === itemAll.value) {
      return handleSelect(theFirst.value)
    }
    let checks: any = theFirst ? [theFirst] : []
    let option: DefaultOptionType | DefaultOptionType[]
    if (mode === "multiple") {
      checks = labelInValue ? [...checks] : checks?.map((item: DefaultOptionType) => item.value)
      option = theFirst ? [theFirst] : undefined
    } else {
      checks = labelInValue ? checks?.[0] : checks?.[0]?.value
      option = theFirst || undefined
    }

    onChangeRef.current(checks, option)
  }, [allOptions, handleSelect, labelInValue, mode, needFirst])

  return (
    <Select
      showSearch
      allowClear={allowClear}
      className="select-with"
      optionFilterProp="children"
      filterOption={filterFun}
      popupMatchSelectWidth={false}
      maxTagCount={1}
      value={value}
      mode={mode}
      labelInValue={labelInValue}
      suffixIcon={<CaretRightOutlined />}
      style={{ minWidth: "8em", ...(style || {}) }}
      {...selectProps}
      options={allOptions}
      onSelect={handleSelect}
      onChange={onChange}
    />
  )
}
