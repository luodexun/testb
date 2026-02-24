/*
 * @Author: chenmeifeng
 * @Date: 2024-03-05 14:16:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-18 17:12:07
 * @Description:
 */
import { AxiosResponse } from "axios"

import { doBaseServer, doRecordServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { getStn2DvsTypeInfoMap } from "@/pages/control-log/methods"
import { IPageInfo } from "@/types/i-table"
import { queryDevicesByParams } from "@/utils/device-funs"
import { dealDownload4Response } from "@/utils/file-funs"
import { deviceTrform, showMsg, validResErr } from "@/utils/util-funs"

import {
  IAlarmRuleParams,
  IAlarmShieldData,
  IAlarmShieldParam,
  IQueryShieldParams,
  TAlarmShieldSchFmItemName,
} from "../types"

export const getAlarmShieldData = async (pageInfo: IPageInfo, formData: IAlarmShieldParam) => {
  const params = {
    data: dealParams(formData),
    params: {
      pageNum: pageInfo?.current,
      pageSize: pageInfo?.pageSize,
    },
  }
  // return {
  //   records: [
  //     {
  //       modelId: 1,
  //       alarmId: "2",
  //       alarmDesc: "原因1",
  //       systemId: 1,
  //       systemName: "系统1",
  //       brakeLevelId: 2,
  //       brakeLevelName: "的风格风格l",
  //       alarmLevelId: 10,
  //       resetLevel: "远程复位",
  //       resetNum: 5,
  //     },
  //     {
  //       modelId: 1,
  //       alarmId: "3",
  //       alarmDesc: "原因2",
  //       systemId: 2,
  //       systemName: "系统2",
  //       brakeLevelId: 2,
  //       brakeLevelName: "的风格风格l",
  //       alarmLevelId: 10,
  //       resetLevel: "远程复位",
  //       resetNum: 5,
  //     },
  //   ],
  //   total: 2,
  // }
  const res = await doRecordServer<IQueryShieldParams, IAlarmShieldData>("alarmBlockRule", params)
  if (validResErr(res)) return { records: [], total: 0 }
  const actRes = res?.list?.map(i => {
    return {
      ...i,
      virtualId: i.alarmId + "-" + i.modelId,
    }
  })
  return { records: actRes || [], total: res?.total || 0 }
}

const dealParams = (formData: IAlarmShieldParam) => {
  return {
    deviceTypeList: formData?.deviceTypeList ? [formData?.deviceTypeList] : null,
    deviceIdList: formData?.deviceIdList,
    stationIdList: formData?.stationIdList ? [formData?.stationIdList] : null,
  }
}

// 执行数据导出
export function doExportReportPower(formData) {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("alarmExportRule", params).then((data) => {
    dealDownload4Response(data, "告警配置.xlsx")
  })
}
export const onAlarmShSchFormChange = async (
  changedValue: IAlarmShieldParam,
  formRef: IFormInst,
  dvsTypeInfoOfStnMap: ReturnType<typeof getStn2DvsTypeInfoMap>,
  deviceTypeMap: Record<string, string>,
): Promise<TFormItemConfig<TAlarmShieldSchFmItemName> | null> => {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationIdList", "deviceTypeList"].includes(chgedKey)) return {}
  // if (!["stationId", "deviceType"].includes(field)) return {}
  const formInst = formRef?.getInst()
  formInst?.setFieldValue("deviceIdList", [])
  const formValue: IAlarmShieldParam = formInst.getFieldsValue()
  if (chgedKey === "stationIdList") {
    const dvsTypeOptionsOfStn = dvsTypeInfoOfStnMap[chgedVal]
    const dvsOptions = await commonDealDevice(null, formValue, deviceTypeMap)
    formInst?.setFieldsValue({ deviceTypeList: undefined })
    return { deviceTypeList: { options: dvsTypeOptionsOfStn }, deviceIdList: { options: dvsOptions } }
  }
  if (chgedKey === "deviceTypeList") {
    const dvsOptions = await commonDealDevice(chgedVal, formValue, deviceTypeMap)
    return { deviceIdList: { options: dvsOptions } }
  }
  return {}
}
const commonDealDevice = async (chgedVal, formValue, deviceTypeMap) => {
  let schParams = {}
  if (!chgedVal) {
    schParams = { stationId: formValue.stationIdList }
  } else {
    schParams = { stationId: formValue.stationIdList, deviceType: chgedVal || null }
  }
  const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
  const dvsOptions = deviceTrform(dvsList)
  return dvsOptions
}

export const saveRule = async (records: IAlarmShieldData[]) => {
  const result = records?.map(({ modelId, alarmId, alarmDesc, systemId, brakeLevelId, alarmLevelId, resetLevel, resetNum }) => {
    return { modelId, alarmId, alarmDesc, systemId, brakeLevelId, alarmLevelId, resetLevel, resetNum }
  })
  const res = await doBaseServer<IAlarmRuleParams[]>("alarmUpdateMap", result)
  if (validResErr(res)) {
    showMsg("操作失败")
  } else {
    showMsg("操作成功")
  }
  return validResErr(res)
}

export const setDescColor = (isSearch) => {
  if (isSearch) {
    return "var(--fault)"
  }
  return "var(--deep-font-color)"
}
