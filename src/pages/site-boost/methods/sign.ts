/*
 * @Author: chenmeifeng
 * @Date: 2025-05-27 10:20:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-27 14:07:03
 * @Description: 挂牌方法
 */
import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

import { ISignLogData, ISignLogSchParams } from "../components/control-sign-log/types"

export async function getSignRecords(data) {
  const resData = await doBaseServer<ISignLogSchParams, ISignLogData[]>("getSyzzzDeviceSignRecord", data)
  if (validResErr(resData)) return []
  const test = [
    {
      id: 1,
      deviceId: 12,
      deviceName: "df",
      signState: "01",
      datasource: "shd",
      remark: "第三方",
      createBy: "s",
      createTime: 1,
      endBy: "sdf",
      endTime: 2,
      lineCode: 1,
      signStateCode: "01",
      signDesc: "定检",
    },
    {
      id: 2,
      deviceId: 12,
      deviceName: "df",
      signState: "01",
      datasource: "shd",
      remark: "第三方",
      createBy: "s",
      createTime: 1,
      endBy: "sdf",
      endTime: 2,
      lineCode: 2,
      signStateCode: "01",
      signDesc: "定检",
    },
    {
      id: 3,
      deviceId: 12,
      deviceName: "df",
      signState: "02",
      datasource: "shd",
      remark: "第三方",
      createBy: "s",
      createTime: 1,
      endBy: "sdf",
      endTime: 2,
      lineCode: 1,
      signStateCode: "02",
      signDesc: "巡检",
    },
  ]
  const signMap = resData?.reduce((prev, cur) => {
    if (!prev[cur.lineCode]) {
      prev[cur.lineCode] = []
    }
    prev[cur.lineCode].push(cur)
    return prev
  }, {})
  return signMap
}
