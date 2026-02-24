/* eslint-disable react-hooks/exhaustive-deps */
/*
 *@Author: chenmeifeng
 *@Date: 2023-11-03 10:38:26
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-11-03 10:38:26
 *@Description: 模块描述
 */
import "./tree-content.less"

import { filterMultiStationCheck } from "@pages/control-batch/methods/batch-funs.ts"
import { Tree, TreeProps } from "antd"
import React, { MutableRefObject, useEffect, useRef, useState } from "react"

import { IFormInst } from "@/components/custom-form/types.ts"
import { IDeviceData } from "@/types/i-device.ts"

import { getDeviceTreeData, getTreeData, setChildrenDisabled } from "../methods"
import { IBatchStn2DvsTreeData } from "../types/i-batch.ts"
export interface ITreeProps<TForm = any> {
  type?: string
  treeRef?: MutableRefObject<IFormInst<TForm> | null>
  onSelect?: (checkedDevices: (string | number)[]) => void
}
export default function ControlBatchTree(props: ITreeProps) {
  const { type, treeRef, onSelect } = props

  const { timeType } = treeRef?.current?.getFormValues() || {}
  //树结构数据
  const [deviceData, setDeviceData] = useState<IDeviceData[]>([])
  const [device4Tree, setDevice4Tree] = useState<IBatchStn2DvsTreeData[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const prevCheckedStnRef = useRef<string>()

  const treeCheckRef = useRef<TreeProps["onCheck"]>((_chKeys, info) => {
    const checkedNodes = info.checkedNodes as IBatchStn2DvsTreeData[]
    let newCheckedNodes: IBatchStn2DvsTreeData[] = checkedNodes
    const { timeType } = treeRef?.current?.getFormValues() || {}
    if (!timeType) {
      const item: IBatchStn2DvsTreeData = checkedNodes?.[checkedNodes?.length - 1]
      newCheckedNodes = [item]
    }
    const { keys, dvsList } = filterMultiStationCheck(newCheckedNodes, prevCheckedStnRef)
    setCheckedKeys(keys)
    setCheckedDevices(newCheckedNodes)
  })

  useEffect(() => {
    setCheckedKeys([])
    setCheckedDevices([])
    if (deviceData?.length) {
      const data = getTreeData(type, deviceData)
      setDevice4Tree(data)
      return
    }
    getDeviceTreeData().then((treeData) => {
      if (!treeData) return
      setDeviceData(treeData)
      setDevice4Tree(getTreeData(type, treeData) || [])
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    setCheckedKeys([])
    setCheckedDevices([])
  }, [timeType])

  useEffect(() => {
    if (checkedKeys?.length > 1) {
      const data = setChildrenDisabled(checkedKeys, device4Tree)
      setDevice4Tree(data)
    }
    onSelect?.(checkedKeys)
  }, [checkedKeys])

  return (
    <div className="power-tree">
      <Tree checkable treeData={device4Tree} checkedKeys={checkedKeys} onCheck={treeCheckRef.current} />
      <div className="footer-option">
        <span className="selected">已选：{checkedDevices.length}</span>
      </div>
    </div>
  )
}
