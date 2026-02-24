/*
 *@Author: chenmeifeng
 *@Date: 2023-10-09 14:23:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-26 17:29:47
 *@Description: 模块描述
 */

import "./control-batch-tree.less"

import { Button, Tree, TreeProps } from "antd"
import React, { useEffect, useRef, useState } from "react"

import { filterMultiStationCheck } from "@/pages/control-batch/methods/batch-funs.ts"
import { IBatchStn2DvsTreeData, TTreeData4DvsTypeMap } from "@/pages/control-batch/types/i-batch.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { showMsg } from "@/utils/util-funs.tsx"

import { getChildArr, getDeviceTreeData } from "../methods"
import SearchBox from "@/components/search-box"

export interface IControlBatchTreeProps {
  deviceType: TDeviceType
  showSearchBox?: boolean
  changeSearchbox?: (e) => void
  onSubmit: (checkedDevices: IBatchStn2DvsTreeData[], isSubmit: boolean) => void
}
export default function ControlBatchTree(props: IControlBatchTreeProps) {
  const { deviceType, onSubmit, showSearchBox, changeSearchbox } = props
  //树结构数据
  const [device4Tree, setDevice4Tree] = useState<IBatchStn2DvsTreeData[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const treeData4DvsTypeMapRef = useRef<TTreeData4DvsTypeMap>({})
  const prevCheckedStnRef = useRef<string>()

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([""])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchDevice, seSearchDevice] = useState(false)
  function handleSumbit() {
    if (deviceType === "SYZZZ" && checkedDevices?.length > 1) return showMsg("仅支持一个设备")
    onSubmit(checkedDevices, true)
  }

  const expendChange = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  const closeSearch = useRef(() => {
    setShowSearch(false)
    changeSearchbox(false)
  })
  const searchDev = useRef((e) => {
    seSearchDevice(e)
    closeSearch.current()
  })

  useEffect(() => {
    if (searchDevice) {
      setAutoExpandParent(true)
      const all = getChildArr(device4Tree)
      const searchList =
        all?.filter((i) => i.title.indexOf(searchDevice) !== -1 || i.deviceName.indexOf(searchDevice) !== -1) || []
      if (!searchList?.length) return
      // 展开第一个搜索到的，看后续需求
      const key = searchList?.[0]?.key
      setExpandedKeys([key])
    }
  }, [searchDevice, device4Tree])

  useEffect(() => {
    setCheckedKeys([])
    if (treeData4DvsTypeMapRef.current[deviceType]?.length) {
      return setDevice4Tree(treeData4DvsTypeMapRef.current[deviceType])
    }
    getDeviceTreeData({ deviceType }).then((treeData) => {
      setDevice4Tree(treeData)
      treeData4DvsTypeMapRef.current[deviceType] = treeData
    })
  }, [deviceType])

  const treeCheckRef = useRef<TreeProps["onCheck"]>((_chKeys, info) => {
    const checkedNodes = info.checkedNodes as IBatchStn2DvsTreeData[]
    const { keys, dvsList } = filterMultiStationCheck(checkedNodes, prevCheckedStnRef)
    setCheckedKeys(keys)
    setCheckedDevices(dvsList)
    onSubmit([], false)
  })

  useEffect(() => {
    setShowSearch(showSearchBox)
  }, [showSearchBox])

  return (
    <div className="control-batch-tree">
      <Tree
        checkable
        treeData={device4Tree}
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={expendChange}
        onCheck={treeCheckRef.current}
      />
      <div className="footer-option">
        <span className="selected">已选：{checkedDevices.length}</span>
        <Button type="primary" size="small" onClick={handleSumbit} children="确认" />
      </div>
      {showSearch ? (
        <SearchBox placeholder="输入设备名称" setShowSearch={closeSearch.current} onSearch={searchDev.current} />
      ) : (
        ""
      )}
    </div>
  )
}
