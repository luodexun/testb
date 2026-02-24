/*
 * @Author: chenmeifeng
 * @Date: 2024-02-05 11:05:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-02-05 11:32:49
 * @Description:
 */
import { atom } from "jotai"

import { StorageSvgAnalogSet } from "@/configs/storage-cfg"
import { IAnalogStInfo } from "@/pages/site-boost/components/reset-list"
import { setStorage } from "@/utils/util-funs"

export const analogInfoAtom = atom<IAnalogStInfo>({})
export const analogInfoSetAtom = atom(
  null,
  async (_, set, data: { analogInfo: IAnalogStInfo; call?: (isErr: boolean) => void }) => {
    const { analogInfo, call } = data
    const hasErr = true
    try {
      // const analogInfoStorage = getStorage(StorageSvgAnalogSet)

      setStorage(analogInfo, StorageSvgAnalogSet)

      set(analogInfoAtom, analogInfo)
    } catch (err: any) {
      // showMsg(err.data || "登录失败", "error")
    } finally {
      call?.(hasErr)
    }
  },
)
