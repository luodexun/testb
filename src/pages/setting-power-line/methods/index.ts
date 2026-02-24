/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 18:03:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-23 15:34:36
 * @Description:
 */

import { getDeviceModelMap, getTypeStationList } from "@utils/device-funs.ts"

import { doBaseServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { TDeviceType } from "@/types/i-config.ts"
import { IDvsModelMap, IStnDvsType4LocalStorage } from "@/types/i-device.ts"
// import { IStationData } from "@/types/i-station"
import { IPageInfo } from "@/types/i-table.ts"
import { getStorage, isEmpty, validOperate, validResErr } from "@/utils/util-funs"

import { DEVICETYPE_CODE } from "../configs"
import {
  ICurvePiontList,
  IPowerData,
  IPwLineMdSchForm,
  ISearchFr,
  TModelFrAndTbInfo,
  TPowerAddOrEditFormField,
} from "../types"

// 执行数据查询
export async function geStPwLineSchData(_?: IPageInfo, formData?: ISearchFr) {
  const api = formData?.curveId === "WT" ? "getWtPowerCurveByStn" : "getPvPowerCurveByStn"
  const params = {
    modelId: formData?.modelId,
    stationId: formData?.stationId,
  }
  const records = await doBaseServer<ISearchFr, IPowerData[]>(api, params)
  if (validResErr(records)) return null
  const { idToInfoMap } = await getDeviceModelMap()
  records.forEach((item) => {
    item.modelName = idToInfoMap[item.modelId]?.model || "-"
    item.deviceType = formData.curveId
  })

  return { records, total: 0 }
}

export async function onSetPWlIineSchFormChg(
  changedValue: IPwLineMdSchForm,
  formInst: IFormInst,
): Promise<TFormItemConfig<TPowerAddOrEditFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "curveId"].includes(chgedKey) || isEmpty(chgedVal)) return {}
  const theFormInst = formInst?.getInst()
  if (chgedKey === "stationId") {
    const dvsType = theFormInst?.getFieldValue("curveId")
    const result = await getCurDeviceModel(chgedVal, dvsType)
    theFormInst?.setFieldsValue({ modelId: result?.length ? result[0].value : "" })
    return { modelId: { options: result } }
  }
  if (chgedKey === "curveId") {
    theFormInst?.setFieldsValue({ modelId: null, stationId: null })
    // const getDeviceType = DEVICETYPE_CODE.find((i) => i.value === chgedVal)?.key
    const actaulStLs = getTypeStationList(chgedVal, "id")
    return { stationId: { options: actaulStLs }, modelId: { options: [] } }
  }
  return {}
}

// 本页面只匹配风机设备型号
export const getCurDeviceModel = async (stationId?: number, dvsType = "WT") => {
  if (!stationId) return [] as TDvsMdlOptions
  const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
  const deviceModelOfStWT = deviceTypesOfSt?.find((i) => i.stationId === stationId)?.modelIds || []
  type TDvsMdlOptions = IDvsModelMap["typeToOptionsMap"][TDeviceType]

  const { typeToOptionsMap } = await getDeviceModelMap()
  if (!typeToOptionsMap) return [] as TDvsMdlOptions
  const actaulData = []
  typeToOptionsMap[dvsType].forEach((i) => {
    if (deviceModelOfStWT.findIndex((modeId) => modeId == i.value) !== -1) {
      actaulData.push(i)
    }
  })
  return (actaulData || []) as TDvsMdlOptions
}

export const calculateTbData = (
  downLimit: number,
  upLimit: number,
  speed: number,
  curveId?: number,
  differentKey = "beanWindSpeed",
) => {
  if (upLimit < downLimit) return []
  const curvePointList = []
  const listLength = (upLimit - downLimit) / speed
  const count = listLength + downLimit
  let numb = downLimit
  for (let i = downLimit; i <= count; i++) {
    curvePointList.push({
      id: i,
      curveId: curveId || null,
      [differentKey]: numb,
      standardActivePower: 0,
      actualActivePower: 0,
    })
    numb = numb + speed
  }
  return curvePointList
}

export const editDisableList = (flag: boolean) => {
  return {
    interval: { disabled: flag },
    actualAirDensity: { disabled: flag },
    standardAirDensity: { disabled: flag },
    standardTemperature: { disabled: flag }, // 标准温度
    actualTemperature: { disabled: flag },
    step: { disabled: flag },
  }
}

// 修改和查看状态时，计算资源区间和步长
export const calItAndStep = (arr: ICurvePiontList[], deviceTypeDifferentKey) => {
  const length = arr.length
  const min = length ? arr[0][deviceTypeDifferentKey] : 2
  const max = length ? arr[length - 1][deviceTypeDifferentKey] : 25
  const step = length > 1 ? arr[1][deviceTypeDifferentKey] - min : arr[0][deviceTypeDifferentKey]
  // const step = +max - +min + 1 < arr.length ? 0.5 : 1
  return { min, max, step }
}

export const compareByKey = (prop: string) => {
  return function (obj1: ICurvePiontList, obj2: ICurvePiontList) {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}
// 新增
export const insertWtPowerCurve = async (data: TModelFrAndTbInfo, editType) => {
  const differentKey = data.deviceType === "WT" ? "beanWindSpeed" : "irradiance"
  const tableKeys = data.deviceType === "WT" ? "mngWtPowercurvePointList" : "mngPvPowercurvePointList"
  const list =
    editType == "add"
      ? data.tableData?.map((i) => {
          return {
            [differentKey]: i[differentKey],
            standardActivePower: i.standardActivePower,
            actualActivePower: i.actualActivePower,
          }
        })
      : data.tableData
  const params = {
    ...data.formList,
    [tableKeys]: list,
  }
  let api = ""
  if (data.deviceType === "WT") {
    api = editType == "add" ? "insertWtPowerCurve" : "updateWtPowerCurve"
  } else {
    api = editType == "add" ? "insertPvPowerCurve" : "updatePvPowerCurve"
  }
  const res = await doBaseServer<any>(api, params)
  return validOperate(res)
}

// 删除
export const delWtPowerCurveById = async (id: number | number[], dvsType) => {
  const api = dvsType == "WT" ? "batchDltWtPowerCurveById" : "batchDltPvPowerCurveById"
  // const params = dvsType == "WT" ? { id } : { params: { ids: id } }
  const res = await doBaseServer<any>(api, { idList: id })
  return validOperate(res)
}
