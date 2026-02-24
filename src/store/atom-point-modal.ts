/*
 * @Author: chenmeifeng
 * @Date: 2024-06-17 16:10:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-17 18:19:24
 * @Description: 测点集合
 */
import { atom } from "jotai"

import { IDvsRunStateInfo } from "@/configs/dvs-state-info"
interface IPointLsInfo {
  pointInfo?: IDvsRunStateInfo[]
  open?: boolean
}
export const pointInfoAtom = atom<IPointLsInfo>({ pointInfo: [], open: false })
export const pointInfoSetAtom = atom(
  (get) => get(pointInfoAtom),
  async (get, set, data: { pointInfo: IDvsRunStateInfo; open?: boolean; call?: (isErr: boolean) => void }) => {
    const { pointInfo, call, open } = data
    const hasErr = true
    try {
      // setStorage(analogInfo, StorageSvgAnalogSet)
      if (!open) {
        set(pointInfoAtom, { pointInfo: [], open: false })
        return
      }
      if (!pointInfo && open) {
        set(pointInfoAtom, { pointInfo: [], open: true })
        return
      }
      const allPoint = get(pointInfoAtom)?.pointInfo
      const isExist = allPoint?.find((i) => i.subField === pointInfo?.subField)
      if (!isExist) allPoint?.push(pointInfo)

      set(pointInfoAtom, { pointInfo: [...allPoint], open: true })
    } catch (err: any) {
      // showMsg(err.data || "登录失败", "error")
    } finally {
      call?.(hasErr)
    }
  },
)
