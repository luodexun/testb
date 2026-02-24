/*
 * @Author: xiongman
 * @Date: 2023-09-04 17:26:38
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-04 17:26:38
 * @Description: 区域中心-功率总览-图表要素选框
 */

import { Checkbox, ConfigProvider, ThemeConfig } from "antd"
import type { CheckboxOptionType, CheckboxValueType } from "antd/es/checkbox/Group"
import type { CheckboxChangeEvent, CheckboxGroupProps } from "antd/lib/checkbox"
import { useEffect, useMemo, useRef, useState } from "react"

const CHECKBOX_THEME: ThemeConfig = {
  components: {
    Checkbox: {
      colorPrimary: "var(--deep-font-color)",
      colorBgContainer: "var(--primary-color)",
      colorWhite: "var(--bg-active)",
      colorPrimaryHover: "var(--bg-hover)",
    },
  },
}

interface IProps extends Omit<CheckboxGroupProps, "options"> {
  options?: CheckboxOptionType[]
}
export default function ChartElementChackbox(props: IProps) {
  const { options, value, onChange } = props
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(value)

  const checkAll = useMemo(() => options?.length === checkedList.length, [checkedList.length, options?.length])
  const indeterminate = useMemo(
    () => checkedList.length > 0 && checkedList.length < options?.length,
    [checkedList.length, options?.length],
  )

  const onGroupChange = useRef((list: CheckboxValueType[]) => {
    setCheckedList(list)
  })

  const onCheckAllChange = useRef((e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? options.map((i) => i.value) : [])
  })

  useEffect(() => {
    onChange?.(checkedList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedList])

  return (
    <ConfigProvider theme={CHECKBOX_THEME}>
      <div>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange.current}
          checked={checkAll}
          children="全选"
        />
        <Checkbox.Group options={options} value={checkedList} onChange={onGroupChange.current} />
      </div>
    </ConfigProvider>
  )
}
