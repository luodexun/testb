/*
 * @Author: xiongman
 * @Date: 2023-10-25 15:46:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-28 16:45:30
 * @Description: 树形下拉框组件
 */

import { Empty, TreeSelect, TreeSelectProps } from "antd"
import { DefaultOptionType } from "rc-tree-select/lib/TreeSelect"

interface IProps extends TreeSelectProps {}

function filterTreeNode(inputValue: string, treeNode: DefaultOptionType) {
  // 根据输入值匹配树节点
  return `${treeNode.title}`.toLowerCase().includes(inputValue.toLowerCase())
}
export default function CustomTreeSelect(props: IProps) {
  const { style, treeData, ...otherProps } = props

  return (
    <TreeSelect
      allowClear
      showSearch
      treeCheckable
      maxTagCount={1}
      treeCheckStrictly
      treeData={treeData}
      // popupMatchSelectWidth={false}
      filterTreeNode={filterTreeNode}
      notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      style={{ minWidth: "18em", ...(style || {}) }}
      {...otherProps}
      virtual
    />
  )
}
