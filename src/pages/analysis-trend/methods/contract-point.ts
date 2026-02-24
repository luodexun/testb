import { MutableRefObject } from "react"

import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { IAnalyFormItemCfgMap } from "@/pages/analysis-scatter/types"
import { IDvsMeasurePointData } from "@/types/i-device"
import { getDvsMeasurePointsData, queryDevicesByParams } from "@/utils/device-funs"
import { onFormValueChange } from "@/utils/form-funs"
import { deviceTrform, stnDeviceTrform } from "@/utils/util-funs"

import { DEVICETYPE_POINT } from "../configs/point"
import { IAnlyTrendSchForm, TAnlyTrendSchItemName } from "../types"
const CHG_EXCLUDE: (keyof IAnlyTrendSchForm)[] = ["displayType", "func", "timeInterval", "dateRange"]
let allDvsList = []
const lastModelList: number[] = [] // 记录上次的模型列表
export async function onAnlyCttTrendSchFormChange(
  changedValue: IAnlyTrendSchForm,
  formRef: MutableRefObject<IFormInst<IAnlyTrendSchForm>>,
  formItemCfgMap: IAnalyFormItemCfgMap,
): Promise<TFormItemConfig<TAnlyTrendSchItemName>> {
  return onFormValueChange<IAnlyTrendSchForm>(changedValue, CHG_EXCLUDE, async (value, field) => {
    if (!["deviceIds", "deviceType", "devicePoint"].includes(field)) return {}
    const formInst = formRef.current?.getInst()
    if (!formInst.getFieldValue("deviceType")) return {}
    if (field === "devicePoint") {
      const pointData = formItemCfgMap.formItemConfig?.devicePoint?.treeData
      const dvsPointTree = setPointDisabledOverLimit(value, pointData, 30000) // 限制测点数量
      return { devicePoint: { treeData: dvsPointTree } }
    }
    if (field === "deviceType") {
      formInst?.setFieldsValue({ deviceIds: [], devicePoint: [] })
    }
    const dvsType = formInst.getFieldValue("deviceType")
    if (field === "deviceType") {
      const { treeData, dvsList } = await getAnalyDeviceOptions(value)

      return { deviceIds: { treeData: treeData }, deviceList: dvsList }
    }
    if (field === "deviceIds") {
      const devicePoint = formInst.getFieldValue("devicePoint") || []
      const pointChoose = devicePoint?.map((i) => i.value) // 已选择的测点
      const pointLs = await getDvsPoint(value, dvsType)
      const pointLsKeys = pointLs?.map((i) => i.value)
      const existChoosePoints = pointChoose?.filter((i) => pointLsKeys?.includes(i)) // 当前存在选择的测点

      formInst?.setFieldsValue({ devicePoint: devicePoint?.filter((i) => existChoosePoints?.includes(i.value)) })
      return { devicePoint: { treeData: pointLs } }
    }
    return {}
  })
}
export const getDvsPoint = async (value, dvsType) => {
  const chooseDvs = allDvsList.filter((i) => value?.includes(i.value))
  const modelLs = chooseDvs?.map((i) => i.modelId)
  const unRepeatModel: number[] = Array.from(new Set(modelLs))
  let pointLs = []
  // 选择的设备超过一个型号的，测点取固定测点，否则拿接口返回的测点
  if (unRepeatModel?.length && unRepeatModel?.length < 2) {
    const pointRes = await getDvsMeasurePointsData({ modelId: unRepeatModel?.[0], pointTypes: "1,2" })
    pointLs = pointRes?.map((i) => {
      return {
        key: i.pointName,
        value: i.pointName,
        title: i.pointDesc,
      }
    })
  } else {
    pointLs = getDvsTypePionts(dvsType)
  }
  return pointLs
}
const getDvsTypePionts = (type) => {
  return DEVICETYPE_POINT?.[type]?.map((i: IDvsMeasurePointData) => {
    return {
      key: i.pointName,
      value: i.pointName,
      title: i.pointDesc,
    }
  })
}
export const getAnalyDeviceOptions = async (deviceType) => {
  const params = { deviceType }
  const resData = await queryDevicesByParams(params)
  const dvsOptions = resData.map((item) => ({ label: item.deviceName, value: item.deviceCode, modelId: item.modelId }))
  allDvsList = dvsOptions
  const treeData = resData?.reduce((prev, cur) => {
    const isExist = prev?.find((i) => i.value === cur.stationCode)
    if (!isExist) {
      const stnOfDvs = resData?.filter((dvs) => dvs.stationCode === cur.stationCode)
      const child = stnDeviceTrform(stnOfDvs, "deviceCode", "deviceName", false, true)
      prev.push({ value: cur.stationCode, title: cur.stationName, selectable: true, children: child })
    }
    return prev
  }, [])

  return { treeData, dvsList: resData }
}
const setDvsDisabledOverLimit = (value, dvsList, limit = 30000) => {}
const setPointDisabledOverLimit = (value, pointData, limit = 30000) => {
  const point = value.map((i) => i.value)

  if (value?.length < limit)
    return pointData?.map((i) => {
      return {
        ...i,
        disabled: false,
      }
    })
  return pointData?.map((i) => {
    return {
      ...i,
      disabled: !point.includes(i.value),
    }
  })
}
