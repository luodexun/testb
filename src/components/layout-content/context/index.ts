/*
 * @Author: xiongman
 * @Date: 2023-09-05 12:17:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-01 11:22:26
 * @Description:
 */

import { createContext, Dispatch, SetStateAction } from "react"

import { ITreeMenuItem } from "@/router/interface"

interface IMenuContext {
  menuList?: ITreeMenuItem[]
  checkedMenu?: string[]
  setCheckedMenu?: Dispatch<SetStateAction<string[]>>
  shieldRemindTime?: number
  setShieldRemindTime?: Dispatch<SetStateAction<IMenuContext["shieldRemindTime"]>>
}
const TreeMenuContext = createContext<IMenuContext>({ menuList: [] })

export default TreeMenuContext
