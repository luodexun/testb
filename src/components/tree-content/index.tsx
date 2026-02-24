import { Tree } from "antd"
import type { DataNode } from "antd/es/tree"
import React, { useEffect, useState } from "react"
const { TreeNode } = Tree
interface TreeComponentProps {
  autoExpandParent?: boolean
  checkable?: boolean
  defaultExpandAll?: true
  treeData: DataNode[]
  expandedKeys?: string[] | number[]
  checkedKeys?: string[] | number[]
  onHandleChecked?: (values: any) => void
}

const App: React.FC<TreeComponentProps> = ({
  treeData,
  checkable = true,
  defaultExpandAll = false,
  onHandleChecked,
}) => {
  const [checkedKeys, setCheckKeys] = useState<any>([])
  const onCheck = (newCheckdKeys) => {
    setCheckKeys(newCheckdKeys)
  }

  const renderTreeNode = (nodes) => {
    return nodes.map((node) => {
      if (node.children) {
        return (
          <TreeNode title={`${node.title || "--"}`} key={node.key}>
            {renderTreeNode(node.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={`${node.title || "--"}`} key={node.key} />
    })
  }

  useEffect(() => {
    onHandleChecked(checkedKeys)
  }, [checkedKeys])

  return (
    <div>
      <Tree checkedKeys={checkedKeys} defaultExpandAll={defaultExpandAll} checkable={checkable} onCheck={onCheck}>
        {renderTreeNode(treeData)}
      </Tree>
    </div>
  )
}

export default App
