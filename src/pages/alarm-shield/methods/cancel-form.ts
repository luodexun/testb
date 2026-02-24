/*
 * @Author: chenmeifeng
 * @Date: 2024-03-06 15:40:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-07 16:20:59
 * @Description:
 */
import { doBaseServer, doRecordServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { getStAllDeviceModel } from "@/pages/setting-point-sys/methods"
import { IPageInfo } from "@/types/i-table"
import { queryDevicesByParams } from "@/utils/device-funs"
import { deviceTrform, showMsg, validOperate, validResErr } from "@/utils/util-funs"

import { IAlarmShieldData } from "../types"
import { IQueryCcShieldParams, TCcShieldForm, TCcShieldSchFmItemName } from "../types/cancel-form"

export const getAllShieldData = async (pageInfo: IPageInfo, formData: TCcShieldForm) => {
  const params = {
    params: {
      pageNum: pageInfo?.current,
      pageSize: pageInfo?.pageSize,
    },

    data: {
      ...formData,
    },
  }

  const res = await doRecordServer<IQueryCcShieldParams, IAlarmShieldData>("queryBlockMsg", params)
  if (validResErr(res)) return { records: [], total: 0 }
  // const result = res?.list.map(i =>)
  return { records: res?.list || [], total: res?.total || 0 }
}

export const onCcFormChange = async (
  changedValue: TCcShieldForm,
  formRef: IFormInst,
  deviceTypeMap: Record<string, string>,
): Promise<TFormItemConfig<TCcShieldSchFmItemName> | null> => {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "modelId"].includes(chgedKey)) return {}
  // if (!["stationId", "deviceType"].includes(field)) return {}
  const formInst = formRef?.getInst()
  const formValue: TCcShieldForm = formInst.getFieldsValue()
  if (chgedKey === "stationId") {
    formInst?.setFieldsValue({ deciveId: undefined, modelId: undefined })
    const oneTypeModelList = await getStAllDeviceModel(parseInt(chgedVal))
    const dvsOptions = await commonStModelDevice(null, formValue, deviceTypeMap)
    return { deviceId: { options: dvsOptions }, modelId: { options: oneTypeModelList } }
  }
  if (chgedKey === "modelId") {
    formInst?.setFieldsValue({ deciveId: undefined })
    const dvsOptions = await commonStModelDevice(chgedVal, formValue, deviceTypeMap)
    return { deviceId: { options: dvsOptions } }
  }
  return {}
}

const commonStModelDevice = async (chgedVal, formValue, deviceTypeMap) => {
  let schParams = {}
  if (!chgedVal) {
    schParams = { stationId: formValue.stationId }
  } else {
    schParams = { stationId: formValue.stationId, modelId: formValue.modelId }
  }
  const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
  const dvsOptions = deviceTrform(dvsList)
  return dvsOptions
}

// 批量确认
export async function cancelShield(selectedRows) {
  if (!selectedRows?.length) {
    showMsg("请选择一条数据")
    return false
  }
  const selectInfo = selectedRows?.[0] || {}
  const hasValKeyInfo = Object.keys(selectInfo).reduce((prev, cur) => {
    if (selectInfo[cur]) prev[cur] = selectInfo[cur]
    return prev
  }, {})
  const { stationId, modelId, deviceId, alarmId } = hasValKeyInfo as TCcShieldForm
  const params = {
    stationId,
    modelId,
    deviceId,
    alarmId,
  }
  const res = await doBaseServer("deleteBlock", params)
  return validOperate(res)
}
