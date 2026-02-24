/*
 *@Author: chenmeifeng
 *@Date: 2023-10-09 14:23:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-30 14:32:30
 *@Description: 模块描述
 */

import "./control-batch-tree.less"

import { Button, Checkbox, Tree, TreeProps } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { StorageCurDvsInfo } from "@/configs/storage-cfg.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { getStorage, removeStorage, setStorage } from "@/utils/util-funs.tsx"

import { filterMultiStationCheck, getChildArr, getDeviceTreeData } from "../methods/batch-funs.ts"
import { IBatchStn2DvsTreeData, TTreeData4DvsTypeMap } from "../types/i-batch.ts"

export interface IControlBatchTreeProps {
  deviceType: TDeviceType
  onSubmit: (checkedDevices: IBatchStn2DvsTreeData[], isSubmit: boolean) => void
  searchDevice?: string
}
export default function ControlBatchTree(props: IControlBatchTreeProps) {
  const { deviceType, onSubmit, searchDevice } = props
  //树结构数据
  const [device4Tree, setDevice4Tree] = useState<IBatchStn2DvsTreeData[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const treeData4DvsTypeMapRef = useRef<TTreeData4DvsTypeMap>({})
  const prevCheckedStnRef = useRef<string>()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([""])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  function handleSumbit() {
    onSubmit(checkedDevices, true)
  }
  useEffect(() => {
    const deviceInfo = getStorage(StorageCurDvsInfo)
    if (!deviceInfo?.deviceId) return
    setTimeout(() => {
      setAutoExpandParent(true)
      setExpandedKeys([deviceInfo?.deviceId?.toString()])
    }, 500)
  }, [])
  useEffect(() => {
    return () => {
      setTimeout(() => {
        removeStorage(StorageCurDvsInfo)
      }, 1000)
    }
  })
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
    const { keys, dvsList } = filterMultiStationCheck(checkedNodes, prevCheckedStnRef, false)
    setCheckedKeys(keys)
    setCheckedDevices(dvsList)
    onSubmit([], false)
  })
  const onChangeAll = useCallback(
    (e) => {
      const value = e.target.checked
      const all = getChildArr(device4Tree)
      if (value) {
        const { keys, dvsList } = filterMultiStationCheck(all, prevCheckedStnRef, false)
        setCheckedKeys(keys)
        setCheckedDevices(dvsList)
        onSubmit([], false)
      } else {
        setCheckedKeys([])
        setCheckedDevices([])
        onSubmit([], false)
      }
    },
    [device4Tree],
  )
  const expendChange = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  // const getParent
  useEffect(() => {
    if (searchDevice) {
      setAutoExpandParent(true)
      const all = getChildArr(device4Tree)
      const searchList =
        all?.filter((i) => i.title.indexOf(searchDevice) !== -1 || i.key.indexOf(searchDevice) !== -1) || []
      if (!searchList?.length) return
      // 展开第一个搜索到的，看后续需求
      const key = searchList?.[0]?.key
      console.log(typeof key, "key")

      setExpandedKeys([key])
    }
  }, [searchDevice, device4Tree])
  return (
    <div className="control-batch-tree">
      <Tree
        checkable
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={device4Tree}
        checkedKeys={checkedKeys}
        onCheck={treeCheckRef.current}
        onExpand={expendChange}
      />
      <div className="footer-option">
        <div>
          <Checkbox onChange={onChangeAll} />
          <span style={{ marginLeft: ".5em" }}>全选</span>
        </div>
        <span className="selected">已选：{checkedDevices.length}</span>
        <Button type="primary" size="small" onClick={handleSumbit} children="确认" />
      </div>
    </div>
  )
}
