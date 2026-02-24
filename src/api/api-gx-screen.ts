/*
 * @Author: chenmeifeng
 * @Date: 2024-03-13 10:32:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-23 10:26:07
 * @Description: 广西大屏接口
 */
import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/devicemng"

export const gxScnApiMap: IApiMapItem = {
  queryMngStatic: {
    url: `${SERVE_NAME}/screenDisplay/queryMngStatic`,
    method: "get",
    desc: "查询",
    repeat_request: true,
  },
  updateMngStatic: {
    url: `${SERVE_NAME}/screenDisplay/updateMngStatic`,
    method: "post",
    desc: "修改",
  },
}
