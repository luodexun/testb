/*
 * @Author: chenmeifeng
 * @Date: 2024-04-01 10:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-17 15:36:16
 * @Description: 树形组件
 */
import "./alarm-analyse-tree.less"

import { Button, Checkbox, Tree, TreeProps } from "antd"
import { useCallback, useEffect, useRef, useState } from "react"

import { IDeviceData } from "@/types/i-device.ts"

import {
  filterMultiStationCheck,
  getChildArr,
  getDeviceTreeData,
  getTreeData,
  setChildrenDisabled,
} from "../methods/index.ts"
import { IBatchStn2DvsTreeData } from "../types/index.ts"
import { SearchOutlined } from "@ant-design/icons"
import SearchBox from "@/components/search-box/index.tsx"
export interface IAlarmAnalyseTreeProps<TForm = any> {
  deviceType?: string
  defaulCheckKeys?: number[]
  onSelect?: (checkedDevices: (string | number)[]) => void
}
export default function AlarmAnalyseTree(props: IAlarmAnalyseTreeProps) {
  const { deviceType, defaulCheckKeys, onSelect } = props

  //树结构数据
  const [deviceData, setDeviceData] = useState<IDeviceData[]>([])
  const [device4Tree, setDevice4Tree] = useState<IBatchStn2DvsTreeData[]>([])
  // const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<number[]>([937, 936, "936", 938])
  const defaultCheckedKeys = useRef([])
  const [checkedKeys, setCheckedKeys] = useState<number[]>([])
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const prevCheckedStnRef = useRef<string>()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([""])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchDevice, seSearchDevice] = useState(false)
  const treeCheckRef = useRef<TreeProps["onCheck"]>((_chKeys, info) => {
    const checkedNodes = info.checkedNodes as IBatchStn2DvsTreeData[]
    const { keys, dvsList } = filterMultiStationCheck(checkedNodes, prevCheckedStnRef)
    setCheckedKeys(keys)
    setCheckedDevices(dvsList)
  })
  const onChangeAll = useCallback(
    (e) => {
      const value = e.target.checked
      const all = getChildArr(device4Tree)
      if (value) {
        const { keys, dvsList } = filterMultiStationCheck(all, prevCheckedStnRef)
        setCheckedKeys(keys)
        setCheckedDevices(dvsList)
      } else {
        setCheckedKeys([])
        setCheckedDevices([])
      }
    },
    [device4Tree],
  )
  const expendChange = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  const closeSearch = useRef(() => {
    setShowSearch(false)
  })
  const searchDev = useRef((e) => {
    seSearchDevice(e)
    closeSearch.current()
    // setShowSearch(false)
  })

  useEffect(() => {
    if (defaulCheckKeys?.length) {
      defaultCheckedKeys.current = defaulCheckKeys
      setCheckedKeys(defaulCheckKeys)
    }
  }, [defaulCheckKeys])
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
    setCheckedKeys(defaultCheckedKeys.current)
    setCheckedDevices([])
    if (deviceData?.length) {
      const data = getTreeData(deviceData)
      setDevice4Tree(data)
      return
    }
    getDeviceTreeData(deviceType).then((treeData) => {
      if (!treeData) return
      setDeviceData(treeData)
      setDevice4Tree(getTreeData(treeData) || [])
    })
  }, [])

  useEffect(() => {
    setCheckedKeys(defaultCheckedKeys.current)
    setCheckedDevices([])
    getDeviceTreeData(deviceType).then((treeData) => {
      if (!treeData) return
      setDeviceData(treeData)
      setDevice4Tree(getTreeData(treeData) || [])
    })
  }, [deviceType])

  useEffect(() => {
    if (checkedKeys?.length > 0) {
      const data = setChildrenDisabled(checkedKeys, device4Tree)
      setDevice4Tree(data)
    }
    onSelect?.(checkedKeys)
  }, [checkedKeys])

  return (
    <div className="power-tree">
      <Tree
        checkable
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={device4Tree}
        defaultCheckedKeys={defaultCheckedKeys.current}
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
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<SearchOutlined size={10} style={{ fontSize: "1.0em" }} />}
          onClick={() => setShowSearch(!showSearch)}
        />
      </div>
      {showSearch ? (
        <SearchBox placeholder="输入设备名称" setShowSearch={closeSearch.current} onSearch={searchDev.current} />
      ) : (
        ""
      )}
    </div>
  )
}
