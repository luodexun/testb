/*
 * @Author: xiongman
 * @Date: 2023-09-20 09:50:18
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-20 09:50:18
 * @Description:
 */

import { getStorage } from "@utils/util-funs.tsx"

import { TStorageInfo } from "@/types/i-api.ts"

// 设置样例数据
export function coverFakeData2ServeData<FD extends Record<string, any>, SD extends NonNullable<unknown>>(
  storageInfo: TStorageInfo,
  serveData: SD,
) {
  const localFakeData = getStorage<Partial<FD> & { fk: boolean }>(storageInfo)
  if (!localFakeData?.fk) return serveData
  const tempData = { ...(serveData || {}) } as SD
  // 使用样例数据
  Object.keys(localFakeData).forEach((field: string) => {
    if (!(field in tempData) || field === "fk") return
    tempData[field] = localFakeData[field]
  })
  return tempData
}
