/*
 * @Author: chenmeifeng
 * @Date: 2024-04-08 10:17:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-27 17:14:09
 * @Description: 五防规则方法
 */
import { doBaseServer } from "@/api/serve-funs"
import { StorageDeviceSystem } from "@/configs/storage-cfg"
import { IDvsMeasurePointData } from "@/types/i-device"
import { getStorage, validOperate, validResErr } from "@/utils/util-funs"

import { IFiveRuleForm, IFiveRuleSchForm } from "../types"

// 查询五防
export const getRuleListInfo = async (data) => {
  const params = {
    pointName: data?.pointName,
    stationCode: data?.stationCode,
    deviceCode: data?.deviceCode,
  }
  const ruleList = await doBaseServer<IFiveRuleSchForm>("ruleSelect", params)
  if (validResErr(ruleList)) return []
  return ruleList || []
}

// 新增或修改五防
export const editFiveRule = async (type, data: IFiveRuleForm[]) => {
  const api = type === "add" ? "ruleSave" : "ruleUpdate"
  // const params = type === "add" ? { data: data } : data
  const result = await doBaseServer<IFiveRuleForm[]>(api, data)
  return validOperate(result)
}

// 删除规则
export const delFiveRule = async (ids) => {
  const result = await doBaseServer("ruleDelete", { ids })
  return result
}

// 规则校验
export const validFiveRule = async (data: IFiveRuleSchForm) => {
  const result = await doBaseServer<IFiveRuleSchForm>("ruleIsAllow", data)
  return result
}

export const commonDealRule = (type, data) => {
  const flag = data?.find((i) => i.controlType === type)?.ruleInfo
  if (!flag) return []
  const result =
    data
      ?.find((i) => i.controlType === type)
      ?.ruleInfo?.split(",")
      ?.map((j, idx) => {
        const [name, type] = j.split(":")
        return {
          id: idx,
          rulePoint: name,
          ruleType: parseInt(type),
        }
      }) || []
  return result
}
//CB2212sgd:1,CB2212xgd:0,CB2212xgd:0,CB2212xgd:0;cb2232:0;cb22123:1,cb2212sgd:0 转成
export const commonDealRuleDetail = (type, data) => {
  // const eee = [
  //   {
  //     controlType: 1,
  //     ruleInfo: "CB2212sgd:1,CB12xgd:0",
  //   },
  //   // {
  //   //   controlType: 0,
  //   //   ruleInfo: "CB678:1,CB29:0;cb232:0;cb22123:1,cb221sgd:0",
  //   // },
  // ]
  const ruleInfo = data?.find((i) => i.controlType === type)?.ruleInfo
  if (!ruleInfo)
    return {
      1: [],
    }
  const result = ruleInfo.split(";")?.reduce((prev, cur, index) => {
    const curList =
      cur.split(",")?.map((j, idx) => {
        const [name, ruleType] = j.split(":")
        return {
          id: idx,
          rulePoint: name,
          ruleType: parseInt(ruleType),
        }
      }) || []
    prev[index + 1] = curList // 使用数组下标+1作为属性名称
    return prev
  }, {})
  return result
}

// 按子系统-测点展示
export const getSysPiontList = (piontList: IDvsMeasurePointData[]) => {
  if (!piontList?.length) return []
  const sysList = getStorage(StorageDeviceSystem)
  const result = piontList?.reduce((prev, cur) => {
    const sysId = cur.systemId === null ? 999999 : cur.systemId
    const flag = prev.find((i) => i.value === sysId)
    const sysName = sysList.find((i) => i.id === sysId)?.name
    if (!flag) {
      prev.push({ title: sysName || "未知", value: sysId, disabled: true, children: [] })
    }
    const current = prev.find((i) => i.value === sysId)
    current.children.push({ title: cur.pointDesc, value: cur.pointName })
    return prev
  }, [])
  return result
}
