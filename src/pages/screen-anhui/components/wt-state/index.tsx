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
import CommonCtBox from "../common-box"
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
const testState = [
  // { stateDesc: "正常发电", state: "1", color: "#33C434" },
  // { stateDesc: "限功率", state: "2", color: "#FF8900" },
  // { stateDesc: "待机", state: "3", color: "#4FD4FF" },
  // { stateDesc: "停机", state: "4", color: "#FF4F4F" },
  // { stateDesc: "未知", state: "5", color: "#E74FFF" },
  // { stateDesc: "无通讯", state: "6", color: "#737C87" },
]
const stationStateTest = {
  // "1": {
  //   stationName: "风场1",
  //   allCount: 30,
  //   allList: [],
  // },
  // "2": {
  //   stationName: "风场2",
  //   allCount: 2,
  //   allList: [],
  // },
  // "3": {
  //   stationName: "风场3",
  //   allCount: 43,
  //   allList: [],
  // },
  // "4": {
  //   stationName: "风场4",
  //   allCount: 10,
  //   allList: [],
  // },
  // "5": {
  //   stationName: "风场1",
  //   allCount: 30,
  //   allList: [],
  // },
  // "6": {
  //   stationName: "风场2",
  //   allCount: 2,
  //   allList: [],
  // },
  // "7": {
  //   stationName: "风场3",
  //   allCount: 43,
  //   allList: [],
  // },
  // "8": {
  //   stationName: "风场4",
  //   allCount: 10,
  //   allList: [],
  // },
  // "9": {
  //   stationName: "风场4",
  //   allCount: 10,
  //   allList: [],
  // },
}
export default function WTState() {
  const [stateList, setStateList] = useState(testState)
  const [currentState, setCurrentState] = useState(["1"])
  const [stationStateList, setStationStateList] = useState<IStationStateList>(null)
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
  const onChange = useRef((e) => {
    setCurrentState(e)
  })
  const getAllDeviceList = async () => {
    const allDevices = await queryDevicesByParams({ deviceType: "WT" })
    if (!allDevices?.length) return

    const allStationDv = allDevices?.reduce((prev, cur) => {
      if (!prev?.[cur.stationCode]) {
        prev[cur.stationCode] = {
          allCount: 0,
          allList: [],
          stationName: cur.stationName,
        }
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
    <CommonCtBox title="风场风机状态" direction="right">
      {/* <ChartRender ref={chartRef} empty option={chartOptions} /> */}
      <div className="ah-wt-state">
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
                    <i className="i-wt"></i>
                    <div className="item-content">
                      <div className="item-content-top">
                        <span className="stn-name">{stationStateObj[i]?.stationName}</span>
                        <span className="wt-count">
                          {getStnStateCount(stationStateObj[i]) + "/" + stationStateObj[i]?.allCount}
                        </span>
                      </div>
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
                    </div>
                  </div>
                )
              })}
          </Slider>
        </div>
      </div>
    </CommonCtBox>
  )
}
