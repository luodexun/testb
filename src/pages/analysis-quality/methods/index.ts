/*
 * @Author: chenmeifeng
 * @Date: 2023-11-10 16:30:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-14 16:30:46
 * @Description:
 */

import { calcRate } from "@utils/device-funs.ts"
import { AxiosResponse } from "axios"

import { doBaseServer } from "@/api/serve-funs"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { StorageStationData, StorageStnDvsType } from "@/configs/storage-cfg"
import { TOptions } from "@/types/i-antd"
import { TDeviceType } from "@/types/i-config.ts"
import { IStnDvsType4LocalStorage } from "@/types/i-device.ts"
import { IAtomStation } from "@/types/i-station.ts"
import { IPageInfo } from "@/types/i-table.ts"
import { dealDownload4Response } from "@/utils/file-funs"
import { getStorage, isEmpty, parseNum, validResErr } from "@/utils/util-funs"
import { getStartAndEndTime } from "@utils/form-funs.ts"

import { CONTROL_DEFAULT_TYPE } from "../configs"
import { IAnlsQueData, IAnlsQueSchForm, TAnlsQueFormField } from "../types"

export async function getReportPowerSchData(_: IPageInfo, formData: IAnlsQueSchForm) {
  const params = dealParams(formData)
  const records = await doBaseServer<IAnlsQueSchForm, IAnlsQueData[]>("getReceptionQualityData", params)
  if (validResErr(records)) return null
  const { stationOptions } = getStorage<IAtomStation>(StorageStationData) || { stationOptions: [] }
  records.forEach((item, index) => {
    item.id = index + item.Time
    item.stationName = stationOptions?.find((station) => station.value === item.stationCode)?.label || item.stationCode
  })

  return { records, total: records.length }
}
export const getAllCardInfo = (data: IAnlsQueData[]) => {
  if (!data.length) return
  const receivedDataCount = data.map((i) => i.receivedDataCount).reduce((prev, cur) => prev + cur)
  const expectedDataCount = data.map((i) => i.expectedDataCount).reduce((prev, cur) => prev + cur)
  return {
    receivedDataCount: parseNum(receivedDataCount),
    expectedDataCount: parseNum(expectedDataCount),
    rate: calcRate(receivedDataCount, expectedDataCount),
  }
}
export const exportAnlsLs = (formData: IAnlsQueSchForm) => {
  const params = dealParams(formData)
  doBaseServer<typeof params, AxiosResponse>("exportReceptionQualityData", params).then((data) => {
    dealDownload4Response(data, "数据质量导出表.xlsx")
  })
}
// 处理查询及导出参数
function dealParams(formData: IAnlsQueSchForm) {
  const { dateRange, stationCode, deviceType } = formData
  // const [start, end] = dateRange || []
  return {
    stationCode: stationCode,
    deviceType: deviceType,
    // startTime: start ? start.valueOf() : undefined,
    // endTime: end ? end.valueOf() : undefined,
    ...getStartAndEndTime<number>(dateRange, "", { startTime: 1, endTime: 100000000000000 })
  }
}
// 监听场站选择变化查询模型数据
export async function onCfgWeatheSchFormChange(
  changedValue: IAnlsQueSchForm,
  formInst: IFormInst,
): Promise<TFormItemConfig<TAnlsQueFormField>> {
  const [chgedKey, chgedVal] = (Object.entries(changedValue || {})?.[0] || []) as ["stationCode", string]
  if (!["stationCode"].includes(chgedKey) || isEmpty(chgedVal)) return {}

  const theFormInst = formInst?.getInst()
  const { stationList } = getStorage<IAtomStation>(StorageStationData) || { stationList: [] }
  const stationId = stationList.find((i) => i.stationCode === chgedVal)?.id
  const items =
    getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)?.find((e) => e.stationId === stationId) ||
    ({} as IStnDvsType4LocalStorage)

  const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal)
  const theFirst: TOptions<string>[0] = deviceTypeOptions?.[0]
  theFormInst?.setFieldsValue({ deviceType: theFirst ? [theFirst.value] : [] })
  return { deviceType: { options: deviceTypeOptions || [] } }
}

const getIntersection = (data: TDeviceType[], stationIds: string) => {
  if (!data.length) return
  return data
    .filter((item) => Object.prototype.hasOwnProperty.call(CONTROL_DEFAULT_TYPE, item))
    .map((item) => ({
      label: CONTROL_DEFAULT_TYPE[item],
      value: item,
      stationIds,
    }))
}
