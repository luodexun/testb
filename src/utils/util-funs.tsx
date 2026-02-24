import { CloseOutlined } from "@ant-design/icons"
import {
  REFRESH_STORAGE,
  StorageAlarmLevels,
  StorageCompanyData,
  StorageDeviceSystem,
  StorageStationData,
} from "@configs/storage-cfg"
import { EVO_POWER, LARGER_W, LARGER_Y, UNIT } from "@configs/text-constant.ts"
import { dayY2D } from "@configs/time-constant"
import { LOGIN_INFO_FOR_FUNS } from "@store/atom-auth.ts"
import { message, Space } from "antd"
import { NoticeType } from "antd/es/message/interface"
import { ArgsProps } from "antd/lib/message"
import dayjs, { Dayjs } from "dayjs"
import { v4 as uuidV4 } from "uuid"

import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
import { SITE_LAYOUT } from "@/configs/option-const"
import { TTreeOptions } from "@/types/i-antd"
import { TStorageInfo } from "@/types/i-api.ts"
import { ILoginInfo } from "@/types/i-auth"
import { TDeviceType } from "@/types/i-config"

import ResponseListener from "./response-listener"

// message 缓存，记录已经在展示的提示
const msgCache = new Map()
export function showMsg(msg: string, type: NoticeType = "warning", config?: Omit<ArgsProps, "content">) {
  // 不重复提示已经有的文字
  if (msgCache.get(msg)) return Promise.resolve()
  msgCache.set(msg, msg) // 记录正在提示的文字
  const key = config?.key || createUUID()
  const conNode = (
    <Space>
      <span>{msg}</span>
      <CloseOutlined
        onClick={() => {
          msgCache.delete(msg)
          message.destroy(key)
        }}
      />
    </Space>
  )
  return message.open({
    type,
    content: conNode,
    style: { marginTop: "20vh" },
    // 提示关闭时去除缓存记录
    onClose: () => msgCache.delete(msg),
    key,
    ...config,
  })
}

// 跳转到系统登录页
export function changSystem() {
  ResponseListener.handleListener("toLoginPage")
}
// 清除本地存储的登录信息，跳转到系统登录页
export function toLoginSystem(msg?: string) {
  LOGIN_INFO_FOR_FUNS.loginInfo = null
  removeStorage()
  if (msg) {
    // showMsg(msg).then(changSystem)
    showMsg(msg)
    setTimeout(() => {
      window.location.reload() // 刷新页面，layout-user 中验证登录信息时转到登录页面
    }, 1000)
    return
  }
  // window.setTimeout(() => changSystem(), 100)
  setTimeout(() => {
    window.location.reload() // 刷新页面，layout-user 中验证登录信息时转到登录页面
  }, 1000)
}

// 从本地存储取数据
export function getStorage<TData = any>(storageInfo: TStorageInfo, type?: "string"): TData | null {
  const { key, store } = storageInfo
  const localStr = window[store].getItem(key)
  if (!localStr || localStr === "null" || localStr === "undefined") {
    return null
  }
  if (type === "string") return localStr as TData
  return JSON.parse(localStr) as TData
}
// 存数据到本地存储
export function setStorage(data: any, storageInfo: TStorageInfo) {
  if (!data) return
  const { key, store, refresh } = storageInfo
  let dataStr: string
  if (typeof data === "string") {
    dataStr = data
  } else {
    dataStr = JSON.stringify(data)
  }
  window[store].setItem(key, dataStr)
  if (refresh) {
    REFRESH_STORAGE.list.push(storageInfo)
  }
}
// 移除本地数据
export function removeStorage(storageInfo?: TStorageInfo) {
  if (!storageInfo) {
    window.sessionStorage.clear()
    return window.localStorage.clear()
  }
  const { key, store } = storageInfo
  window[store].removeItem(key)
}

// 时间字符串转moment对象, 默认当前时间
export function vDate(dateStr?: string | number, format = dayY2D) {
  // 当传入dayjs 的 format 为undefined,表示解析传入的 ISO 8601 格式的字符串
  return dateStr ? dayjs(dateStr, format || undefined) : dayjs()
}

// 格式化当前时间,默认格式化字符串 YYYY-MM-DD
export function uDate(date?: Dayjs | string | number, format = dayY2D, vFormat = dayY2D) {
  if (typeof date === "number") return vDate(date, "").format(format)
  if (typeof date === "string") return vDate(date, vFormat).format(format)
  if (!date) return ""
  return date.format(format)
}

// 数值格式化转换
export function parseNum(value: unknown, digits = 2, errorNum = 0) {
  try {
    if (!isNumVal(value)) return errorNum
    const num = Number(value)
    if (digits >= 0) return Number(num.toFixed(digits))
    return num
  } catch {
    return errorNum
  }
}

// 使给定数字保持足够小数位
export function keepTwoDecimalFull(num: string | number, digits = 2): string {
  if (!isNumVal(num)) {
    return keepTwoDecimalFull(0, digits)
  }
  const roundNum = parseNum(num, digits)
  if (!digits) return `${roundNum}`
  const numArr = `${roundNum}`.split(".")
  const decimal = (numArr[1] || "").padEnd(digits, "0")
  return `${numArr[0]}.${decimal}`
}

const NUM_REG = /^(\+|-)?\d+(\.\d+)?$/
// 判断是否是有效的数字值 正常数字：true, NaN和非数字：false
export function isNumVal(value: unknown) {
  if (typeof value === "number") return true
  return NUM_REG.test(`${value}`)
}

// 数值进率计算，默认 kW 到 MW，进率1000
export function evoluateNum(v: number | string, evo: number = EVO_POWER, digits = 2) {
  if (!isNumVal(v)) return null
  if (evo === 1) return parseNum(v, digits)
  return parseNum(parseNum(v ?? 0) / (evo || 1), digits)
}

export function numberVal(v: number | string, evo?: number) {
  if (!isNumVal(v)) return v
  return evoluateNum(v, evo || 1)
}

interface ILargeNumEvoParams<TV = number | string> {
  value: TV
  unit: string
  digits?: number
}

export type TlargeUnit = "EVO_W" | "EVO_Y"
export function compareEvo(value: number | string): { largeUnit?: TlargeUnit; largeEvo: number } {
  const theValue = typeof value === "number" ? value : parseNum(value, -1)
  let largeUnit: TlargeUnit
  let largeEvo = 1
  if (theValue >= LARGER_Y) {
    largeUnit = "EVO_Y"
    largeEvo = LARGER_Y
  } else if (theValue >= LARGER_W) {
    largeUnit = "EVO_W"
    largeEvo = LARGER_W
  }
  return { largeUnit, largeEvo }
}
function largeNum4Arr(info: ILargeNumEvoParams<(number | string)[]>) {
  const { value, unit, digits = 2 } = info
  if (isEmpty(value)) return { value, unit }
  let evoInfo: ReturnType<typeof compareEvo>
  value.find((p) => (evoInfo = compareEvo(p)).largeUnit)
  const { largeUnit, largeEvo } = evoInfo || { largeUnit: "", largeEvo: 1 }
  const theValue = largeUnit ? value.map((p) => evoluateNum(p, largeEvo, digits)) : value
  return { value: theValue, unit: `${UNIT[largeUnit] || ""}${unit}` }
}
// 处理数值单位进率, 默认单位 kWh, 大单位万千瓦时
export function evoLargeNum4Unit(info: ILargeNumEvoParams<number | string | (number | string)[]>) {
  const { value, unit, digits = 2 } = info
  if (Array.isArray(value)) {
    return largeNum4Arr(info as ILargeNumEvoParams<(number | string)[]>)
  }
  if (!isNumVal(value)) return { value, unit }
  const { largeUnit, largeEvo } = compareEvo(value)
  const theValue = evoluateNum(value, largeEvo, digits)
  return { value: theValue, unit: `${UNIT[largeUnit] || ""}${unit}` }
}

// 判断给定数据是否为空，空数组，空对象
export function isEmpty(data: unknown) {
  const theType = typeof data
  if (theType === "boolean" || theType === "function") return false
  if (theType === "number" && !isNumVal(data)) return true
  if (theType === "string" && (!data || ["null", "undefined"].includes(`${data}`))) return true
  if (!data) return true
  if (Array.isArray(data) && !data.length) return true
  return theType === "object" && !Object.keys(data).length
}

// 按指定步长将一维数组转换为二维数组
// 将一维数组转成二维数组
export function oneToTowDimentionArr(count: number, arr: any) {
  if (!arr || arr.length === 0) return []
  if (arr.length <= count) return [arr]
  const result = []
  const pages = Math.ceil(arr.length / count)
  for (let i = 0, s = 0; i < pages; i++) {
    result.push(arr.slice((s = i * count), s + count))
  }
  return result
}

// 按指定步长将一维数组转换为指定维数的数组组
export function convertToNDimensionalArray(array: any, step: number, dimension?: number) {
  const result = []
  let currentDimension = result

  let i = 0
  while (i < array.length) {
    const subArray = array.slice(i, i + step)
    currentDimension.push(subArray)
    i += step
    if (currentDimension.length < dimension) {
      currentDimension = subArray
    }
  }

  // 如果目标数组长度小于指定步长，添加空的子数组
  if (array.length % step !== 0) {
    const emptySubArray = Array(step - (array.length % step)).fill(null)
    currentDimension.push(emptySubArray)
  }

  return result
}

// 创建唯一id
export function createUUID() {
  return uuidV4().replace(/-/g, "")
}

// 判断响应数据是否正常
export function validResErr(data: any): boolean {
  if (data?.msg === "CANCELED_ERROR") return true
  return !data || (!!data.code && `${data?.code}` !== "200")
}
// 判断操作是否成功
export async function validOperate(data: any, sMsg = "操作成功！", eMsg = "操作失败！") {
  const isErr = validResErr(data)
  if (isErr) return await showMsg(data?.msg || eMsg, "error").then(() => false)
  return await showMsg(data?.msg || sMsg, "success").then(() => true)
}
// 响应是否有数据返回
export function validServe(data: any, msg = "接口出错！") {
  const isErr = validResErr(data)
  if (isErr && data?.msg !== "CANCELED_ERROR") showMsg(data?.msg || msg, "error").then(() => null)
  return data
}

// 提取数组对象各项指定字段组成 map 对象
export function reduceList2KeyValueMap<T>(
  listData: T[],
  fieldInfo?: { vField?: string; lField?: string; keyFun?: (d: T) => string } | null,
  fullInfo?: string[] | boolean | ((next: T, index: number) => unknown),
): Record<string, any> {
  if (!Array.isArray(listData) || !listData?.length) return {}
  const { vField, lField, keyFun } = fieldInfo || { vField: "value", lField: "label" }
  if (!vField && !keyFun) return {}
  let mapKey: string
  return listData.reduce((prev, next, currentIndex) => {
    mapKey = keyFun ? keyFun(next) : (next[vField] as string)
    // 根据指定的 value 值去重
    if (prev[mapKey] && !Array.isArray(fullInfo)) return prev
    // 缺省配置，默认取{ kField: any, vField: any } 对象
    if (fullInfo && typeof fullInfo === "boolean") {
      prev[mapKey] = { value: next[vField], label: next[lField] }
    } else if (fullInfo && Array.isArray(fullInfo)) {
      // 按类分组
      if (!prev[mapKey]) prev[mapKey] = []
      prev[mapKey].push(next)
    } else if (fullInfo && typeof fullInfo === "function") {
      // 通过传入方法取值, 可在方法中选择字段
      prev[mapKey] = fullInfo(next, currentIndex)
    } else {
      // 不需要其他信息，只要 key-value 的map
      prev[mapKey] = next[lField]
    }
    return prev
  }, {})
}

// 停止一段时间
export async function sleepAnyTime(timer: number) {
  await new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), timer)
  })
}

export function isArraySame<T = string | number>(source: T[], target: T[]) {
  const sLength = source.length
  const tLength = target.length
  return !(sLength !== tLength || (sLength === tLength && source.find((i) => !target.includes(i))))
}

export function cocatUnit(title: string, unit?: string, needBracket?: boolean) {
  if (!unit) return title
  if (!needBracket) return `${title} ${unit}`
  return `${title}(${unit})`
}

export function calcRootFontSize(baseSize = 16, uiWidth = 1920) {
  const screenWidth = window.screen.width
  const rootFontSize = (screenWidth / uiWidth) * baseSize
  return Math.max(rootFontSize, 12)
}

// 输出根据区域中心-场站的树形结构
export function stationTrform(stationList, companyList, key = "stationCode") {
  if (validResErr(companyList)) companyList = getStorage(StorageCompanyData)
  // console.log(companyList, "companyList")

  const result: TTreeOptions = stationList?.reduce((acc: TTreeOptions, cur) => {
    const info = acc?.filter((i) => i.maintenanceComId === cur.maintenanceComId)
    if (!info?.length) {
      acc.push({
        key: cur.maintenanceComId + "区域",
        title: companyList?.find((item) => item?.type === "MAINTENANCE" && item?.id === cur?.maintenanceComId)
          ?.shortName,
        value: cur.maintenanceComId + "区域",
        maintenanceComId: cur.maintenanceComId,
        selectable: false,
        children: [],
      })
    }
    acc?.forEach((i) => {
      if (i.maintenanceComId === cur.maintenanceComId) {
        i.children.push({
          key: cur[key],
          value: cur[key],
          title: cur.shortName,
          type: cur.stationType,
          maintenanceComId: cur.maintenanceComId,
          stationId: cur.id,
        })
      }
    })
    return acc
  }, [])
  return result
}

// 输出根据模型名称-设备的树形结构
export function deviceTrform(
  deviceList,
  key = "deviceId",
  title = "deviceNumber",
  parentDisableCheck = false,
  parentSelectable = false,
): TTreeOptions {
  return deviceList.reduce((acc: TTreeOptions, cur) => {
    const info = acc?.filter((i) => i.modelId === cur.modelId)
    if (!info?.length) {
      acc.push({
        key: cur.modelId + "模型",
        title: cur.model,
        value: cur.modelId + "模型",
        selectable: parentSelectable,
        disabled: parentDisableCheck,
        children: [],
        modelId: cur.modelId,
      })
    }
    acc?.forEach((i) => {
      if (i.modelId === cur.modelId) {
        i.children.push({
          key: cur[key],
          value: cur[key],
          title: cur[title],
          label: cur[title],
          modelId: cur.modelId,
        })
      }
    })
    return acc
  }, [])
}
export function stnDeviceTrform(
  deviceList,
  key = "deviceId",
  title = "deviceNumber",
  parentDisableCheck = false,
  parentSelectable = false,
): TTreeOptions {
  return deviceList.reduce((acc: TTreeOptions, cur) => {
    const info = acc?.filter((i) => i.modelId === cur.modelId)
    if (!info?.length) {
      acc.push({
        key: cur.modelId + "模型" + cur.stationCode,
        title: cur.model,
        value: cur.modelId + "模型" + cur.stationCode,
        selectable: parentSelectable,
        disabled: parentDisableCheck,
        children: [],
        modelId: cur.modelId,
      })
    }
    acc?.forEach((i) => {
      if (i.modelId === cur.modelId) {
        i.children.push({
          key: cur[key],
          value: cur[key],
          title: cur[title],
          label: cur[title],
          modelId: cur.modelId,
          stationName: cur.stationName,
        })
      }
    })
    return acc
  }, [])
}

export const getStationMainId = (record) => {
  const stationMap = getStorage(StorageStationData)?.stationMap
  return stationMap?.[record?.stationCode]?.maintenanceComId || 1
}

// 判断操作环境
export const judgeOperateEnv = (() => {
  const userAgent = navigator.userAgent // 获取User Agent字符串
  let operateEnv: "Win" | "MacOS" | "Linux"
  if (/(Win)/.test(userAgent)) {
    operateEnv = "Win"
  } else if (/Mac|iPod|iPhone|iPad/.test(userAgent)) {
    operateEnv = "MacOS"
  } else if (/Linux/.test(userAgent)) {
    operateEnv = "Linux"
  } else {
    operateEnv = "Win"
  }
  return operateEnv
})()

export function onTransDataPaste(event: ClipboardEvent): string[] {
  // 处理粘贴事件的逻辑
  const opEnv = judgeOperateEnv
  const replaceStr = opEnv === "Win" ? /\r\n/g : opEnv === "Linux" ? /\n/g : /\r/g
  const pastedData = event.clipboardData.getData("text") || ""
  const transData = pastedData.replace(replaceStr, ",")?.split(",") || []
  if (transData.length > 1) transData.splice(-1)
  return transData
}

// 判断是否是Linux环境
export const isLinux = (txt) => {
  return /linux/.test(txt.toLowerCase())
}

export function removeProperties(obj, propertiesToRemove) {
  for (const prop of propertiesToRemove) {
    if (obj.hasOwnProperty(prop)) {
      delete obj[prop]
    }
  }
  return obj
}

// export function judgeNull(value, denominator = 1, decimal = 2, defaultNullState = null) {
//   if (typeof value === "string") return value
//   if (`${value}` === "undefined" || `${value}` === "null") return defaultNullState
//   let res = 0
//   res = value === 0 ? 0 : parseNum(value / denominator, decimal)
//   return res
// }
//增加字符串转换
export function judgeNull(value, denominator = 1, decimal = 2, defaultNullState = null) {
  if (value == null || value === undefined || value === "undefined" || value === "null") {
    return defaultNullState;
  }
  if (typeof value === 'string' && !/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(value.trim())) {
    return value;
  }
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return defaultNullState;
  }
  if (numValue === 0) {
    return "0";
  }
  const calculatedValue = numValue / denominator;
  return decimal >= 0 
    ? calculatedValue.toFixed(decimal) 
    : String(calculatedValue);
}

// 根据设备类型获取归属系统
export const getBelongForType = async (deviceType?) => {
  let getAlarmLevelLs = getStorage(StorageDeviceSystem)
  if (!getAlarmLevelLs) {
    getAlarmLevelLs = await doNoParamServer<any>("getSubSystemTypeData")
    if (validResErr(getAlarmLevelLs)) return (getAlarmLevelLs = [])
  }
  getAlarmLevelLs =
    getAlarmLevelLs?.map((i) => {
      return { label: i.name, value: i.id }
    }) || []
  let belongLists = []
  switch (deviceType) {
    case "WT":
      belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("1") === 0)
      break
    case "PVINV":
      belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("2") === 0)
      break
    case "ESPCS":
      belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("3") === 0)
      break
    case "SYZZZ":
      belongLists = getAlarmLevelLs.filter((i) => i.value.toString().indexOf("4") === 0)
      break
    default:
      belongLists = []
  }
  return belongLists
}

export const getAlarmLevelByType = (deviceType: TDeviceType) => {
  let list = []
  if (deviceType === "WT" || deviceType === "PVINV" || deviceType === "ESPCS") {
    list = [
      { value: 1, label: "故障" },
      { value: 2, label: "告警" },
      { value: 3, label: "提示" },
    ]
  } else if (deviceType === "SYZZZ") {
    list = [
      { value: 11, label: "事故" },
      { value: 12, label: "异常" },
      { value: 13, label: "越限" },
      { value: 14, label: "变位" },
      { value: 15, label: "告知" },
    ]
  }
  return list
}

export const getSortSelectOpts = (dvsType?) => {
  const dvsTypeBelong = dvsType ? SITE_LAYOUT?.filter((i) => i.belongType === dvsType) || [] : []
  const other = SITE_LAYOUT?.filter((i) => !i.belongType)
  return [...other, ...dvsTypeBelong]
}

// 用户信息
export const getUserInfo = async () => {
  const res = await doBaseServer<null, ILoginInfo>("getLoginUser")
  if (validResErr(res)) return null
  return { roleId: res.roleId, info: res }
}
