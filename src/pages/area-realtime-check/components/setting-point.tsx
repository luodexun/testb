import "./setting-point.less"
import { AtomStation } from "@/store/atom-station"
import { IDeviceData, IDvsMeasurePointData } from "@/types/i-device"
import { getDvsMeasurePointsData, queryDevicesByParams } from "@/utils/device-funs"
import { showMsg } from "@/utils/util-funs"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Select, Space, Tree, TreeProps } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { BasicDataNode } from "antd/es/tree"
import { useAtomValue } from "jotai"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { getPointChoose, onFormFinish } from "../methods/setting"
interface ITreeData extends BasicDataNode {
  key: string
  title: string
  modelId: number
  deviceType?: string
  parent?: boolean
  children: ITreeData[]
}
interface IPointTreeData {
  value: string
  label: string
  modelId?: number
  // children?: IPointTreeData[]
}
interface IPointSelect {
  id: number
  value: string
}
interface IProps {
  buttonClick?: (type) => void
}
function filterFun(inputValue: string, option?) {
  return option?.label?.includes(inputValue.trim())
}
const data = [
  {
    stationCode: "410527W02",
    device: [
      {
        deviceCode: "410527W02SS11010020",
        point: "AllForwardActivePowerOf1_GatewayMeter_Main,AllBackActivePowerOf1_GatewayMeter_Main",
      },
      {
        deviceCode: "410527W02SS11010022",
        point: "YC893",
      },
    ],
  },
  {
    stationCode: "station2",
    device: [
      {
        deviceCode: "WT0002",
        point: "aa,bb,cc",
      },
      {
        deviceCode: "PVINV0002",
        point: "aa2,bb2,cc2",
      },
    ],
  },
]
const DvsPointsCheck = forwardRef((props: IProps, ref) => {
  const { buttonClick } = props
  const { stationList } = useAtomValue(AtomStation)
  const [activeStation, setActiveStation] = useState("")
  const [deviceList, setDeviceList] = useState<IDeviceData[]>([])
  const [checkedKeys, setCheckedKeys] = useState<any>([])
  const checkedDvsKeys = useRef([])
  const [currentChooseDvsInfo, setCurrentChooseDvsInfo] = useState({
    modelId: undefined,
    deviceType: "",
  })
  const [checkPoints, setCheckPoints] = useState<IPointSelect[]>([]) // 当前勾选设备的选择测点情况
  const [pointList, setPointList] = useState<IPointTreeData[]>([]) // 测点信息
  const stnDvsChoosePoinsList = useRef([]) // 当前所有场站的设备的测点选择情况

  const getDvsList = async () => {
    const dvs = await queryDevicesByParams({
      stationCode: activeStation,
      deviceType: "CFT,JCY,NLGL,YCTP,SYZZZ,AGVC",
    })
    setDeviceList(dvs)
  }
  const changeStation = (code) => {
    setActiveStation(code)
  }
  const dvsModelList = useMemo<ITreeData[]>(() => {
    if (!deviceList?.length) return []
    const trees = deviceList?.reduce((prev, cur) => {
      const parent = prev.find((i) => i.key === cur.modelId)
      const info = { key: cur.deviceCode, title: cur.deviceName, modelId: cur.modelId, deviceType: cur.deviceType }
      if (!parent) {
        prev.push({
          key: cur.modelId,
          title: cur.model,
          deviceType: cur.deviceType,
          parent: true,
          modelId: cur.modelId,
          children: [info],
        })
      } else {
        parent.children.push(info)
      }
      return prev
    }, [])
    console.log(trees, "trees")
    return trees
  }, [deviceList])

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    // console.log("selected", selectedKeys, info)
  }

  const onCheck: TreeProps<ITreeData>["onCheck"] = (checkedKeys, info) => {
    const modelIds = info.checkedNodes?.map((i) => i.modelId) || []
    const dvsList = info.checkedNodes?.filter((i) => !i.parent) // 选中的设备层面
    const dvsKeys = dvsList?.map((i) => i.key)
    checkedDvsKeys.current = dvsKeys
    const unrepeatSize = new Set(modelIds).size
    if (unrepeatSize > 1) {
      showMsg("同时只允许选择一个同一机组设备")
      return
    }
    if (!info.checkedNodes?.length) {
      setCheckPoints([])
    } else {
      const stn = stnDvsChoosePoinsList.current?.find((i) => i.stationCode === activeStation)
      if (!stn) {
        stnDvsChoosePoinsList.current.push({
          stationCode: activeStation,
          device: [{ deviceCode: dvsList?.[0]?.key, points: "" }],
        })
      }
      const dvs = stnDvsChoosePoinsList.current?.find((i) => i.stationCode === activeStation)?.device || []
      const dvsCode = dvs?.map((i) => i.deviceCode) || []
      const unExistDvs = dvsList?.filter((i) => !dvsCode?.includes(i.key)) || [] // 是否存在该选择设备
      unExistDvs.forEach((i) => {
        dvs.push({ deviceCode: i.key, points: "" })
      })
      // console.log(stnDvsChoosePoinsList.current, "stnDvsChoosePoinsList.current")
      const dvsPoints = dvs?.find((i) => i.deviceCode === dvsList?.[0]?.key)
      const ckPoints = dvsPoints?.points?.split(",")?.map((i, idx) => {
        return {
          id: idx,
          value: i,
        }
      })
      setCheckPoints(ckPoints)
    }
    setCheckedKeys(checkedKeys)
    const oneDvsInfo = info?.checkedNodes?.[0]
    setCurrentChooseDvsInfo((prev) => {
      prev.modelId = oneDvsInfo?.modelId
      prev.deviceType = oneDvsInfo?.deviceType
      return { ...prev }
    })
  }
  const getPoints = async () => {
    const { modelId, deviceType } = currentChooseDvsInfo
    const res = await getDvsMeasurePointsData({ modelId, deviceType, pointTypes: "1,2" })
    const points = res?.map((i) => {
      return {
        value: i.pointName,
        label: i.pointDesc,
        modelId: i.modelId,
      }
    })
    setPointList(points)
  }
  // const onPointCheck: TreeProps<IPointTreeData>["onCheck"] = (checkedKeys, info) => {
  //   setCheckPoints(checkedKeys)
  //   console.log(checkedKeys, "pointCHkec")
  // }
  const addPoint = () => {
    const id = new Date().getTime()
    setCheckPoints((prev) => {
      return prev.concat([{ id, value: "" }])
    })
  }
  const removeRule = (id) => {
    setCheckPoints((prev) => {
      return prev.filter((i) => i.id !== id)
    })
  }
  const selectPoint = (e, id) => {
    setCheckPoints((prev) => {
      const info = prev.find((i) => i.id === id)
      info.value = e
      return [...prev]
    })
  }
  const onConfirm = async () => {
    console.log("checkPoints", stnDvsChoosePoinsList.current)
    const re = await onFormFinish(stnDvsChoosePoinsList.current)
    buttonClick?.("ok")
  }
  const onReset = () => {
    buttonClick?.("cancel")
  }
  const initData = async () => {
    const res = await getPointChoose()
    stnDvsChoosePoinsList.current = res || []
    console.log(res, "健康的")
  }
  useEffect(() => {
    const stnDvs = stnDvsChoosePoinsList.current?.find((i) => i.stationCode === activeStation)?.device || []
    const chooseDvs = stnDvs.filter((i) => checkedDvsKeys.current.includes(i.deviceCode)) || []
    const pointStr = checkPoints?.map((i) => i.value)?.join(",")
    chooseDvs.forEach((i) => {
      i.points = pointStr
    })
    console.log("当前选择的设备信息", chooseDvs)
  }, [checkPoints])
  useEffect(() => {
    if (!currentChooseDvsInfo?.modelId) return
    getPoints()
  }, [currentChooseDvsInfo.modelId])
  useEffect(() => {
    if (!activeStation) return
    getDvsList()
    setCheckedKeys([])
    checkedDvsKeys.current = []
    setCheckPoints([])
  }, [activeStation])
  useEffect(() => {
    if (stationList) {
      setActiveStation(stationList?.[0]?.stationCode)
    }
  }, [stationList])
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="dvs-point-page">
      <div className="dvs-point-page-content">
        <div className="dvs-station-list">
          {stationList?.map((i) => {
            return (
              <div key={i.stationCode} className={`station-item ${activeStation === i.stationCode ? "active" : ""}`}>
                <div className="station-name" onClick={() => changeStation(i.stationCode)}>
                  {i.shortName}
                </div>
              </div>
            )
          })}
        </div>
        <div className="dvs-content-dvs">
          <Tree
            checkedKeys={checkedKeys}
            checkable
            autoExpandParent
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={dvsModelList}
          />
        </div>
        <div className="dvs-content-point">
          {checkedKeys?.length ? <Button onClick={addPoint}>增加测点</Button> : ""}
          {checkPoints?.map((point) => {
            return (
              <div className="point-item" key={point.id}>
                <Select
                  showSearch
                  filterOption={filterFun}
                  style={{ width: "90%" }}
                  options={pointList}
                  value={point.value}
                  onSelect={(e) => selectPoint(e, point.id)}
                ></Select>
                <MinusCircleOutlined
                  style={{ fontSize: "1.5em", color: "#3E70EE" }}
                  onClick={() => removeRule(point.id)}
                />
              </div>
            )
          })}
          {/* <Tree checkedKeys={checkPoints} checkable autoExpandParent onCheck={onPointCheck} treeData={pointList} /> */}
        </div>
      </div>
      <Space style={{ width: "100%", justifyContent: "end", marginTop: "1em" }}>
        <Button htmlType="button" onClick={onReset}>
          取消
        </Button>
        <Button type="primary" onClick={onConfirm}>
          确认
        </Button>
      </Space>
    </div>
  )
})
export default DvsPointsCheck
