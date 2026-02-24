/*
 * @Author: chenmeifeng
 * @Date: 2025-04-15 16:55:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-21 10:21:45
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { ITemplateData, ITemplateForm } from "../types/template"
import { uDate, vDate, validOperate, validResErr } from "@/utils/util-funs"

export const getTplt = async () => {
  const params = {
    type: "analasys",
  }
  const resData = await doBaseServer<any, ITemplateData[]>("getTemplate", params)
  if (validResErr(resData)) return false
  return resData.map((i, idx) => {
    return {
      ...i,
      index: idx + 1,
      data: JSON.parse(JSON.parse(i.data)),
    }
  })
}

export const saveTplt = async (data = {}, name, sharedFlag) => {
  const params = {
    name: "模版-" + name,
    data: JSON.stringify(data),
    type: "analasys",
    sharedFlag,
  }
  const resData = await doBaseServer<ITemplateForm>("addTemplate", params)
  console.log(resData, "监考老师都分开了")
}

export const dltTplt = async (ids) => {
  const params = {
    id: ids,
  }
  const resData = await doBaseServer("deleteTemplate", params)
  return validOperate(resData)
}
