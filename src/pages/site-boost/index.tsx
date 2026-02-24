/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 16:03:00
 * @Description: 场站-升压站
 */

import "./index.less"

import { HeatMapOutlined } from "@ant-design/icons"
import { DragAndScale } from "@utils/drag-and-scale.ts"
import { getParamDataFromUrl } from "@utils/menu-funs.tsx"
import { getStorage, isEmpty, showMsg } from "@utils/util-funs.tsx"
import { Button, Spin } from "antd"
import Draggable from "draggable"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
import JudgeFive from "@/components/control-five-rule/control-modal"
import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import IntervalBox, { IIntervalProps, IIntervalRefs } from "@/components/device-control/interval-input"
import { fiveHeFenValid } from "@/components/device-control/methods"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step.tsx"
import { IControlParamMap } from "@/components/device-control/types.ts"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step.ts"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageSvgAnalogSet } from "@/configs/storage-cfg"
import useMqttBoost from "@/hooks/use-mqtt-boost.ts"
import useInterval from "@/hooks/useInterval"
import { getSiteOfMenu } from "@/router/menu-site"
import { alarmInfoAtom } from "@/store/atom-alarm"
import { analogInfoAtom } from "@/store/atom-analog-data"
import { AtomStation } from "@/store/atom-station"
import { AlarmListData } from "@/types/i-alarm"
import { IBoostMQData, IBoostSvgPath, INodeIdField2DomInfo, TSvgDom } from "@/types/i-boost.ts"
// import { AlarmListData } from "../alarm-history/types"
import { IDeviceData } from "@/types/i-device"
import { bacthPass, getDvsMeasurePointsData, queryDevicesByParams } from "@/utils/device-funs"

import SignLog, { ISignProps, ISignRef } from "./components/control-sign-log"
import AddModal from "./components/control-sign-log/sign"
// import { bacthPass } from "../alarm-history/methods"
import SvgContextmenuBox from "./components/dropdowm"
import FiveRule from "./components/five-rule/index_v2"
import SvgFourPointTable, { ISvgFPtTblProps, ISvgFPtTblRef } from "./components/four-point"
import SvgHistoryTable, { ISvgHstyTblProps, ISvgHstyTblRef } from "./components/history-table"
import {
  CTRL_BST_TYPE,
  FIVE_RULE,
  getCBControlExecuteInfo,
  getCBOperateParamData,
  getCMenuOperateParamData,
  getExitOnOffCbPoint,
  getRealtimeAlarm,
  getTheClickDomInfo,
  NEED_CTMENU,
  refreshDiagramValue,
  refreshSignRecord,
  setBoostSvgDiagram,
} from "./methods"
// import { validFiveRule } from "./methods/five-rule"
import { getSignRecords } from "./methods/sign"
import { IPointInfo, ISignKeyMap } from "./types"

export default function SiteBoost() {
  const [boostMqttData, setBoostMqttData] = useState<IBoostMQData>()
  const [svgPathInfo, setSvgPathInfo] = useState<IBoostSvgPath>({ stationCode: "", svgName: "" })
  const [openModal, setOpenModal] = useState(false)
  const [openAlarmHstyModal, setOpenAlarmHstyModal] = useState(false)
  const [openFourModal, setOpenFourModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const nodeField2DomMapRef = useRef<Record<string, INodeIdField2DomInfo[]>>(null)
  const containerRef = useRef<HTMLDivElement>()
  const dragAndScaleRef = useRef<DragAndScale>()
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const modalRef1 = useRef<ICustomModalRef<ISvgHstyTblRef>>()
  const controlParamMapRef = useRef<IControlParamMap>({})
  const [signDomList, setsignDomList] = useState([])
  const [openSignModal, setOpenSignModal] = useState(false)
  const [openLineSign, setOpenLineSign] = useState(false)
  const [currentLineCode, setCurrentLineCode] = useState(null)

  const [openFiveComfirm, setOpenFiveComfirm] = useState(false) // 五防校验是否开启弹框
  const [controlParams, setControlParams] = useState(null)
  const deviceCode = useRef<string>()
  const deviceInfo = useRef<IDeviceData>(null)
  const [deviceId, setDeviceId] = useState(null)
  const [dvsCode, setDvsCode] = useState(null)

  const cxtMenuBox = useRef<HTMLDivElement>()
  const timer = useRef(null)
  const [realtimeAlarm, setRealtimeAlarm] = useState<Array<AlarmListData>>([])
  const realtimeAlarms = useRef([])
  const cfmModeRef = useRef(null)
  const [checkComfirm, setCheckComfirm] = useState(false)
  const [canGetAlarm, setCanGetAlarm] = useState(true) // 判断是否可以调用实时告警接口，反正接口返回太慢就又调同一个接口
  const [pointInfo, setPointInfo] = useState<IPointInfo>()
  const [pointStr, setPointStr] = useState("") // 该电气图所有的点
  const [pointOFCBArr, setPointOFCBArr] = useState([]) // 该电气图包含ON/OFF/CB所有的点
  const { pathname } = useLocation()

  const analogStorage = useAtomValue(analogInfoAtom)
  const alarmInfo = useAtomValue(alarmInfoAtom)
  const curAnalogStg = getStorage(StorageSvgAnalogSet)
  const [refresh, setRefresh] = useState(false)
  const { stationMap, stationOfRegionOptions } = useAtomValue(AtomStation)

  const fiveRuleRef = useRef(null)
  const [showFiveEditModel, setShowFiveEditModel] = useState(false)
  const timeoutRef = useRef(null)
  const [reload, setReload] = useInterval(3000)
  const [signRecords, setSignRecords] = useState<ISignKeyMap>({})

  const [showTimeModal, setShowTimeModal] = useState(false)
  const yaotiaoRef = useRef(null)

  const navigate = useNavigate()
  const getUrl = (type) => {
    return getSiteOfMenu(type).map((i) => i.key)
  }
  const stationOptions = useMemo(() => {
    return stationOfRegionOptions?.map((i) => {
      return {
        ...i,
        children: i.children?.filter((j) => getUrl(j.type).includes("boost")),
      }
    })
  }, [stationOfRegionOptions])

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])

  useEffect(() => {
    setSvgPathInfo({ svgName: "main", stationCode: stationInfo?.stationCode })
  }, [pathname, stationInfo])

  const loadingRef = useRef(loading)
  loadingRef.current = loading
  const svgPathInfoRef = useRef(svgPathInfo)
  svgPathInfoRef.current = svgPathInfo
  // 鼠标点击事件
  const onSvgClickRef = useRef(async (event: MouseEvent) => {
    clearTimeout(timer.current)
    cxtMenuBox.current.style.display = "none"
    if (loadingRef.current) return

    timer.current = setTimeout(async () => {
      const target = event.target as TSvgDom
      const targetId = target.id
      const { theClkNode, dvsName, actType } = getTheClickDomInfo(targetId, nodeField2DomMapRef)

      if (actType === "NOT_TARGET") return
      if (!theClkNode?.name) return showMsg("1未能匹配设备元素信息，不能操作！")
      if (actType === "CLK" || actType == "LINE") {
        return setSvgPathInfo((prevState) => ({ ...prevState, svgName: theClkNode.name }))
      }
      if (!CTRL_BST_TYPE.includes(actType)) return
      setLoading((loadingRef.current = true))
      const paramDataParams = { stationCode: svgPathInfoRef.current.stationCode, dvsName }
      const { msg, pointName, pointDesc, deviceId } = await getCBOperateParamData(paramDataParams)
      setLoading((loadingRef.current = false))
      if (msg) return showMsg(msg)

      const executeParams = { pointName, pointDesc, deviceId, stationName: stationInfo?.shortName, theClkNode }
      controlParamMapRef.current.executeInfo = getCBControlExecuteInfo(executeParams)
      // 打开遥调控制窗口
      if (actType === "YT") {
        setShowTimeModal(true)
        return
      }
      // 判断是否需要五防校验类型
      const judge = await judgeFiveRule(actType, dvsName)
      if (!judge) return
      setOpenModal(true)
      setOperateInfo(controlParamMapRef.current.executeInfo)
    }, 600)
  })

  // 鼠标右键事件
  const onSvgCxMenuRef = useRef(async (event: any) => {
    if (loadingRef.current) return
    const target = event.target
    const targetId = target.id
    let obj
    if (target?.parentNode?.id?.startsWith("TP:")) {
      obj = getTheClickDomInfo(target?.parentNode?.id, nodeField2DomMapRef)
    } else {
      obj = getTheClickDomInfo(targetId, nodeField2DomMapRef)
    }
    const { dvsName, actType, dataField } = obj

    if (actType === "NOT_TARGET") return
    if (!NEED_CTMENU.includes(actType)) return
    event.preventDefault()
    // 线路挂牌
    if (actType === "LINE") {
      const splitData = targetId.split(":") || []
      const splitLength = splitData?.length
      const lineCode = splitData?.[splitLength - 1]
      setCurrentLineCode(lineCode ? parseInt(lineCode) : null)
      setOpenLineSign(true)
      return
    }

    setLoading((loadingRef.current = true))
    const paramDataParams = { stationCode: svgPathInfoRef.current.stationCode, dvsName: dataField ?? dvsName }

    const { msg, pointName, deviceId, pointDesc, modelId } = await getCMenuOperateParamData(paramDataParams)
    setLoading((loadingRef.current = false))
    if (msg) return showMsg(msg)

    let executeParams: IPointInfo = {
      pointName,
      pointDesc,
      deviceId,
      stationInfo,
      actType,
      modelId,
      deviceCode: deviceCode.current,
    }
    // 获取遥控点名称
    if (dvsName && dvsName !== "_") {
      const ctrlPointInfo = await getDvsMeasurePointsData({ deviceId, pointName: dvsName })

      const theCtrlPoint = ctrlPointInfo.find((info) => info.pointName === dvsName)
      executeParams = {
        ...executeParams,
        controlPointName: dvsName,
        controlPointDesc: theCtrlPoint?.pointDesc,
      }
    }
    cxtMenuBox.current.style.display = "block"
    cxtMenuBox.current.style.transform = `translate(${event.layerX}px, ${event.layerY}px)`
    setPointInfo(executeParams)
  })
  // 双击
  // const onSvgDbClick = useRef((event: any) => {
  //   clearTimeout(timer.current)
  //   if (loadingRef.current) return
  //   const target = event.target
  //   const targetId = target.id
  //   const { dvsName, actType, dataField } = getTheClickDomInfo(targetId, nodeField2DomMapRef)

  //   if (actType === "NOT_TARGET") return
  //   if (!NEED_DBCL.includes(actType)) return

  //   event.preventDefault()
  //   const actualField = dataField ?? dvsName
  //   const alLs = [{ alarmId: "CBClosedPosition_2212", stationCode: "441882W01" }]
  //   const findAlarm =
  //     alLs?.find((item) => item.alarmId === actualField && item.stationCode === stationInfo?.stationCode) || null
  //   console.log(actualField, findAlarm)
  //   if (findAlarm) setCheckComfirm(true)
  // })
  const clearShang = () => {
    const comfirmAlarmList =
      realtimeAlarm.filter(
        (i) =>
          pointOFCBArr?.includes(i.alarmId) &&
          i.stationCode === stationInfo?.stationCode &&
          i.deviceId === deviceInfo.current?.deviceId,
      ) || []
    if (!comfirmAlarmList?.length) {
      showMsg("当前没有待确认告警")
      return
    }
    setCheckComfirm(true)
  }
  // 消闪/告警确认
  const alarmBtnClkRef = async (type, msg) => {
    if (type === "close") return setCheckComfirm(false)
    const comfirmAlarmList =
      realtimeAlarm.filter(
        (i) =>
          pointOFCBArr?.includes(i.alarmId) &&
          i.stationCode === stationInfo?.stationCode &&
          i.deviceId === deviceInfo.current?.deviceId,
      ) || []
    if (!comfirmAlarmList?.length) return setCheckComfirm(false)
    const res = await bacthPass(comfirmAlarmList, msg)
    if (!res) return
    getAlarmList()
    setCheckComfirm(false)
    // setReload(true)
  }
  const getAlarmList = async () => {
    setCanGetAlarm(false)
    const res = await getRealtimeAlarm(stationInfo?.id)
    setCanGetAlarm(true)
    if (res) {
      setRealtimeAlarm(res)
      realtimeAlarms.current = res
    }
  }
  // 五防校验判断
  const judgeFiveRule = async (actType, dataField) => {
    if (!FIVE_RULE.includes(actType)) return true
    const params = {
      pointName: dataField, // 传遥控点
      controlType: controlParamMapRef.current.executeInfo?.targetValue ? 0 : 1,
      stationCode: stationInfo?.stationCode,
      deviceCode: deviceCode.current,
    }
    setOpenFiveComfirm(true)
    setControlParams(params)
    setOperateInfo(controlParamMapRef.current.executeInfo)
    return false
    // const flag = fiveHeFenValid(params)
    // return flag
  }
  const hiddenCtxMenu = useRef((e) => {
    cxtMenuBox.current.style.display = "none"
    if (e === "4") {
      // 五防编辑弹框
      setShowFiveEditModel(true)
      fiveRuleRef.current.style.display = "block"
      fiveRuleRef.current.style.transform = `translate(300px, 200px)`
      // fiveRuleRef.current.style.top = "20%"
      // fiveRuleRef.current.style.left = "30%"
    }
  })

  const fiveJudgeRes = useRef((type) => {
    setOpenFiveComfirm(false)
    if (type === "next") {
      setOpenModal(true)
    }
  })

  const getDvsCode = async () => {
    const deviceList = await queryDevicesByParams({
      stationCode: stationInfo?.stationCode,
      deviceType: "SYZZZ",
    })
    deviceCode.current = deviceList?.[0]?.deviceCode
    deviceInfo.current = deviceList?.[0]
    setDvsCode(deviceCode.current)
    setDeviceId(deviceList?.[0]?.deviceId)
    // getSigns()
  }

  const { stepBtnClkRef } = useDvsControlStep({
    deviceType: "SYZZZ",
    controlParamMapRef,
    modalRef,
    setOpenModal,
    setLoading,
  })

  // 过滤掉全是数字的
  const matchStr = useRef((i) => {
    // eslint-disable-next-line no-useless-escape
    return /^[\d|\.]*$/.test(i)
  })
  const onTitleClkRef = useRef(() => setSvgPathInfo((prevState) => ({ ...prevState, svgName: "main" })))
  const changeSelect = (e, info) => {
    if (!info) return
    navigate(`/site/${info.maintenanceComId}/${e}/boost`)
  }
  const getSigns = async () => {
    const params = {
      deviceId: deviceInfo.current?.deviceId,
      stationId: stationInfo?.id,
      deviceType: "SYZZZ",
      isEnd: false,
    }
    const signs = await getSignRecords(params)
    setReload(false)
    setSignRecords(signs)
  }

  const closeInterval = useRef((value) => {
    setShowTimeModal(false)
    controlParamMapRef.current.executeInfo.targetValue = value
    controlParamMapRef.current.executeInfo.controlType = "13"
    controlParamMapRef.current.executeInfo.operateName = `遥调值：${value}`
    controlParamMapRef.current.executeInfo.stateName = null
    setOperateInfo(controlParamMapRef.current.executeInfo)
    setOpenModal(true)
  })

  const singClk = useRef((type) => {
    setOpenLineSign(false)
  })
  useEffect(() => {
    if (!containerRef.current) return () => {}
    const containerDom = containerRef.current
    const onSvgClick = onSvgClickRef.current
    const onSvgCxMenu = onSvgCxMenuRef.current
    setRefresh(false)
    // const onSvgDbClk = onSvgDbClick.current
    setLoading((loadingRef.current = true))
    const setLoadingFalse = () => setLoading((loadingRef.current = false))
    timeoutRef.current = setTimeout(() => {
      setBoostSvgDiagram(containerDom, svgPathInfo, setLoadingFalse).then((infoMap) => {
        nodeField2DomMapRef.current = infoMap
        // console.log(nodeField2DomMapRef.current, "nodeField2DomMapRef.current")
        infoMap ? setRefresh(true) : ""
        setsignDomList([])
        if (!nodeField2DomMapRef.current) return
        setPointOFCBArr(getExitOnOffCbPoint(nodeField2DomMapRef.current || {}))
        const points = Object.keys(nodeField2DomMapRef.current || {}) || []
        const actPoint = points.filter((i) => !matchStr.current(i))
        setPointStr(actPoint?.join(","))
        getAlarmList()
      })
    }, 600)

    dragAndScaleRef.current = new DragAndScale({ el: containerRef.current })
    containerDom.addEventListener("click", onSvgClick, false)
    containerDom.addEventListener("contextmenu", onSvgCxMenu, true)
    // containerDom.addEventListener("dblclick", onSvgDbClk, true)
    return () => {
      dragAndScaleRef.current?.destory()
      containerDom.removeEventListener("click", onSvgClick, false)
      containerDom.removeEventListener("contextmenu", onSvgCxMenu)
      clearTimeout(timeoutRef.current)
      clearTimeout(timer.current)
    }
  }, [svgPathInfo])

  useMqttBoost({ stationCode: svgPathInfo.stationCode, point: pointStr, setBoostMqttData })

  useEffect(() => {
    const actualAs = Object.keys(analogStorage).length ? analogStorage : curAnalogStg
    if (isEmpty(nodeField2DomMapRef.current) || !refresh || !stationInfo?.stationCode || !pointStr) return
    refreshDiagramValue(
      nodeField2DomMapRef.current,
      boostMqttData,
      actualAs || {},
      realtimeAlarm,
      stationInfo?.stationCode,
      deviceInfo.current?.deviceId,
    )
  }, [boostMqttData, analogStorage, refresh, realtimeAlarm, stationInfo])
  useEffect(() => {
    if (!refresh || !stationInfo) return
    const list = refreshSignRecord(containerRef.current, nodeField2DomMapRef.current)
    setsignDomList(list)
  }, [refresh, stationInfo])
  useEffect(() => {
    if (openSignModal || !reload) return
    getSigns()
  }, [openSignModal, reload])
  useEffect(() => {
    // 获取设备编码
    if (!stationInfo?.stationCode) return
    getDvsCode()
  }, [stationInfo?.stationCode])

  useEffect(() => {
    ;(async function () {
      if (alarmInfo?.alarmMessages?.length && canGetAlarm) {
        getAlarmList()
      }
    })()
  }, [alarmInfo])

  useEffect(() => {
    fiveRuleRef.current ? new Draggable(fiveRuleRef.current) : ""
  }, [])

  return (
    <div className="page-wrap site-boost-wrap">
      <Spin size="large" spinning={loading} />
      {/* <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" /> */}
      <div className="site-boost-top">
        <StationTreeSelect
          style={{ width: "200px" }}
          options={stationOptions}
          value={stationInfo?.stationCode}
          onChange={changeSelect}
        />
        <Button size="small" onClick={clearShang}>
          清闪
        </Button>
        <Button size="small" onClick={setOpenAlarmHstyModal.bind(null, true)}>
          历史告警
        </Button>
        <Button size="small" onClick={setOpenFourModal.bind(null, true)}>
          四遥
        </Button>
        <Button size="small" onClick={setOpenSignModal.bind(null, true)}>
          电气挂牌
        </Button>
        <HeatMapOutlined
          style={{
            fontSize: "20px",
            marginLeft: "1em",
            color: Object.keys(signRecords)?.length ? "rgba(190, 204, 0, 1)" : "#fff",
          }}
        />
        <div className="site-info-box">
          {svgPathInfo.svgName === "main" ? (
            <span className="img-name" children="主接线图" />
          ) : (
            <Button size="small" onClick={onTitleClkRef.current} children="返回" />
          )}
        </div>
      </div>

      <div className="l-full container-wrap">
        <div ref={containerRef} className="container">
          {refresh &&
            signDomList?.map((i) => {
              return (
                <div key={i.id} className="bsign-list" style={{ position: "absolute", top: i.y, left: i.x }}>
                  {signRecords?.[i.id]?.map((sign) => {
                    return (
                      <span key={sign.id} className="bsign-icon">
                        {sign.signDesc?.split("")?.[2]}
                      </span>
                    )
                  })}
                </div>
              )
            })}
        </div>
      </div>
      <div ref={cxtMenuBox} className="cxt-menu">
        <SvgContextmenuBox
          pointInfo={pointInfo}
          hiddenBox={hiddenCtxMenu.current}
          alarmList={realtimeAlarm}
          refreshAlarm={getAlarmList}
        />
      </div>
      <CustomModal<IOperateStepProps, IOperateStepRef>
        ref={modalRef}
        width="30%"
        title="设备控制"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={setOpenModal.bind(null, false)}
        Component={OperateStep}
        componentProps={{ loading, data: operateInfo, buttonClick: stepBtnClkRef.current, deviceType: "SYZZZ" }}
      />
      <CustomModal<IIntervalProps, IIntervalRefs>
        ref={yaotiaoRef}
        width="20%"
        title="遥调值"
        destroyOnClose
        open={showTimeModal}
        footer={null}
        onCancel={setShowTimeModal.bind(null, false)}
        Component={IntervalBox}
        componentProps={{ buttonClick: closeInterval.current, addonAfter: true }}
      />
      <CustomModal<ISvgHstyTblProps, ISvgHstyTblRef>
        ref={modalRef1}
        width="80%"
        title="历史告警"
        destroyOnClose
        open={openAlarmHstyModal}
        footer={null}
        onCancel={setOpenAlarmHstyModal.bind(null, false)}
        Component={SvgHistoryTable}
        componentProps={{ stationId: stationInfo?.id, deviceId: deviceId }}
      />
      <CustomModal<ISvgFPtTblProps, ISvgFPtTblRef>
        ref={modalRef1}
        width="80%"
        title="四遥"
        destroyOnClose
        open={openFourModal}
        footer={null}
        onCancel={setOpenFourModal.bind(null, false)}
        Component={SvgFourPointTable}
        componentProps={{ deviceCode: dvsCode }}
      />
      <CustomModal<IOperateProps, IPerateRef>
        ref={cfmModeRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={checkComfirm}
        footer={null}
        onCancel={() => setCheckComfirm(false)}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: alarmBtnClkRef }}
      />
      <CustomModal<ISignProps, ISignRef>
        ref={cfmModeRef}
        width="80%"
        title="电气挂牌列表"
        destroyOnClose
        open={openSignModal}
        footer={null}
        onCancel={() => setOpenSignModal(false)}
        Component={SignLog}
        componentProps={{ stationId: stationInfo?.id }}
      />
      <div ref={fiveRuleRef} className="five-rule-modal">
        {showFiveEditModel ? <FiveRule pointInfo={pointInfo} changeClk={() => setShowFiveEditModel(false)} /> : ""}
      </div>
      <JudgeFive open={openFiveComfirm} setOpen={fiveJudgeRes.current} controlParam={controlParams} />
      {openLineSign ? (
        <AddModal buttonClick={singClk.current} stationId={stationInfo?.id} lineCode={currentLineCode} />
      ) : (
        ""
      )}
    </div>
  )
}
