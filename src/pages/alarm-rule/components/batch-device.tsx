/*
 * @Author: chenmeifeng
 * @Date: 2024-08-28 16:57:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-05 14:55:28
 * @Description:
 */
import "./batch-device.less"
import { AtomStation } from "@/store/atom-station"
import { Button, Checkbox, Tree, TreeProps } from "antd"
import { useAtomValue } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import { IBatchStn2DvsTreeData } from "../types"

import { IDeviceData } from "@/types/i-device.ts"

import {
  filterMultiStationCheck,
  getChildArr,
  getDeviceTreeData,
  getTreeData,
  setChildrenDisabled,
} from "../methods/index.ts"
import { SearchOutlined } from "@ant-design/icons"
import SearchBox from "@/components/search-box/index.tsx"
import { showMsg } from "@/utils/util-funs.tsx"
export interface IAlarmAnalyseTreeProps<TForm = any> {
  deviceType?: string
  onSelect?: (checkedDevices: IBatchStn2DvsTreeData[]) => void
}
export default function AlarmAnalyseTree(props: IAlarmAnalyseTreeProps) {
  const { deviceType, onSelect } = props

  //树结构数据
  const [deviceData, setDeviceData] = useState<IDeviceData[]>([])
  const [device4Tree, setDevice4Tree] = useState<IBatchStn2DvsTreeData[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const prevCheckedStnRef = useRef<string>()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([""])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchDevice, seSearchDevice] = useState(false)
  const treeCheckRef: TreeProps["onCheck"] = (_chKeys, info) => {
    const checkedNodes = info.checkedNodes as IBatchStn2DvsTreeData[]
    if (
      checkedDevices?.length &&
      checkedNodes?.length &&
      checkedNodes?.[checkedNodes?.length - 1]?.modelId !== checkedDevices?.[0]?.modelId
    ) {
      showMsg("不能选不同的设备型号")
      return
    }
    const { keys, dvsList } = filterMultiStationCheck(checkedNodes, prevCheckedStnRef)
    setCheckedKeys(keys)
    setCheckedDevices(dvsList)
    onSelect?.(dvsList)
  }
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
  // const getParent
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
    setCheckedKeys([])
    setCheckedDevices([])
    getDeviceTreeData(deviceType).then((treeData) => {
      if (!treeData) return
      setDeviceData(treeData)
      setDevice4Tree(getTreeData(treeData) || [])
    })
  }, [deviceType])

  useEffect(() => {
    if (checkedKeys?.length > 1) {
      const data = setChildrenDisabled(checkedKeys, device4Tree)
      setDevice4Tree(data)
    }
    // onSelect?.(checkedKeys)
  }, [checkedKeys])

  return (
    <div className="alarm-rule-tree">
      <Tree
        checkable
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={device4Tree}
        checkedKeys={checkedKeys}
        onCheck={treeCheckRef}
        onExpand={expendChange}
      />
      <div className="footer-option">
        {/* <div>
          <Checkbox onChange={onChangeAll} />
          <span style={{ marginLeft: ".5em" }}>全选</span>
        </div> */}
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
