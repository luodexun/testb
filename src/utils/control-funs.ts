/*
 * @Author: xiongman
 * @Date: 2023-10-20 14:18:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 10:53:41
 * @Description:
 */

import { getFormData } from "@utils/file-funs.tsx"
import { isEmpty, validOperate, validResErr } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"
import {
  IControlActExecuteParams,
  IControlParamMap,
  IDualPsdSafeLoginParams,
} from "@/components/device-control/types.ts"

export async function validControlOperateAuth(authParamMap: IControlParamMap) {
  const { authVerify, executeInfo } = authParamMap
  if (isEmpty(authVerify) || isEmpty(executeInfo)) return false
  executeInfo.operatorBy = authVerify.name1
  executeInfo.authorizerBy = authVerify.name2
  const params: IDualPsdSafeLoginParams = { ...authVerify, service: "control" }
  const fd = getFormData(params)
  const resData = await doBaseServer<FormData>("dualPsdSafeLogin", fd)
  if (validResErr(resData)) return resData
  const exeFields = ["deviceIds", "pointName", "controlType", "operatorBy", "authorizerBy", "targetValue", "interval"]
  const exeParams: IControlActExecuteParams = exeFields.reduce((prev, field) => {
    prev[field] = executeInfo[field]
    return prev
  }, {} as IControlActExecuteParams)
  const exeResData = await doBaseServer<IControlActExecuteParams>("fetchControlAction", exeParams)

  return exeResData
}
export async function validSingellControlOperateAuth(authParamMap: IControlParamMap) {
  const { authVerify, executeInfo } = authParamMap
  if (isEmpty(authVerify) || isEmpty(executeInfo)) return false
  executeInfo.operatorBy = authVerify.name1
  executeInfo.authorizerBy = authVerify.name1
  const params: IDualPsdSafeLoginParams = {
    service: "control",
    name: authVerify.name1,
    pwd: authVerify.pwd1,
  }
  const fd = getFormData(params)
  const resData = await doBaseServer<FormData>("singlePasswordSafeLogin", fd)
  if (validResErr(resData)) return resData
  const exeFields = ["deviceIds", "pointName", "controlType", "operatorBy", "authorizerBy", "targetValue", "interval"]
  const exeParams: IControlActExecuteParams = exeFields.reduce((prev, field) => {
    prev[field] = executeInfo[field]
    return prev
  }, {} as IControlActExecuteParams)
  const exeResData = await doBaseServer<IControlActExecuteParams>("fetchControlAction", exeParams)

  return exeResData
}
