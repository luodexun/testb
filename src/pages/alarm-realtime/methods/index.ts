import { doBaseServer, doNoParamServer } from "@/api/serve-funs"
import { AlarmSerForm } from "@/pages/alarm-history/types"
import { TDeviceType } from "@/types/i-config"
import { dealDownload4Response } from "@/utils/file-funs"
import { getAlarmLevelByType, validResErr } from "@/utils/util-funs"
import { AxiosResponse } from "axios"

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
  doBaseServer<AlarmSerForm, AxiosResponse>("exportRealTimeMsg", formData).then((data) => {
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
