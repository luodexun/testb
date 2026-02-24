/*
 * @Author: chenmeifeng
 * @Date: 2025-07-22 14:12:30
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-24 15:46:42
 * @Description:
 */
import { doBaseServer, doNoParamServer, doRecordServer } from "@/api/serve-funs"
import { StorageUserInfo } from "@/configs/storage-cfg"
import { AlarmSerForm } from "@/pages/alarm-history/types"
import { ILoginInfo } from "@/types/i-auth"
import { TDeviceType } from "@/types/i-config"
import { IPageInfo } from "@/types/i-table"
import { dealDownload4Response } from "@/utils/file-funs"
import { getAlarmLevelByType, getStorage, validOperate, validResErr } from "@/utils/util-funs"
import { AxiosResponse } from "axios"
import { AlarmListData } from "../config/types"

export const getRealAlarmCounts = async () => {
  const res = await doNoParamServer<any>("geAlarmCounts")
  if (validResErr(res)) return null
  return res
}
export function serialNumber(pageNum, pageSize, index) {
  return (pageNum - 1) * pageSize + index
}

// 执行数据导出
export function doExportRealtime(formData: AlarmSerForm) {
  doBaseServer<AlarmSerForm, AxiosResponse>("exportFoldMsg", formData).then((data) => {
    dealDownload4Response(data, "实时告警日志导出表")
  })
}

// 详情执行数据导出
export function doExportDtRealtime(formData) {
  const data = dealParams(formData)
  doBaseServer<AlarmSerForm, AxiosResponse>("exportExpandMsg", data).then((data) => {
    dealDownload4Response(data, "实时告警日志导出表")
  })
}

export const getAlarmLevelByDvsTypes = (deviceTypes: TDeviceType[]) => {
  const syzzz = [
    { dataIndex: "11", name: "事故", num: 0, code: "11" },
    { dataIndex: "12", name: "异常", num: 0, code: "12" },
    { dataIndex: "13", name: "越限", num: 0, code: "13" },
    { dataIndex: "14", name: "变位", num: 0, code: "14" },
  ]
  const wt = [
    { dataIndex: "1", name: "故障", num: 0, code: "1" },
    { dataIndex: "2", name: "告警", num: 0, code: "2" },
  ]
  if ((deviceTypes.length > 1 && deviceTypes.includes("SYZZZ")) || !deviceTypes.length) {
    return wt.concat(syzzz)
  } else if (deviceTypes.length === 1 && deviceTypes.includes("SYZZZ")) {
    return syzzz
  } else if ((deviceTypes.length === 1 || deviceTypes.length > 1) && !deviceTypes.includes("SYZZZ")) {
    return wt
  }
  return wt.concat(syzzz)
}
const dealParams = (formData) => {
  return {
    startTime: new Date(formData.startTime)?.getTime(),
    endTime: new Date(formData.lastStartTime)?.getTime(),
    deviceIdList: [formData.deviceId],
    alarmIdList: [formData.alarmId],
  }
}
// 执行详情数据查询
export async function getAlarmDtPageData(pageInfo: IPageInfo, formData) {
  const data = dealParams(formData)
  const params = {
    data: data,
    params: {
      pageNum: pageInfo?.current,
      pageSize: pageInfo?.pageSize,
    },
  }
  const res = await doRecordServer("queryExpandMsg", params)
  if (validResErr(res)) return null

  return { records: res.list || [], total: res.total }
}
export async function bacthPass(selectedRows, confirmMsg?) {
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
  const params = selectedRows.map((i) => {
    return {
      startTime: i.startTime,
      deviceId: i.deviceId,
      alarmId: i.alarmId, //告警信息id，参考查询接口返回结果d
      lastStartTime: i.lastStartTime,
      confirmBy: userInfoLocal?.realName || "",
      confirmMsg: confirmMsg || "",
    }
  })
  const res = await doBaseServer<AlarmListData[]>("flodBatchConfirm", params)
  return validOperate(res)
}
