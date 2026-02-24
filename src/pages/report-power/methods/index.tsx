/*
 * @Author: xiongman
 * @Date: 2023-10-18 10:53:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-07 10:13:55
 * @Description:
 */

import { IRpPowerData, IRpPowerSchForm, IRpPowerSchParams, TRpSchFmItemName } from "@pages/report-power/types"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { getStartAndEndTime } from "@utils/form-funs.ts"
import { joinFormValue } from "@utils/table-funs.tsx"
import { validOperate, validResErr } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"
import dayjs from "dayjs"

import { doBaseServer } from "@/api/serve-funs.ts"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { day4Y2S, dayY2D } from "@/configs/time-constant"
// import { TTreeOptions } from "@/types/i-antd"
import { IPageInfo } from "@/types/i-table.ts"
import { getTypeStationList } from "@/utils/device-funs"
import { parseNum, uDate } from "@/utils/util-funs"

import ComparePopower from "../components/cellPopover"
import {
  COLOUMNS_CZ,
  COLOUMNS_JD,
  COLOUMNS_MX,
  COLOUMNS_QICI,
  COLOUMNS_QY,
  COLOUMNS_SB,
  COLOUMNS_XL,
  COLOUMNS_XM,
  CONTROL_LOG_COLUMNS,
  END_TIME,
  ESPCS_COLUMNS,
  PVINV_COLUMNS,
  START_TIME,
  WT_AND_PV_COM_COLUMNS,
  WT_COLUMNS,
  WT_PV_ES_COM_COLUMNS,
} from "../configs"
import { WT_PVINV_MAIN_STATE, WT_PVINV_SUB_STATE } from "../configs/state"

let isCurve = false // 记录是否是曲线页面，曲线页面查询不传分页参数
export let saveFormData
// 处理查询及导出参数
function dealParams(formData: IRpPowerSchForm): IRpPowerSchParams {
  const { stationCode, groupByTime, dateRange, point, ...others } = formData
  const autoShowTime = groupByTime !== "1y" && groupByTime !== "1mo"

  const type = groupByTime === "1y" ? "year" : groupByTime === "1mo" ? "month" : "day"
  const [start, end] = dateRange
  // 处理时间,月的话就取当月的1日00:00:00-31日23:59:59，年的话就取当年的1月1日00:00:00-12月31日23:59:59
  const startD = start.startOf(type)
  const endD = end.endOf(type)

  const startTime_two = startD.valueOf()
  const endTime_two = endD.valueOf()
  const { startTime, endTime } = getStartAndEndTime<number>(dateRange, "", null, groupByTime !== "all" ? false : true)
  return {
    ...others,
    groupByTime,
    stationCode: joinFormValue(stationCode, ""),
    startTime: autoShowTime ? startTime : startTime_two,
    endTime: autoShowTime ? endTime : endTime_two,
  }
}

// 执行数据查询
export async function getReportPowerSchData(pageInfo: IPageInfo, formData: IRpPowerSchForm) {
  const params = dealParams(formData)
  saveFormData = formData
  if (!params.startTime && !params.endTime) return { records: [] }
  if (!isCurve) {
    params.pageNum = pageInfo.current
    params.pageSize = pageInfo.pageSize
  }
  let records: IRpPowerData[] = []
  const api = "getProductionDataV2"
  const res = await doBaseServer<IRpPowerSchForm>(api, params)
  if (validResErr(res)) return { records: [], total: 0 }
  // const res = {
  //   list: [
  //     {
  //       productionEfficiency: 0.8767,
  //       productionAvailability: 0.5567,
  //       timeAvailability: 0.9997,
  //       valleyProduction: 99.4536,
  //     },
  //   ],
  //   total: 1,
  // }
  if (!isCurve) {
    const { list, total } = res
    records = parseData(list)
    return { records, total }
  } else {
    records = parseData(res)
    return { records, total: 0 }
  }
}

// 执行数据导出
export function doExportReportPower(pageInfo: IPageInfo, formData: IRpPowerSchForm) {
  const params = dealParams(formData)
  doBaseServer<IRpPowerSchParams, AxiosResponse>("exportProductionData", params).then((data) => {
    dealDownload4Response(data)
  })
}

// 监听场站选择变化查询模型数据
export async function onReportPowerSchFormChg(
  changedValue: IRpPowerSchForm,
  formRef: IFormInst,
): Promise<TFormItemConfig<TRpSchFmItemName> | null> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["deviceType", "groupByTime"].includes(chgedKey)) return {}
  console.log(chgedKey, chgedVal)

  const formInst = formRef?.getInst()
  // const formValue: IRpPowerSchForm = formInst.getFieldsValue()
  if (chgedKey === "deviceType") {
    const actaulStLs = getTypeStationList(chgedVal)
    formInst?.setFieldsValue({ point: [] })
    let columns = []
    if (chgedVal === "WT") {
      columns = [...WT_COLUMNS, ...WT_AND_PV_COM_COLUMNS, ...WT_PV_ES_COM_COLUMNS]
    } else if (chgedVal === "PVINV") {
      columns = [...PVINV_COLUMNS, ...WT_AND_PV_COM_COLUMNS, ...WT_PV_ES_COM_COLUMNS]
    } else if (chgedVal === "ESPCS") {
      columns = [...ESPCS_COLUMNS, ...WT_PV_ES_COM_COLUMNS]
    }
    return {
      stationCode: { options: actaulStLs },
      point: { options: columns },
    }
  }
  if (chgedKey === "groupByTime") {
    const picker = chgedVal === "1mo" ? "month" : chgedVal === "1y" ? "year" : "date"
    // 选择日的时候，时间范围是今日的00:00:00-23:59:59，选择月的时候，时间范围是当月的1日00:00:00-31日23:59:59，选择年的时候，时间范围是当年的1月1日00:00:00-12月31日23:59:59
    let dateRange = []
    if (chgedVal !== "1mo" && chgedVal !== "1y") {
      dateRange = [START_TIME, END_TIME]
    } else if (chgedVal === "1mo") {
      dateRange = [dayjs(new Date()).startOf("month"), dayjs(new Date()).endOf("month")]
    } else if (chgedVal === "1y") {
      dateRange = [dayjs(new Date()).startOf("year"), dayjs(new Date()).endOf("year")]
    }
    formInst?.setFieldsValue({ dateRange })
    return {
      dateRange: {
        style: { width: chgedVal === "all" ? "27em" : "20em" },
        showTime: chgedVal === "all" ? true : false,
        picker,
      },
    }
  }
}

function parseData(data: IRpPowerData[]) {
  const newData = data ? [...data] : []
  for (let i = 0; i < newData.length; i++) {
    const obj = newData[i]

    // 遍历对象的属性
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (
          ![
            "index",
            "regionComName",
            "projectComName",
            "maintenanceComName",
            "stationName",
            "stationCode",
            "deviceCode",
            "totalCapacity",
            "totalDeviceCount",
            "deviceName",
            "periodName",
            "lineName",
            "model",
            "timeAvailability",
            "productionAvailability",
            "productionEfficiency",
          ].includes(key)
        ) {
          obj[key] = parseNum(obj[key])
        }
      }
      obj["transTime"] = uDate(obj["Time"], dayY2D)
    }
  }

  return newData || []
}

export const changeCurve = () => {
  isCurve = !isCurve
}

export const tableSortByKey = (key) => {
  return (a, b) => a[key] - b[key]
}
const getFilterKey = (type) => {
  let key = "stationName"
  let otherKey = ""
  switch (type) {
    case "STATION_CODE":
      key = "stationName"
      break
    case "REGION_COM_ID":
      key = "regionComName"
      break
    case "PROJECT_COM_ID":
      key = "projectComName"
      break
    case "MAINTENANCE_COM_ID":
      key = "maintenanceComName"
      break
    case "PERIOD":
      key = "periodName"
      otherKey = "stationName"
      break
    case "LINE":
      key = "lineName"
      otherKey = "stationName"
      break
    case "DEVICE_CODE":
      key = "deviceName"
      otherKey = "stationName"
      break
    case "MODEL":
      key = "model"
      otherKey = "stationName"
      break
    default:
      key = "stationName"
  }
  return { key, otherKey }
}
export const getCompareList = async (record: IRpPowerData, formData: IRpPowerSchForm) => {
  const params = dealParams(formData)
  const res = await doBaseServer<IRpPowerSchForm, IRpPowerData[]>("getProductionDataV2", params)
  if (validResErr(res)) return null
  const { key, otherKey } = getFilterKey(params.groupByPath)
  const matchInfo = res.find((i) => record[key] === i[key] && record[otherKey] === i[otherKey])
  // console.log(matchInfo, "matchInfo")
  return matchInfo
}

export const getBasicColumns = (groupByPath) => {
  let actColumns = CONTROL_LOG_COLUMNS
  if (groupByPath === "REGION_COM_ID") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_QY]
  } else if (groupByPath === "PROJECT_COM_ID") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_XM]
  } else if (groupByPath === "MAINTENANCE_COM_ID") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_JD]
  } else if (groupByPath === "STATION_CODE") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_CZ]
  } else if (groupByPath === "PERIOD") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_QICI]
  } else if (groupByPath === "LINE") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_XL]
  } else if (groupByPath === "DEVICE_CODE") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_SB]
  } else if (groupByPath === "MODEL") {
    actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_MX]
  }
  return actColumns
}

export const getTypeColunms = (deviceType, typeName, key, isMain, unit = "") => {
  const columns = isMain ? WT_PVINV_MAIN_STATE : WT_PVINV_SUB_STATE
  const res = columns?.[deviceType]?.map((i) => {
    const valKey = `${key}${i.state}`
    return {
      dataIndex: valKey,
      title: `${i.name}${typeName}${unit}`,
      sorter: tableSortByKey(valKey),
      align: "center",
      width: 140,
      render: (text, record) => <ComparePopower text={text} record={record} nameKey={valKey} />,
    }
  })
  return res
}
export async function saveColumns(val, key) {
  const params = {
    key,
    data: val,
  }
  const res = await doBaseServer("updateMngStatic", params)
  const operate = await validOperate(res)
  return operate
}
