/*
 * @Author: chenmeifeng
 * @Date: 2024-11-12 10:11:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-11 11:34:38
 * @Description:
 */
import "./point-tree.less"
import { TDeviceType } from "@/types/i-config"
import { ICDGTreeData, ISubmitInfo, TTreeData4DvsTypeMap } from "../types/point"
import { useEffect, useRef, useState } from "react"
import { filterMultiStationCheck, getDvsTreeData, getPointByDvs } from "../methods"
import { Button, Tree, TreeProps } from "antd"

export interface IControlTreeProps {
  deviceType: TDeviceType
  showSearchBox?: boolean
  changeSearchbox?: (e) => void
  onSubmit: (submitInfo: ISubmitInfo, isSubmit: boolean) => void
}
export default function ControlBatchTree(props: IControlTreeProps) {
  const { deviceType, onSubmit, showSearchBox, changeSearchbox } = props
  //树结构数据
  const [device4Tree, setDevice4Tree] = useState<ICDGTreeData[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [checkedPoint, setCheckedPoint] = useState<ICDGTreeData[]>([])
  const [checkDvs, setCheckDvs] = useState([])
  const treeData4DvsTypeMapRef = useRef<TTreeData4DvsTypeMap>({})
  const prevCheckedStnRef = useRef<string>()

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([""])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchDevice, seSearchDevice] = useState(false)
  const expendChange = (keys, row) => {
    // console.log(keys, "keus", row)
    setExpandedKeys(keys)
  }
  const treeCheckRef = useRef<TreeProps["onCheck"]>((_chKeys, info) => {
    const checkedNodes = info.checkedNodes as ICDGTreeData[]
    const { keys, ponitList } = filterMultiStationCheck(checkedNodes, prevCheckedStnRef)
    const dvsLs = ponitList?.map((i) => i.deviceId) || []
    const noMutilDvs = [...new Set(dvsLs)]?.map((i) => {
      return {
        deviceId: i,
        stationCode: ponitList?.find((point) => point.deviceId === i)?.stationCode,
      }
    })
    setCheckDvs(noMutilDvs)
    setCheckedKeys(keys)
    setCheckedPoint(ponitList)
    // onSubmit([], false)
  })
  const initData = async () => {
    const data = await getDvsTreeData({ deviceType })
    setDevice4Tree(data)
  }
  const onLoadData = async (info) => {
    const pointLs: any = await getPointByDvs(info)
    // console.log(pointLs, "pointLs")

    if (!pointLs) return
    setDevice4Tree((prev) => {
      const getStn = prev.find((i) => i.stationId === info.stationId)
      const getDvs = getStn?.children?.find((i) => i.deviceId === info.deviceId)
      if (getDvs) {
        getDvs.children = pointLs
        getDvs.disabled = false
      }
      return [...prev]
    })
    // return []
  }
  const handleSubmit = () => {
    onSubmit({ checkedPoint, checkDvs }, true)
  }
  useEffect(() => {
    initData()
  }, [deviceType])
  return (
    <div className="ctrl-dtree">
      <Tree
        checkable
        treeData={device4Tree}
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={expendChange}
        onCheck={treeCheckRef.current}
        loadData={onLoadData}
      />
      <div className="footer-option">
        <span className="selected">已选：{checkedPoint.length}</span>
        <Button type="primary" size="small" onClick={handleSubmit} children="确认" />
      </div>
    </div>
  )
}
