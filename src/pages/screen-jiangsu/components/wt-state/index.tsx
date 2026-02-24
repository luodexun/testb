/*
 * @Author: chenmeifeng
 * @Date: 2024-06-28 15:17:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-09 14:10:39
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
import { TDeviceType } from "@/types/i-config"
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
  const processRef = useRef(null)
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: ["WT"] as TDeviceType[] }
  }, [])
  const { run4Device } = useRun4deviceData(runParams)

  // 所有场站下设备状态集合信息
  const stationStateObj = useMemo<IStationStateList>(() => {
    if (!run4Device || !stationStateList) return {}
    const rundata = run4Device?.WT
    const allList = Object.values(rundata).reduce((prev, cur) => {
      if (!prev?.[cur.stationCode]) {
        prev[cur.stationCode] = {
          // all: [],
        }
      }
      if (prev?.[cur.stationCode]) {
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
  }, [run4Device, stationStateList])
  // const stationList = []
  const onChange = useRef((e) => {
    setCurrentState(e)
  })
  const getAllDeviceList = async () => {
    const allDevices = await queryDevicesByParams({ deviceType: "WT" })
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
    }
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
    [currentState],
  )
  useEffect(() => {
    setTimeout(() => {
      getAllDeviceList()
      getDeviceState()
      // setStateList([...getStateList("WT")])
    }, 300)
  }, [])
  return (
    <div className="wt-state">
      <div className="wt-state-header">
        <span>风场风机状态</span>
      </div>
      <div className="wt-state-content">
        <div className="state-list">
          <CheckboxGroup value={currentState} onChange={onChange.current}>
            {stateList?.map((i) => {
              return (
                <Checkbox key={i.state} value={i.state} className={`state-${i.state}`}>
                  <span className="state-item-name">{i.stateDesc}</span>
                </Checkbox>
              )
            })}
          </CheckboxGroup>
        </div>
        <div className="station-list">
          <Slider {...settings} infinite={infinite}>
            {stationStateList &&
              Object.keys(stationStateList)?.map((i) => {
                return (
                  <div className="station-item" key={i}>
                    <span className="stn-name">{stationStateObj[i]?.stationName}</span>
                    <div className="process" ref={processRef}>
                      {stateList
                        ?.filter((j) => currentState.includes(j.state))
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
        </div>
      </div>
    </div>
  )
}
