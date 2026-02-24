/*
 * @Author: chenmeifeng
 * @Date: 2024-07-08 15:54:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-23 14:43:28
 * @Description:
 */
import { atom } from "jotai"

export const mainComAtom = atom<any>({})
export const mainComSetAtom = atom(
  null,
  async (_, set, data: { mainComInfo: any; call?: (isErr: boolean) => void }) => {
    const { mainComInfo, call } = data
    const hasErr = true
    try {
      set(mainComAtom, mainComInfo)
    } catch (err: any) {
      // showMsg(err.data || "登录失败", "error")
    } finally {
      call?.(hasErr)
    }
  },
)
