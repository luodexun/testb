/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-30 14:55:53
 * @Description: 场站选择组件
 */

import { AtomStation } from "@store/atom-station.ts"
import { Empty, TreeSelect } from "antd"
import { useAtomValue } from "jotai"
import { DefaultOptionType } from "rc-tree-select/lib/TreeSelect"
import { useEffect, useMemo, useRef, useState } from "react"

// interface IProps extends TreeProps {
//   needFirst?: boolean
//   needId?: boolean
//   needAllInfo?: boolean
//   treeData?: TTreeOptions
// }
function filterTreeNode(inputValue: string, treeNode: DefaultOptionType) {
  // 根据输入值匹配树节点
  return `${treeNode.title}`.toLowerCase().includes(inputValue.toLowerCase())
}

export default function StationTreeSelect(props) {
  const { value: propsValue, onChange, options, multiple, allowClear = true, needFirst, needId, ...otherProps } = props
  const [value, setValue] = useState(null)
  const onChangeRef = useRef(null)
  onChangeRef.current = onChange
  const { stationOfRegionOptions, stationOfRegionOptions4Id } = useAtomValue(AtomStation)

  const treeData = useMemo(() => {
    return needId ? stationOfRegionOptions4Id : stationOfRegionOptions
  }, [needId, stationOfRegionOptions, stationOfRegionOptions4Id])

  const actualTreeData = useMemo(() => {
    if (options?.length) {
      return options
    } else {
      return treeData
    }
  }, [options, treeData])
  useEffect(() => {
    setValue(propsValue)
    if (propsValue) {
      onChangeRef.current?.(propsValue)
    }
  }, [propsValue])
  useEffect(() => {
    if (needFirst) {
      const firstValue = actualTreeData?.[0]?.children?.[0]?.value.toString()
      const actualValue = multiple ? [firstValue] : firstValue
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
      showSearch
      value={value}
      treeData={actualTreeData}
      popupMatchSelectWidth={false}
      filterTreeNode={filterTreeNode}
      notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      style={{ width: "10em" }}
      onSelect={multiple ? null : onChange}
      onChange={changeValue}
      treeDefaultExpandAll
      maxTagCount={2}
      {...otherProps}
      multiple={multiple}
      allowClear={allowClear}
    />
  )
}
