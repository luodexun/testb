/*
 * @Author: chenmeifeng
 * @Date: 2024-04-08 10:12:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-14 13:53:05
 * @Description: 五防规则
 */
import { IApiMapItem } from "@/types/i-api.ts"
// const LY_SERVE_NAME = "/third/defenses/rule"
const SERVE_NAME = process.env.VITE_FIVE_COMPANY === "1" ? "/third/defenses/rule" : "/defenses/rule"

export const ruleApi: IApiMapItem = {
  ruleSelect: {
    url: `${SERVE_NAME}/select`,
    method: "post",
    // baseURL: `/rule`,
    desc: "五防规则-查询",
  },
  ruleSave: {
    url: `${SERVE_NAME}/save`,
    // baseURL: `/rule`,
    method: "post",
    desc: "五防规则-新增",
  },
  ruleUpdate: {
    url: `${SERVE_NAME}/update`,
    // baseURL: `/rule`,
    method: "post",
    desc: "五防规则-修改",
  },
  ruleIsAllow: {
    url: `${SERVE_NAME}/isAllow`,
    // baseURL: `/rule`,
    method: "post",
    desc: "五防规则-规则校验",
  },
  ruleDelete: {
    url: `${SERVE_NAME}/delete`,
    // baseURL: `/rule`,
    method: "post",
    desc: "五防规则-删除",
  },
}
