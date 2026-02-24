import { CTRL, SYZZZ_CONTROL_TYPE_4DEVICE } from "@configs/dvs-control.ts"
import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { getDvsMeasurePointsData, queryDevicesByParams } from "@utils/device-funs.ts"
import { createElement, MutableRefObject } from "react"

import { doBaseServer } from "@/api/serve-funs.ts"
import { crtExecuteInfo } from "@/components/device-control/methods.ts"
import { IQueryAlarmParams } from "@/pages/alarm-realtime/config/types"
import { IBoostMQData, IBoostSvgPath, INodeIdField2DomInfo, INodeIdType, TSvgDom } from "@/types/i-boost.ts"
import { validResErr } from "@/utils/util-funs"

// 湖北个性化
// import { keepTwoDecimalFull } from "@/utils/util-funs"

// 获取电气svg资源，设置dom并开启鼠标事件, 收集svg中的设备信息
export async function setBoostSvgDiagram(
  containerDom: HTMLDivElement,
  svgPathInfo: IBoostSvgPath,
  setLoadingFalse?: any,
) {
  const { stationCode, svgName } = svgPathInfo
  if (!containerDom || !stationCode || !svgName) return null
  const svgXml = await doBaseServer<IBoostSvgPath>("getStationSvg", { stationCode, svgName })
  if (setLoadingFalse) setLoadingFalse()
  containerDom.innerHTML = svgXml || "<span class='err-info'>未获取到电气图文件！</span>"
  if (!svgXml) return null
  return collectDvsDomOfSvg(containerDom)
}

function getDomChildrenId(dom: TSvgDom, childrenId = []) {
  if (!dom?.id) return childrenId
  childrenId.push(dom.id)
  if (!dom.children?.length) return childrenId
  for (const child of dom.children) {
    childrenId.push(child.id)
    if (child.children?.length) childrenId.push(...getDomChildrenId(child as TSvgDom))
  }
  return childrenId
}

// id 分隔符
const SPLIT_FLAG = ":"
// 需要关注的id类型
export const NODE_TYPE_INFO: IDvsRunStateInfo<INodeIdType>[] = [
  { field: "ON", title: "开关合位" },
  { field: "OFF", title: "开关分位" },
  { field: "TP", title: "文字" },
  { field: "CB", title: "断路器" },
  { field: "ARM", title: "光字牌" },
  { field: "CLK", title: "可点击菜单" },
  { field: "LINE", title: "线路可点击菜单" },
  { field: "UP", title: "变压器挡位升" },
  { field: "DOWN", title: "变压器挡位降" },
  { field: "STOP", title: "变压器挡位停" },
  { field: "YT", title: "遥调控制" },
]
// 获取dom的选择器
const selector = NODE_TYPE_INFO.map(({ field }) => `*[id^="${field}${SPLIT_FLAG}"]`).join(",")
// 获取svg 下 dom的选择器
const selectorKey = `svg ${selector}`
// ID三段 ["ON", "OFF", "CB"]
// ID两段 文字 // 点击，菜单，变压器挡位
const ID_2PART: INodeIdType[] = ["TP", "CLK", "ARM", "UP", "DOWN", "STOP", "LINE", "YT"]
// 不需要更新值
const NO_VAL: INodeIdType[] = ["CLK", "UP", "DOWN", "STOP"]
// 控制操作
export const CTRL_BST_TYPE: INodeIdType[] = ["CB", "OFF", "ON", "UP", "DOWN", "STOP", "YT"]
// 需要右键操作
export const NEED_CTMENU: INodeIdType[] = ["CB", "OFF", "ON", "TP", "ARM", "LINE"]
// 需要双击操作
export const NEED_DBCL: INodeIdType[] = ["CB", "OFF", "ON", "ARM"]
// 是否有无妨规则
export const FIVE_RULE: INodeIdType[] = ["CB", "OFF", "ON"]

export function splitDomId(id: string): { type?: INodeIdField2DomInfo["type"]; dvsName?: string; dataField?: string } {
  if (!id) return {}
  const [type, dvsName, dataField] = id.split(SPLIT_FLAG) || []
  return { type: type as INodeIdField2DomInfo["type"], dvsName, dataField }
}

function collectDvsDomOfSvg(containerDom: HTMLDivElement): Record<string, INodeIdField2DomInfo[]> {
  const nodeKey2DomMap: Record<string, INodeIdField2DomInfo[]> = {}
  let type: INodeIdField2DomInfo["type"], dvsName: string, dataField: string
  let nodeInfo: INodeIdField2DomInfo, childrenId: string[]
  const allSwitchNodes = containerDom.querySelectorAll(selectorKey) as unknown as TSvgDom[]
  return Array.from(allSwitchNodes).reduce((prev, dom) => {
    ;({ type, dvsName, dataField } = splitDomId(dom.id))
    dataField = ID_2PART.includes(type) ? dvsName : dataField
    if (!dataField) return prev
    childrenId = getDomChildrenId(dom)
    nodeInfo = { type, dom: dom as TSvgDom, childrenId, name: dvsName, field: dataField }
    if (!prev[dataField]) prev[dataField] = []
    prev[dataField].push(nodeInfo)
    return prev
  }, nodeKey2DomMap)
}

// 根据数据值设置dom样式或内容
export function refreshDiagramValue(
  nodeField2DomMap: Record<string, INodeIdField2DomInfo[]>,
  mqttData: IBoostMQData,
  analogStorage?,
  alarmList?,
  stationCode?,
  deviceId?,
) {
  let mqVal: boolean | string | number, clsNames: string[], domList: TSvgDom[]
  const fieldList = Object.keys(nodeField2DomMap)
  let fk, analogList
  // const { fk, analogList } = analogStorage
  if (analogStorage) {
    fk = analogStorage.fk
    analogList = analogStorage.analogList
  }
  const test = {
    YX2411: true,
    YK04: false,
  }
  fieldList.forEach((field) => {
    mqVal = mqttData?.[field]
    nodeField2DomMap[field].forEach((info) => {
      if (NO_VAL.includes(info.type)) return
      info.value = mqVal
      if (fk && NEED_CTMENU.includes(info.type)) {
        mqVal = getOneAnalogData(analogList, field, mqVal)
      }
      // 是否存在改测点告警数据
      const alarmInfo =
        alarmList?.find(
          (item) => item.alarmId === field && item.stationCode === stationCode && item.deviceId === deviceId,
        ) || null
      // if (info.type === "TP" && !mqttData && !mqVal) return

      // 湖北个性化
      // if (typeof mqVal === "number" || typeof mqVal === "string") {
      //   mqVal = keepTwoDecimalFull (mqVal , 2)
      // }

      if (info.type === "TP") return (info.dom.innerHTML = `${mqVal ?? "-"}`)

      // 以防mqtt返回的数据中不存在当前属性
      if (`${mqVal}` === "undefined") {
        if (info.type === "ON") clsNames = ["cb-grey", "switch-on", "switch-off"]
        else if (info.type === "OFF") clsNames = ["cb-grey", "switch-on", "switch-off"]
        else if (info.type === "CB") clsNames = ["cb-grey", "cb-off", "cb-on"]
        else if (info.type === "ARM") clsNames = ["arm-on", "arm-off"]
        else return
      } else {
        if (info.type === "ON")
          clsNames = mqVal ? ["switch-on", "switch-off", "cb-grey"] : ["switch-off", "switch-on", "cb-grey"]
        else if (info.type === "OFF")
          clsNames = mqVal ? ["switch-off", "switch-on", "cb-grey"] : ["switch-on", "switch-off", "cb-grey"]
        else if (info.type === "CB") clsNames = mqVal ? ["cb-on", "cb-off"] : ["cb-off", "cb-on"]
        else if (info.type === "ARM") clsNames = mqVal ? ["arm-on", "arm-off"] : ["arm-off", "arm-on"]
        else return
      }
      domList = [info.dom, ...Array.from((info.dom.children || []) as TSvgDom[])]
      domList.forEach((theDom) => {
        const removeClsLs = [...clsNames.slice(1), "flash-light"]
        removeClsLs.forEach((i) => {
          theDom.classList.remove(i)
        })
        theDom.classList.add(clsNames[0])
        if (alarmInfo) theDom.classList.add("flash-light")
      })
    })
  })
}

export function refreshSignRecord(svgDom, nodeField2DomMap) {
  const domList = []
  const fieldList = Object.keys(nodeField2DomMap)
  const topDistance = svgDom?.getBoundingClientRect()?.top
  const leftDistance = svgDom?.getBoundingClientRect()?.left
  fieldList.forEach((field) => {
    nodeField2DomMap[field].forEach((info) => {
      // 如果是线路，需要在线路旁边添加电气挂牌标志
      if (info.type === "LINE") {
        const { x, y } = info.dom?.getBoundingClientRect()
        const split = info.childrenId?.[0]?.split(":")
        const lineId = split?.[split.length - 1]
        domList.push({ x: x - leftDistance + 40, y: y - topDistance, id: parseInt(lineId) })
      }
    })
  })
  return domList
}
export function getTheClickDomInfo(
  targetId: string,
  nodeField2DomMapRef: MutableRefObject<Record<string, INodeIdField2DomInfo[]>>,
): {
  theClkNode?: INodeIdField2DomInfo
  dvsName?: string
  dataField?: string
  actType?: INodeIdField2DomInfo["type"] | "NOT_TARGET"
} {
  const actType = NODE_TYPE_INFO.find(({ field }) => targetId.startsWith(`${field}:`))?.field
  if (!actType) return { actType: "NOT_TARGET" }
  const { dvsName, dataField } = splitDomId(targetId)
  const theNodeField = ID_2PART.includes(actType) ? dvsName : dataField
  const clkNodeList = nodeField2DomMapRef.current?.[theNodeField]
  const theClkNode = clkNodeList?.find((item) => item?.childrenId?.includes(targetId))
  return { theClkNode, dvsName, dataField, actType }
}

export async function getCBOperateParamData(params: {
  stationCode: string
  dvsName: string
}): Promise<{ pointName?: string; pointDesc?: string; deviceId?: number; modelId?: number; msg?: string }> {
  const { stationCode, dvsName } = params
  const resData = await queryDevicesByParams({ stationCode, deviceType: "SYZZZ" })
  const theStationInfo = resData?.[0]
  if (!theStationInfo) return { msg: "2未能获取到设备信息，不能执行操作！" }
  const { deviceId, modelId } = theStationInfo
  const ctrlPointInfo = await getDvsMeasurePointsData({ modelId, deviceId, pointName: dvsName })
  if (!ctrlPointInfo?.length) return { msg: "3未能获取到测点信息，不能执行操作！" }
  const theCtrlPoint = ctrlPointInfo.find((info) => info.pointName === dvsName)
  if (!theCtrlPoint) return { msg: "4未能匹配到设备测点信息，不能执行操作！" }
  const { pointName, pointDesc } = theCtrlPoint
  return { pointName, pointDesc, deviceId, modelId }
}

// 右键选择框判断事件
export async function getCMenuOperateParamData(params: {
  stationCode: string
  dvsName: string
}): Promise<{ pointName?: string; pointDesc?: string; deviceId?: number; modelId?: number; msg?: string }> {
  const { stationCode, dvsName } = params
  const resData = await queryDevicesByParams({ stationCode, deviceType: "SYZZZ" })
  const theStationInfo = resData?.[0]
  if (!theStationInfo) return { msg: "未能获取到设备信息，不能执行操作！" }
  const { deviceId, modelId } = theStationInfo

  const ctrlPointInfo = await getDvsMeasurePointsData({ modelId, deviceId, pointTypes: "1", pointName: dvsName })
  const theCtrlPoint = ctrlPointInfo?.find((info) => info.pointName === dvsName)
  return { pointName: dvsName, pointDesc: theCtrlPoint?.pointDesc, deviceId, modelId }
}
export function getCBControlExecuteInfo(params: {
  pointName: string
  pointDesc: string
  stationName: string
  deviceId: number
  theClkNode: INodeIdField2DomInfo
}): ReturnType<typeof crtExecuteInfo> | null {
  const { pointName, pointDesc, deviceId, stationName, theClkNode } = params
  let cState: string, targetState: string, isClosed: boolean
  if (["UP", "DOWN", "STOP"].includes(theClkNode.type)) {
    isClosed = theClkNode.type === "DOWN" // 升档/档停 1，降档0
    targetState = CTRL[`ZB_${theClkNode.type}`]
  } else {
    // 默认值处于分闸状态
    isClosed = !!theClkNode?.value
    cState = isClosed ? CTRL.CLOSING : CTRL.OPENING
    targetState = isClosed ? CTRL.OPENING : CTRL.CLOSING
  }
  return crtExecuteInfo({
    defaultType: "SYZZZ",
    operateInfo: SYZZZ_CONTROL_TYPE_4DEVICE.find((info) => info.title === targetState),
    // 控制值（合闸传1，分闸传0)
    targetValue: isClosed ? 0 : 1, // 当前分闸，目标合闸
    deviceList: [{ deviceId, pointName, pointDesc, stationName }],
    stateInfo: { state: cState },
  })
}

// 根据key获取模拟数据值，当模拟数据的值是空的，取正常已存在的值；当模拟数据存在且值是布尔类型，返回模拟数据
function getOneAnalogData(list, key, curValue) {
  const info = list?.find((i) => i.key === key)
  const valueType = typeof list?.find((i) => i.key === key)?.value
  if (info && valueType === "boolean") {
    return info.value
  }
  return info?.value || curValue
}

export const getRealtimeAlarm = async (stationId) => {
  const res = await doBaseServer<IQueryAlarmParams>("getfilterRealTimeMsgData", {
    data: { alarmLevelIdList: [14], confirmFlag: false, stationIdList: [stationId] },
    params: { pageNum: 1, pageSize: 1000 },
  })
  if (validResErr(res)) return null
  // return [
  //   { alarmId: "YX2411", stationCode: "410527W01", deviceId: 1188 },
  //   { alarmId: "YX2412", stationCode: "410527W01", deviceId: 1188 },
  //   { alarmId: "YK011", stationCode: "410527W01", deviceId: 1188 },
  //   { alarmId: "YK01", stationCode: "410527W01", deviceId: 1188 },
  //   { alarmId: "YX4347", stationCode: "410527W01", deviceId: 1188 },
  //   { alarmId: "YX4353", stationCode: "410527W01", deviceId: 1188 },
  //   { alarmId: "YK04", stationCode: "410527W01", deviceId: 1188 },
  // ]
  return res?.list || []
}

export const getExitOnOffCbPoint = (data) => {
  return Object.keys(data).reduce((prev, cur) => {
    const exit = data[cur]?.find((i) => i.type === "ON" || i.type === "OFF" || i.type === "CB")
    if (exit) {
      prev.push(cur)
    }
    return [...prev]
  }, [])
}
