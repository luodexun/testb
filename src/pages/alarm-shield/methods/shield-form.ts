/*
 * @Author: chenmeifeng
 * @Date: 2024-03-06 10:19:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-29 10:32:45
 * @Description:
 */
import { doBaseServer, doRecordServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { getStn2DvsTypeInfoMap } from "@/pages/control-log/methods"
import { LOGIN_INFO_FOR_FUNS } from "@/store/atom-auth"
import { IStnDvsType4LocalStorage } from "@/types/i-device"
import { getDeviceModelMap, queryDevicesByParams } from "@/utils/device-funs"
import { deviceTrform, getStorage, validOperate, validResErr } from "@/utils/util-funs"

import { TShieldFmItemName, TShieldForm } from "../types/shield-form"
import { getAlarmShieldData } from "."

export const onSHIELDFormChange = async (
  changedValue: TShieldForm,
  formRef: IFormInst,
  dvsTypeInfoOfStnMap: ReturnType<typeof getStn2DvsTypeInfoMap>,
  deviceTypeMap: Record<string, string>,
): Promise<TFormItemConfig<TShieldFmItemName> | null> => {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType", "deviceId", "modelId"].includes(chgedKey)) return {}
  // if (!["stationId", "deviceType"].includes(field)) return {}
  const formInst = formRef?.getInst()
  const formValue: TShieldForm = formInst.getFieldsValue()
  if (chgedKey === "stationId") {
    const dvsTypeOptionsOfStn = dvsTypeInfoOfStnMap[chgedVal]
    const dvsOptions = await commonStDevice(null, formValue, deviceTypeMap)
    formInst?.setFieldsValue({ deviceType: undefined, deciveId: undefined, modelId: undefined, alarmId: undefined })
    return {
      deviceType: { options: dvsTypeOptionsOfStn },
      deviceId: { options: dvsOptions },
    }
  }
  if (chgedKey === "deviceType") {
    const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
    const deviceModelOfSt = deviceTypesOfSt?.find((i) => i.stationId === formValue?.stationId)?.modelIds || [] // 场站下所有的模型id
    const { typeToOptionsMap } = await getDeviceModelMap() // 所有设备下的模型数组
    const dvTypeModelList = typeToOptionsMap?.[chgedVal] || [] // 当前设备下的模型
    const dvTypeModelId = dvTypeModelList?.map((i) => i.value) || [] // 当前设备下的模型ID数组
    const modelOption = [] // 当前场站下，某设备类型下的模型数组
    deviceModelOfSt.forEach((i) => {
      if (dvTypeModelId.includes(i)) modelOption.push(dvTypeModelList.find((j) => j.value === i))
    })
    formInst?.setFieldsValue({ deciveId: undefined, modelId: undefined, alarmId: undefined })
    return { modelId: { options: modelOption } }
  }
  if (chgedKey === "modelId" && formValue?.shieldType !== "5") {
    const dvsOptions = await commonStDevice(chgedVal, formValue, deviceTypeMap)
    formInst?.setFieldsValue({ deciveId: undefined, alarmId: undefined })
    return { deviceId: { options: dvsOptions } }
  }
  if (chgedKey === "modelId" && formValue?.shieldType === "5") {
    formInst?.setFieldsValue({ alarmId: undefined })
    const ruleOptions = await getRuleByModel(chgedVal)
    return { alarmId: { options: ruleOptions || [] } }
  }
  if (chgedKey === "deviceId") {
    formInst?.setFieldsValue({ alarmId: undefined })
    const params = {
      deviceTypeList: formValue?.deviceType,
      deviceIdList: formValue?.deviceId ? [formValue?.deviceId] : null,
      stationIdList: formValue?.stationId,
    }
    const res = await getAlarmShieldData({ pageSize: 10000, current: 1 }, params)
    const ruleList = res.records?.map((i) => {
      return {
        label: i.alarmId + "/" + i.alarmDesc,
        value: i.alarmId,
        name: i.alarmDesc,
      }
    })
    return { alarmId: { options: ruleList || [] } }
  }
  return {}
}

export const commonStDevice = async (chgedVal, formValue, deviceTypeMap) => {
  let schParams = {}
  if (!chgedVal) {
    schParams = { stationId: formValue.stationId }
  } else {
    schParams = { stationId: formValue.stationId, modelId: chgedVal || null }
  }
  const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
  const dvsOptions = deviceTrform(dvsList)
  return dvsOptions
}

const getRuleByModel = async (val) => {
  const params = {
    params: {
      pageNum: 1,
      pageSize: 10000,
      modelId: val,
    },
  }
  const result = await doRecordServer("queryMapByModel", params)
  if (validResErr(result)) return []
  const options = result?.list?.map((i) => {
    return {
      label: i.alarmId + "/" + i.alarmDesc,
      value: i.alarmId,
      name: i.alarmDesc,
    }
  })
  return options || []
}

export const addShieldForm = async (formData) => {
  const loginName = LOGIN_INFO_FOR_FUNS?.loginInfo?.loginName
  const { stationId, modelId, deviceId, alarmId } = formData
  const params = {
    modelId,
    stationId,
    deviceId,
    alarmId,
    enableFlag: "1",
    createBy: loginName,
    updateBy: loginName,
  }
  const res = await doBaseServer("addBlock", params)
  return validOperate(res)
}
