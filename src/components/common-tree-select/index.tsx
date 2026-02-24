/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-27 14:21:03
 * @Description: 场站选择组件
 */

import { Empty, TreeSelect } from "antd"
import { DefaultOptionType } from "rc-tree-select/lib/TreeSelect"
import { useEffect, useMemo, useRef, useState } from "react"

function filterTreeNode(inputValue: string, treeNode: DefaultOptionType) {
  // 根据输入值匹配树节点
  return `${treeNode.title}`.toLowerCase().includes(inputValue.toLowerCase())
}

export default function CommonTreeSelect(props) {
  const { value: propsValue, onChange, options, multiple, allowClear, needFirst, ...otherProps } = props
  const [value, setValue] = useState(null)
  const onChangeRef = useRef(null)
  onChangeRef.current = onChange

  const actualTreeData = useMemo(() => {
    return options || []
  }, [options])
  useEffect(() => {
    setValue(propsValue)
  }, [propsValue])
  useEffect(() => {
    if (needFirst) {
      const firstValue = actualTreeData?.[0]?.children?.[0]?.value.toString()
      const actualValue = multiple ? (firstValue ? [firstValue] : []) : firstValue
      setValue(actualValue)
      onChangeRef.current?.(actualValue)
    }
  }, [needFirst])

  const changeValue = (value) => {
    setValue(value)
    onChangeRef.current?.(value)
  }
  return (
    <TreeSelect
      allowClear
      showSearch
      value={value}
      treeData={actualTreeData}
      // popupMatchSelectWidth={false}
      filterTreeNode={filterTreeNode}
      notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      style={{ width: "10em" }}
      onSelect={multiple ? null : onChange}
      onChange={changeValue}
      treeDefaultExpandAll
      maxTagCount={2}
      {...otherProps}
      multiple={multiple}
    />
  )
}
