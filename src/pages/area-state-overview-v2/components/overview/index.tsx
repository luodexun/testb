import "./index.less"

import { BulbOutlined, CheckOutlined, HeatMapOutlined } from "@ant-design/icons"
import { Spin, Tabs, Tooltip } from "antd"
import { useAtomValue } from "jotai"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import SelectWithAll from "@/components/select-with-all"
import { SITE_LAYOUT } from "@/configs/option-const"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import useRun4deviceData from "@/hooks/use-run-4device-data-test"
import useInterval from "@/hooks/useInterval"
import { AtomConfigMap } from "@/store/atom-config"
import { AtomStation } from "@/store/atom-station"
import { TDeviceType } from "@/types/i-config"
import { getTypeStationList, queryDevicesByParams } from "@/utils/device-funs"
import { getSortSelectOpts, showMsg } from "@/utils/util-funs"

import { comfirmState, getDeviceData, getDvsState } from "../../methods"
import AreaStateList from "../state-list"
import StationList from "../station-list"

const areaOvwTabs = [
  { key: "WT", label: "风", closable: false },
  { key: "PVINV", label: "光", closable: false },
  { key: "ESPCS", label: "储", closable: false },
]
export default function StateOverviwe(props) {
  const { showName = true, showTabs = true, currentDvsType } = props
  const [tabsList] = useState(areaOvwTabs)
  const [activeKey, setActiveKey] = useState<TDeviceType>("WT")
  const [activeStateKey, setActiveStateKey] = useState([])
  const { setIsTableMode, isTableMode, setCloseCtxMenu, showSign, setShowSign, needShangdevice, setNeedShangdevice } =
    useContext(DvsDetailContext)
  const [layout, setLayout] = useState("site")
  const [deviceData, setDeviceData] = useState({})
  const [loading, setLoading] = useState(false)
  const clickTimeChange = useRef(null)
  const [reload, setReload] = useInterval(3000)
  const [chooseAll, setChooseAll] = useState(false)
  const { stationList } = useAtomValue(AtomStation)
  const { deviceTypeOfStationMap } = useAtomValue(AtomConfigMap).map

  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: [activeKey] }
  }, [activeKey])
  const { run4Device } = useRun4deviceData(runParams)

  const onTabsChgRef = useRef((key: TDeviceType) => {
    clickTimeChange.current = setTimeout(() => {
      setActiveKey(key)
    }, 400)
  })

  const getActiveStateList = useCallback(
    (val) => {
      setActiveStateKey(val)
    },
    [activeStateKey],
  )

  // 获取当前设备类型下的场站
  const currntStationList = useMemo(() => {
    if (!stationList?.length) return []
    const stn = getTypeStationList(activeKey, "id", false)
    return stn
  }, [activeKey, stationList, deviceTypeOfStationMap])

  const doubleClk = useRef(() => {
    clearTimeout(clickTimeChange.current)
    setChooseAll((prev) => {
      return !prev
    })
  })

  // 获取场站下的设备
  useEffect(() => {
    if (!activeKey) return
    setDeviceData({})
    setActiveStateKey([]) // 设备类型改变，置空所选的
    getDeviceDataByDvsType()
    getAllStationDvsState()
  }, [activeKey, currntStationList])

  // 获取改设备类型下的设备
  const getDeviceDataByDvsType = async () => {
    setLoading(true)
    const res = await queryDevicesByParams({ deviceType: activeKey })
    const result = res.reduce((prev, cur) => {
      if (!prev[cur.stationId]) {
        prev[cur.stationId] = []
      }
      prev[cur.stationId].push(cur)
      return prev
    }, {})
    setDeviceData(result)
    setLoading(false)
  }
  // 组合数据，设备详情带有实时数据
  const combine = useMemo(() => {
    if (!deviceData && !Object.keys(deviceData).length) return []
    let allDeviceList = []
    Object.keys(deviceData).forEach((i) => (allDeviceList = allDeviceList.concat(deviceData[i])))

    const run = run4Device[activeKey]
    allDeviceList = allDeviceList.map((i) => {
      return {
        ...i,
        runData: run?.[i.deviceCode] || {},
      }
    })
    return allDeviceList
  }, [run4Device, deviceData])
  const clickOtherPosition = useRef((e) => {
    setCloseCtxMenu(true)
  })
  const getAllStationDvsState = async () => {
    const res = await getDvsState(activeKey)
    if (!res) return
    setReload(false)
    const dvs = res?.map((i) => i.deviceCode)
    setNeedShangdevice(dvs || [])
  }
  const comfirmDvsState = async () => {
    if (!needShangdevice?.length) {
      showMsg("暂无故障和通讯状态设备")
      return
    }
    await comfirmState(needShangdevice)
    getAllStationDvsState()
  }
  useEffect(() => {
    setIsTableMode(!showName)
  }, [showName])
  useEffect(() => {
    if (currentDvsType) {
      setActiveKey(currentDvsType)
    }
  }, [currentDvsType])
  useEffect(() => {
    return () => clearTimeout(clickTimeChange.current)
  }, [])
  useEffect(() => {
    if (!reload) return
    getAllStationDvsState()
  }, [reload])
  return (
    <Spin spinning={loading} wrapperClassName="l-full">
      <div
        className="area-overview"
        onClick={(e) => {
          clickOtherPosition.current(e)
        }}
      >
        {showTabs ? (
          <>
            <div className="area-ov-top">
              {tabsList?.map((i) => {
                return (
                  <div
                    key={i.key}
                    onClick={onTabsChgRef.current.bind(null, i.key as TDeviceType)}
                    onDoubleClick={doubleClk.current}
                    className={`ov-top-item ${activeKey === i.key ? "active-i" : ""}`}
                  >
                    {i.label}
                  </div>
                )
              })}
            </div>
            <div className="select">
              <div className="select-info-icon">
                <BulbOutlined
                  onClick={() => setIsTableMode(!isTableMode)}
                  style={{ fontSize: "20px", color: !isTableMode ? "#08c" : "#fff" }}
                />
                <Tooltip title="挂牌设备" className="tooltip-item">
                  <HeatMapOutlined
                    onClick={() => setShowSign(!showSign)}
                    style={{ fontSize: "20px", color: showSign ? "#08c" : "#fff" }}
                  />
                </Tooltip>
                <Tooltip title="清闪" className="tooltip-item">
                  <CheckOutlined onClick={comfirmDvsState} style={{ fontSize: "20px", color: "#fff" }} />
                </Tooltip>
              </div>
              <SelectWithAll
                size="small"
                value={layout}
                options={getSortSelectOpts()}
                onChange={setLayout}
                placeholder="场站排列"
              />
            </div>
          </>
        ) : (
          ""
        )}
        <div className="area-overview-content">
          <div className="area-overview-content--left">
            <AreaStateList
              deviceType={activeKey}
              setState={getActiveStateList}
              chooseAll={chooseAll}
              combineData={combine}
            />
          </div>
          <div className="area-overview-content--right">
            <StationList
              key={activeKey}
              deviceType={activeKey}
              run4Device={run4Device[activeKey]}
              layout={layout}
              activeStateKey={activeStateKey}
              currntStationList={currntStationList}
              deviceData={deviceData}
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}
