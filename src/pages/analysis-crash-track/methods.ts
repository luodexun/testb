/*
 * @Author: xiongman
 * @Date: 2023-11-09 15:31:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-07 14:30:08
 * @Description: 事故追忆-方法们
 */

import { day4Y2S } from "@configs/time-constant.ts"
import { getDvsMeasurePointsData, measurePoints2TreeData, queryDevicesByParams } from "@utils/device-funs.ts"
import { dealDownload4Response } from "@utils/file-funs.tsx"
import { onFormValueChange } from "@utils/form-funs.ts"
import { joinFormValue } from "@utils/table-funs.tsx"
import { getStorage, showMsg, uDate, validResErr, validServe } from "@utils/util-funs.tsx"
import { AxiosResponse } from "axios"
import { Dispatch, MutableRefObject, SetStateAction } from "react"

import { doBaseServer, doRecordServer } from "@/api/serve-funs.ts"
import { IFormInst } from "@/components/custom-form/types.ts"
import { StorageStationData } from "@/configs/storage-cfg.ts"
import { IBoostMQData, IBoostSvgPath } from "@/types/i-boost.ts"
import { IPageInfo } from "@/types/i-table.ts"

import { IMG_NAME_OPTIONS } from "./configs.ts"
import { ICrashTrackSchForm, ICrashTrackSchParams } from "./types.ts"
import { TTreeOptions } from "@/types/i-antd.ts"

function dealParams(pageInfo: IPageInfo, formData: ICrashTrackSchForm): ICrashTrackSchParams | null {
  const { stationInfo, dateTime, devicePoint } = formData || {}
  if (!dateTime) {
    showMsg("请选择时间！")
    return null
  }
  const startTime = dateTime.clone().subtract(1, "h").valueOf()
  const endTime = dateTime.valueOf()
  // const actPoint = devicePoint?.map((i) => i.split("-")[0])
  return {
    devicePoint: joinFormValue(devicePoint || [], "all"),
    stationCode: stationInfo,
    startTime,
    endTime,
    pageNum: pageInfo.current,
    pageSize: pageInfo.pageSize,
  }
}
export async function crashTrackSearch(pageInfo: IPageInfo, formData: ICrashTrackSchForm) {
  const params = dealParams(pageInfo, formData)
  if (!params) return { records: [], total: 0 }
  const resData = await doRecordServer<typeof params, IBoostMQData>("getCrashTrackData", params)
  validServe(resData)
  if (validResErr(resData) || !resData?.list?.length) return { records: [], total: 0 }
  const { list, total } = resData
  dealCrashTrackData(list || [])
  return { records: list || [], total: total }
}

function dealCrashTrackData(crashData: IBoostMQData[]) {
  crashData.forEach((item) => {
    item.TimeStr = uDate(item.Time, day4Y2S)
  })
}

export async function exportCrashTrackData(pageInfo: IPageInfo, formData: ICrashTrackSchForm) {
  const params = dealParams(pageInfo, formData)
  if (!params) return false
  const data = await doBaseServer<typeof params, AxiosResponse>("exportCrashTrackData", params)
  dealDownload4Response(data, "事故追忆.xlsx")
  return true
}

export function dealCrashTrackFormChange(
  changedValue: Partial<ICrashTrackSchForm>,
  formRef: MutableRefObject<IFormInst>,
  setSvgPathInfo: Dispatch<SetStateAction<IBoostSvgPath>>,
  formItemConfig,
) {
  return onFormValueChange(changedValue, ["dateTime"], async (value, field) => {
    // if (!value) {
    //   if (field === "stationInfo") formRef.current?.getInst()?.resetFields()
    //   return {}
    // }
    if (field === "stationInfo") {
      const formSet = formRef.current?.getInst()
      const { stationMap } = getStorage(StorageStationData)
      const { stationCode, stationName } = stationMap[value] || {}
      // const { value: stationCode, label: stationName } = value as ICrashTrackSchForm["stationInfo"]
      // 获取升压站型号信息
      // const deviceList = await queryDevicesByParams({ stationCode, deviceType: "SYZZZ" })
      // // 升压站型号id
      // const modelIds = joinFormValue(deviceList?.map(({ modelId }) => modelId))
      // formSet?.setFieldValue("devicePoint", undefined)
      // if (!modelIds) return { devicePoint: { treeData: [] } }
      // const dvsMeasurePoints = await getDvsMeasurePointsData({ modelId: modelIds, pointTypes: "1,2" })
      // const dvaMeasurePointTree = measurePoints2TreeData(dvsMeasurePoints)?.map((i) => {
      //   return {
      //     ...i,
      //     disabled: true,
      //   }
      // })

      const svgName = IMG_NAME_OPTIONS[0].value

      formSet?.setFieldValue("imgName", svgName)

      setSvgPathInfo({ stationCode, stationName, svgName })
      return { devicePoint: { treeData: [] } }
    }
    if (field === "imgName") {
      setSvgPathInfo((prevState) => ({ ...prevState, svgName: value }))
    }
    if (field === "devicePoint") {
      const treeData = deviceDisabled4OverLimit(formItemConfig, changedValue)
      return { devicePoint: { treeData: treeData } }
    }
    return {}
  })
}

export function deviceDisabled4OverLimit<TN>(
  formItemConfig: Partial<Record<keyof TN, any>>,
  changedValue: TN,
  limitCount = 3,
) {
  const [field, value] = Object.entries(changedValue)[0]
  if (!formItemConfig) return []
  const theOptions: TTreeOptions = formItemConfig[field].treeData
  theOptions.forEach((item) =>
    item.children.forEach((j) => (j.disabled = !value.includes(j.value) && value?.length >= limitCount)),
  )
  return theOptions
}

export const getExitOnOffCbPoint = (data) => {
  const existArr = ["ON", "OFF", "CB", "TP", "ARM"]
  return Object.keys(data).reduce((prev, cur) => {
    const exit = data[cur]?.find((i) => existArr.includes(i.type))
    if (exit) {
      prev.push(cur)
    }
    return [...prev]
  }, [])
}
