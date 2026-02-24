/*
 * @Author: xiongman
 * @Date: 2023-10-30 15:48:22
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-19 14:21:04
 * @Description:
 */

import { doFetchControlLogData } from "@pages/control-log/methods"
import { IControlLogSchForm, IControlLogSchParams } from "@pages/control-log/types"
import { dealDvs4StnInfo, queryDevicesByParams } from "@utils/device-funs.ts"
import { reduceList2KeyValueMap, vDate } from "@utils/util-funs.tsx"
import { MutableRefObject } from "react"

import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceData, IQueryDeviceDataParams } from "@/types/i-device.ts"
import { IPageInfo } from "@/types/i-table.ts"
// import { dfdg } from "./data.ts"
import { IBatchStn2DvsTreeData } from "../types/i-batch.ts"
// const test = {
//   "410221W01": {
//     "1": {
//       "1": [
//         {
//           array: "方阵1",
//           deviceId: 823,
//           deviceCode: "410221W01WT1101001",
//           deviceName: "HAA01",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAA01",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA01",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 824,
//           deviceCode: "410221W01WT1101002",
//           deviceName: "HAA02",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 4000,
//             operation_code: "HAA02",
//           },
//           modelId: 8,
//           model: "GW165P4000H140",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA02",
//           ratedPower: 4000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 825,
//           deviceCode: "410221W01WT1101003",
//           deviceName: "HAA03",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAA03",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA03",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 826,
//           deviceCode: "410221W01WT1101004",
//           deviceName: "HAA04",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAA04",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA04",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 827,
//           deviceCode: "410221W01WT1101005",
//           deviceName: "HAA05",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 4000,
//             operation_code: "HAA05",
//           },
//           modelId: 8,
//           model: "GW165P4000H140",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA05",
//           ratedPower: 4000,
//           operatDateStr: "0001-01-01",
//         },
//       ],
//       "2": [
//         {
//           array: "方阵2",
//           deviceId: 843,
//           deviceCode: "410221W01WT1101001",
//           deviceName: "HAA01",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAA01",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA01",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵2",
//           deviceId: 844,
//           deviceCode: "410221W01WT1101002",
//           deviceName: "HAA02",
//           periodCode: 1,
//           lineCode: 1,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 4000,
//             operation_code: "HAA02",
//           },
//           modelId: 8,
//           model: "GW165P4000H140",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华A线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAA02",
//           ratedPower: 4000,
//           operatDateStr: "0001-01-01",
//         },
//       ],
//     },
//     "2": {
//       "1": [
//         {
//           array: "方阵1",
//           deviceId: 828,
//           deviceCode: "410221W01WT1102006",
//           deviceName: "HAB06",
//           periodCode: 1,
//           lineCode: 2,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 4000,
//             operation_code: "HAB06",
//           },
//           modelId: 8,
//           model: "GW165P4000H140",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华B线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAB06",
//           ratedPower: 4000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 829,
//           deviceCode: "410221W01WT1102007",
//           deviceName: "HAB07",
//           periodCode: 1,
//           lineCode: 2,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAB07",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华B线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAB07",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 830,
//           deviceCode: "410221W01WT1102008",
//           deviceName: "HAB08",
//           periodCode: 1,
//           lineCode: 2,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAB08",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华B线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAB08",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 831,
//           deviceCode: "410221W01WT1102009",
//           deviceName: "HAB09",
//           periodCode: 1,
//           lineCode: 2,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 4000,
//             operation_code: "HAB09",
//           },
//           modelId: 8,
//           model: "GW165P4000H140",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华B线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAB09",
//           ratedPower: 4000,
//           operatDateStr: "0001-01-01",
//         },
//         {
//           array: "方阵1",
//           deviceId: 832,
//           deviceCode: "410221W01WT1102010",
//           deviceName: "HAB10",
//           periodCode: 1,
//           lineCode: 2,
//           operationDate: "0001-01-01T00:00:00.000+08:00",
//           deviceTags: {
//             rated_power: 3000,
//             operation_code: "HAB10",
//           },
//           modelId: 9,
//           model: "GW150P3000H145",
//           version: "V1",
//           manufacturer: "JF",
//           deviceType: "WT",
//           tdStableName: null,
//           stationId: 24,
//           stationPriority: 23,
//           stationCode: "410221W01",
//           stationFullName: "（未开通）杞县华安风电场",
//           stationName: "（未开通）杞县华安",
//           projectComId: 1,
//           projectComFullName: "内黄基地",
//           projectComShortName: "内黄基地",
//           maintenanceComId: 7,
//           maintenanceComFullName: "豫东基地",
//           maintenanceComShortName: "豫东基地",
//           regionComId: 1,
//           regionComFullName: "华润新能源投资有限公司河南分公司",
//           regionComShortName: "河南集控中心",
//           lineName: "华B线",
//           periodName: null,
//           pid: null,
//           parentName: null,
//           deviceNumber: "HAB10",
//           ratedPower: 3000,
//           operatDateStr: "0001-01-01",
//         },
//       ],
//     },
//   },
// }
export async function getBatchCtrlLogData(pageInfo: IPageInfo, formData: IControlLogSchForm) {
  const cDate = vDate().startOf("d")
  const params: IControlLogSchParams = {
    deviceType: formData.deviceType || "WT",
    deviceIds: formData.deviceIds?.join(),
    startTime: cDate.valueOf(),
    endTime: cDate.add(24, "h").valueOf(),
    pageNum: pageInfo.current,
    pageSize: pageInfo.pageSize,
  }
  return doFetchControlLogData(params, pageInfo)
}

type TTreeDataFieldMap = {
  [key in keyof IBatchStn2DvsTreeData]?: keyof Omit<IDeviceData, "runData" | "deviceTags">
}
type TTreeDataPrefix = (keyof Omit<IDeviceData, "runData" | "deviceTags">)[]
export async function getDeviceTreeData(params: IQueryDeviceDataParams) {
  const resData = await queryDevicesByParams(params)
  dealDvs4StnInfo(resData)
  // const resData = dfdg()
  // dealDvs4StnInfo(resData)
  type TDvsGroupMap = Record<string, IDeviceData[]>
  type TArrayDvsGroupMap = Record<string, TDvsGroupMap>
  type TArrayMap = Record<string, TArrayDvsGroupMap>
  const groupByStnField = { vField: "stationCode" }
  const groupByLineFiled = { vField: "lineCode" }
  const groupByArrayFiled = { vField: "array" }
  const deviceType = params.deviceType

  const groupByStationMap = reduceList2KeyValueMap(resData, groupByStnField, []) as TDvsGroupMap
  // debugger
  const groupByStnAndLineMap = Object.entries(groupByStationMap).reduce(
    (prev, [stationCode, deviceList]) => {
      prev[stationCode] = reduceList2KeyValueMap(deviceList, groupByLineFiled, [])
      return prev
    },
    {} as Record<string, TDvsGroupMap>,
  )
  const groupByLineArrayMap =
    deviceType === "PVINV"
      ? (Object.entries(groupByStnAndLineMap)?.reduce((prev, [stnCode, lineList]) => {
          const lines = Object.entries(lineList)?.reduce((linePrev, [lineName, dvsList]) => {
            linePrev[lineName] = reduceList2KeyValueMap(dvsList, groupByArrayFiled, [])
            return linePrev
          }, {})
          prev[stnCode] = lines
          return prev
        }, {}) as TArrayMap)
      : null
  const dvsOfLineFields: TTreeDataFieldMap = { id: "deviceId", title: "deviceNumber" }
  const treeOfLineFields: TTreeDataFieldMap = { id: "lineCode", title: "lineName" }
  const treeOfLinePrefix: TTreeDataPrefix = ["stationCode", "deviceType"]
  const treeOfStnFields: TTreeDataFieldMap = { id: "stationCode" }
  const treeOfStnArrayFields: TTreeDataFieldMap = { id: "array", title: "array" }
  const treeOfLineArrayPrefix: TTreeDataPrefix = ["stationCode", "lineCode"]
  const treeOfStnPrefix: TTreeDataPrefix = ["deviceType"]
  const treeOfStnPvinvPrefix: TTreeDataPrefix = ["stationCode", "deviceType"]

  let stationName: string
  const wtAndEStreeData = Object.entries(groupByStnAndLineMap).map(([stationCode, groupByLineMap]) => {
    const treeOfStation = crtDvsTreeItem({ stationCode, deviceType }, treeOfStnFields, [], treeOfStnPrefix)
    Object.values(groupByLineMap).forEach((lineGroup) => {
      const dvsOfLineList = lineGroup.map((item) => crtDvsTreeItem(item, dvsOfLineFields, true))
      const treeOfLine = crtDvsTreeItem(lineGroup[0], treeOfLineFields, dvsOfLineList, treeOfLinePrefix)
      treeOfStation.children.push(treeOfLine)
      stationName = lineGroup[0].stationName
    })
    treeOfStation.stationName = treeOfStation.title = stationName

    return treeOfStation
  })
  const pvTreeData =
    deviceType === "PVINV"
      ? Object.entries(groupByLineArrayMap).map(([stationCode, groupByLineMap]) => {
          const treeOfStation = crtDvsTreeItem({ stationCode, deviceType }, treeOfStnFields, [], treeOfStnPrefix)
          const line = Object.entries(groupByLineMap)?.map(([lineCode, groupByArrayObj]) => {
            const lineOne = groupByArrayObj[Object.keys(groupByArrayObj)?.[0]]?.[0]
            const treeOfLines = crtDvsTreeItem(lineOne, treeOfLineFields, [], treeOfStnPvinvPrefix)
            Object.values(groupByArrayObj)?.forEach((arrayGroup) => {
              const arrayOne = arrayGroup?.[0]
              if (!arrayOne?.array) {
                arrayOne["array"] = "未知"
              }
              const dvsList = arrayGroup.map((item) => crtDvsTreeItem(item, dvsOfLineFields, true))
              const treeOfLine = crtDvsTreeItem(arrayOne, treeOfStnArrayFields, dvsList, treeOfLineArrayPrefix)
              stationName = arrayOne.stationName
              treeOfLines.children.push(treeOfLine)
            })
            // console.log(groupByArrayObj, "groupByArrayObj", Object.values(groupByArrayObj), treeOfLines)
            return treeOfLines
          })
          treeOfStation.children = line
          treeOfStation.stationName = treeOfStation.title = stationName
          return treeOfStation
        })
      : []
  // console.log(pvTreeData, "pvTreeData")

  return deviceType !== "PVINV" ? wtAndEStreeData : pvTreeData
}
function crtDvsTreeItem(
  info: Partial<IDeviceData>,
  fieldMap: TTreeDataFieldMap,
  children?: IBatchStn2DvsTreeData[] | boolean,
  prefix?: (keyof Omit<IDeviceData, "runData" | "deviceTags">)[] | null,
): IBatchStn2DvsTreeData {
  const { id, key, title } = fieldMap
  let thePrefix = (prefix || []).map((field) => info[field]).join("_")
  thePrefix = thePrefix ? `_${thePrefix}` : ""
  const isLeaf = typeof children === "boolean"
  return {
    id: info[id],
    key: `${info[key || id]}${thePrefix}`,
    title: info[title || "-"],
    deviceCode: isLeaf ? info["deviceCode"] : undefined,
    deviceName: isLeaf ? info["deviceName"] : undefined,
    ratedPower: isLeaf ? info["ratedPower"] : undefined,
    model: isLeaf ? info["model"] : undefined,
    modelId: isLeaf ? info["modelId"] : undefined,
    stationCode: info["stationCode"],
    stationName: info["stationName"],
    isLeaf,
    children: !isLeaf ? children : undefined,
  }
}

export function filterMultiStationCheck(
  checkedNodes: IBatchStn2DvsTreeData[],
  prevCheckedStnRef: MutableRefObject<string>,
  isOneStn = true,
) {
  const stnCodeSet = new Set<string>()
  checkedNodes.forEach(({ stationCode }) => stnCodeSet.add(stationCode))
  const isMultiStn = stnCodeSet.size > 1
  const lastLength = checkedNodes.length - 1
  const result: { keys: string[]; dvsList: IBatchStn2DvsTreeData[] } = { keys: [], dvsList: [] }
  checkedNodes.forEach((item, index) => {
    if (isMultiStn && item.stationCode === prevCheckedStnRef.current && isOneStn) return
    result.keys.push(item.key as string)
    if (item.isLeaf) result.dvsList.push(item)
    if (index === lastLength) prevCheckedStnRef.current = item.stationCode
  }, result)
  return result
}

export function dvsTreeItem2DvsData(treeItem: IBatchStn2DvsTreeData, deviceType: TDeviceType) {
  return {
    deviceId: treeItem.id as number,
    deviceNumber: treeItem.title,
    deviceCode: treeItem.deviceCode,
    ratedPower: treeItem.ratedPower,
    deviceType,
    model: treeItem.model,
    modelId: treeItem.modelId,
    stationCode: treeItem.stationCode,
    stationName: treeItem.stationName,
  }
}

export const getChildArr = (data) => {
  const arr = data.reduce((prev, cur) => {
    const childArr = cur.children?.reduce((childPrev, childCur) => {
      return childPrev.concat(childCur?.children || [])
    }, [])
    const result = prev.concat(childArr)
    return result
  }, [])
  return arr
}

export const getPvinvDvsforPvcolDvs = async (dvsList: Partial<IDeviceData>[]) => {
  if (!dvsList?.length) return []
  const stationCode = dvsList?.[0]?.stationCode
  const pvcolDvsId = dvsList?.map((i) => i.deviceId) || []
  const res = await queryDevicesByParams({ deviceType: "PVINV", stationCode }, [] as any)
  const pvinvDvs = res?.filter((i) => pvcolDvsId.includes(i.pvcol))
  return pvinvDvs
}
