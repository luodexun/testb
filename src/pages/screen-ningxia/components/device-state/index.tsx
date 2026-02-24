/*
 * @Author: chenmeifeng
 * @Date: 2024-06-28 15:17:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-20 09:51:27
 * @Description:
 */
import "./index.less"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Slider from "react-slick"

import { getStorage, setStorage, validResErr } from "@/utils/util-funs"
import { getStateList } from "@/pages/area-state-overview/methods"
import { Checkbox, Radio } from "antd"
import { queryDevicesByParams } from "@/utils/device-funs"
import useRun4deviceData from "@/hooks/use-run-4device-data"
import { IModelListData } from "@/pages/setting-state-model/types"
import { StorageDeviceStdState } from "@/configs/storage-cfg"
import { doBaseServer } from "@/api/serve-funs"
import { IStationStateList } from "@/types/i-screen"
import NXCommonBox from "../common-box"
import ComRadioClk from "../common-radio"
import { AtomConfigMap } from "@/store/atom-config"
import { useAtomValue } from "jotai"
import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config"
import { getDvsMainStateList } from "@/hooks/use-matrix-device-list"
import { DVS_OPTIONS } from "../../configs"
const CheckboxGroup = Checkbox.Group
const settings = {
  dots: false,
  infinite: false,
  speed: 3000,
  slidesToShow: 11,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  cssEase: "linear",
  autoplay: true, // 添加这一行
  autoplaySpeed: 4000, // 设置自动播放速度，单位为毫秒
  slickPrev: "none",
}
export default function WtState() {
  const [stateList, setStateList] = useState([])
  const [currentState, setCurrentState] = useState(["1"])
  const [stationStateList, setStationStateList] = useState<IStationStateList>(null)
  const [stationList, setStationList] = useState([])
  const [infinite, setInfinite] = useState(false)
  const [autoplay, setAutoplay] = useState(false)
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const processRef = useRef(null)
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: [deviceType] }
  }, [deviceType])
  const { run4Device } = useRun4deviceData(runParams)
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map

  const options = useMemo<IConfigDeviceStateData[]>(() => {
    if (!deviceType) return []
    // 获取设备类型下的主状态列表
    const { stateInfoList } = getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN")
    return stateInfoList
  }, [deviceStdStateMap, deviceType])

  // 所有场站下设备状态集合信息
  const stationStateObj = useMemo<IStationStateList>(() => {
    if (!run4Device || !stationStateList || !options?.length) return {}
    const rundata = run4Device?.[deviceType]
    const allList = Object.values(rundata).reduce((prev, cur) => {
      if (!prev?.[cur.stationCode]) {
        prev[cur.stationCode] = {
          // all: [],
        }
      }
      if (
        prev?.[cur.stationCode] &&
        stationStateList[cur.stationCode]?.allList?.findIndex((i) => i.deviceCode === cur.deviceCode) !== -1
      ) {
        // prev[cur.stationCode].all.push(cur)
        prev[cur.stationCode][cur.mainState] = (prev[cur.stationCode][cur.mainState] || 0) + 1
      }
      return prev
    }, {})
    const result = Object.keys(stationStateList).reduce((prev, cur) => {
      prev[cur] = { ...stationStateList[cur], ...allList[cur] }
      return prev
    }, {})
    // console.log(allList, "result", stationStateList, result)

    return result
  }, [run4Device, stationStateList, deviceType, options])
  // const stationList = []
  const onChange = useRef((e) => {
    setCurrentState(e)
  })
  const changeDvsType = (dvsType) => {
    setDeviceType(dvsType)
    // setCurrentState(["1"])
    // getAllDeviceList(dvsType)
  }
  const getAllDeviceList = async () => {
    setInfinite(false)
    setAutoplay(false)
    const allDevices = await queryDevicesByParams({ deviceType })
    if (validResErr(allDevices)) return
    // 所有场站下的设备
    setStationList([])
    const allStationDv = allDevices?.reduce((prev, cur) => {
      if (!prev?.[cur.stationCode]) {
        prev[cur.stationCode] = {
          allCount: 0,
          allList: [],
          stationName: cur.stationName,
        }
        setStationList((stn) => {
          stn.push(cur.stationCode)
          return stn
        })
      }
      if (prev?.[cur.stationCode]) {
        prev[cur.stationCode].allList.push(cur)
        prev[cur.stationCode].allCount = prev[cur.stationCode].allCount + 1
      }
      return prev
    }, {})
    // const reas = {
    //   dslkf: {
    //     allCount: 32,
    //     stationName: "sdfdf",
    //     allList: [],
    //   },
    // }
    if (allStationDv && Object.keys(allStationDv)?.length > 11) {
      setInfinite(true)
      setAutoplay(true)
    }
    // console.log(allStationDv, "allStationDv")

    setStationStateList(allStationDv)
  }

  // 获取风机设备状态码
  const getDeviceState = async () => {
    const deviceModelStdList = getStorage<Array<IModelListData>>(StorageDeviceStdState)
    if (deviceModelStdList) return setStateList([...getStateList("WT")])
    const allStn = await doBaseServer("getDeviceStdState")
    if (validResErr(allStn)) return
    setStorage(allStn, StorageDeviceStdState)
    setStateList([...getStateList("WT")])
  }
  // 计算当前勾选的场站状态总数
  const getStnStateCount = useCallback(
    (info) => {
      if (info) {
        const count = currentState?.reduce((prev, cur) => {
          prev = (info[cur] || 0) + prev
          return prev
        }, 0)
        return count
      }
      return 0
    },
    [currentState, deviceType],
  )
  useEffect(() => {
    setStationStateList(null)
    getAllDeviceList()
    setCurrentState(["1"])
  }, [deviceType])
  return (
    <NXCommonBox
      title="设备运行状态"
      titleBox={<ComRadioClk options={DVS_OPTIONS} onChange={(e) => changeDvsType(e)} />}
    >
      <div className="nx-device-state">
        <div className="state-list">
          <CheckboxGroup value={currentState} onChange={onChange.current}>
            {options?.map((i) => {
              return (
                <Checkbox key={i.state} value={i.state} className={`state-${i.state}`}>
                  <span className="state-item-name">{i.stateDesc}</span>
                </Checkbox>
              )
            })}
          </CheckboxGroup>
        </div>
        <div className="station-list">
          {stationStateList ? (
            <Slider {...settings} infinite={infinite} autoplay={autoplay}>
              {stationStateList &&
                Object.keys(stationStateList)?.map((i) => {
                  return (
                    <div className="station-item" key={i}>
                      <span className="stn-name">{stationStateObj[i]?.stationName}</span>
                      <div className="process" ref={processRef}>
                        {options
                          ?.filter((j) => currentState.includes(j.state.toString()))
                          ?.map((state) => {
                            return (
                              <i
                                key={state.state}
                                className={`state-${state.state}`}
                                style={{
                                  width: `${(stationStateObj[i]?.[state.state] / stationStateObj[i]?.allCount) * processRef.current?.clientWidth}px`,
                                  backgroundColor: state.color,
                                }}
                              ></i>
                            )
                          })}
                      </div>
                      <span className="stn-count">
                        {getStnStateCount(stationStateObj[i]) + "/" + stationStateObj[i]?.allCount}
                      </span>
                    </div>
                  )
                })}
            </Slider>
          ) : (
            ""
          )}
        </div>
      </div>
    </NXCommonBox>
  )
}
