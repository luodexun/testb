/*
 * @Author: chenmeifeng
 * @Date: 2024-08-26 10:07:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-26 17:19:53
 * @Description:
 */
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { IQueryRpDvsParams, IRpDvsAll, IRpDvsList, IRpDvsParams, TRpDvsFormField } from "../types"
import { deviceTrform, getStorage, isEmpty, showMsg, validResErr } from "@/utils/util-funs"
import { IStnDvsType4LocalStorage } from "@/types/i-device"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { CONTROL_DEFAULT_TYPE, CONTROL_OPTION } from "../configs"
import { queryDevicesByParams } from "@/utils/device-funs"
import { doBaseServer } from "@/api/serve-funs"
import { IPageInfo } from "@/types/i-table"
import { AxiosResponse } from "axios"
import { dealDownload4Response } from "@/utils/file-funs"
import { getStartAndEndTime } from "@/utils/form-funs"

// 执行数据查询
export async function getReportDevSchData(pageInfo: IPageInfo, formData: IQueryRpDvsParams) {
  if (!formData?.deviceType) {
    showMsg("请选择设备类型")
    return
  }
  const params = dealParams(formData, formData?.stationList)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize

  const res = await doBaseServer<IRpDvsParams, IRpDvsAll>("getDeviceProductionData", params)
  if (validResErr(res)) return null
  const actualData = res?.list.map((i, idx) => {
    return {
      ...i,
      id: i.deviceCode + i.endTime + i.startTime + idx,
      // production: formData?.deviceType === "WT" ? i.dailyProduction : (i.dailyCharge || 0) + (i.dailyDischarge || 0),
    }
  })
  return { records: actualData || [], total: res?.total }
}
export async function onReportDvsSchFormChg(
  changedValue: IQueryRpDvsParams,
  formInst: IFormInst,
  deviceTypeMap,
): Promise<TFormItemConfig<TRpDvsFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey)) return {}
  console.log(chgedKey, "chgedKey")

  const theFormInst = formInst?.getInst()
  if (chgedKey === "stationId" && chgedVal) {
    const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
    const items = deviceTypesOfSt.find((e) => e.stationId == chgedVal)
    const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal)
    theFormInst?.setFieldsValue({
      deviceCode: [],
      deviceType: null,
    })
    return { deviceType: { options: deviceTypeOptions }, deviceCode: { options: [] } }
  } else if (chgedKey === "stationId" && !chgedVal) {
    theFormInst?.setFieldsValue({
      deviceCode: [],
      deviceType: null,
    })
    return { deviceType: { options: CONTROL_OPTION }, deviceCode: { options: [] } }
  }
  if (chgedKey == "deviceType") {
    const data = theFormInst?.getFieldsValue()
    const schParams = { stationId: data.stationId, deviceType: chgedVal }
    const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
    const dvsOptions = deviceTrform(dvsList, "deviceCode")
    theFormInst?.setFieldsValue({
      deviceCode: [],
    })
    return { deviceCode: { options: dvsOptions } }
  }
  return {}
}

const getIntersection = (data = [], stationIds) => {
  if (!data.length) return []
  const newData = data
    .filter((item) => Object.prototype.hasOwnProperty.call(CONTROL_DEFAULT_TYPE, item))
    .map((item) => ({
      label: CONTROL_DEFAULT_TYPE[item],
      value: item,
      stationIds,
    }))

  return newData
}
// 执行数据导出
export function reportDvsExport(formData: IQueryRpDvsParams, stationList) {
  const params = dealParams(formData, stationList)
  doBaseServer<typeof params, AxiosResponse>("exportDeviceProductionData", params).then((data) => {
    dealDownload4Response(data, "单机发电量.xlsx")
  })
}

// 处理查询及导出参数
function dealParams(formData: IQueryRpDvsParams, stationLists): IRpDvsParams {
  const { dateRange, stationId, stationList, deviceCode, ...others } = formData
  const stationCodes = stationLists?.find((i) => i.id === formData.stationId)?.stationCode || ""
  const dvsCode = deviceCode?.join(",")
  return { ...others, deviceCode: dvsCode, stationCode: stationCodes, ...getStartAndEndTime(dateRange, "", null, true) }
}
