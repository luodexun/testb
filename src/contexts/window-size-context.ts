/*
 * @Author: xiongman
 * @Date: 2022-11-09 17:50:02
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-09 17:50:02
 * @Description: 页面尺寸变化控制上下文对象
 */

import { createContext, Dispatch, SetStateAction } from "react"

interface IWinSizeContext {
  needResize: boolean
  setNeedResize: Dispatch<SetStateAction<boolean>>
}

const WindowSizeContext = createContext<IWinSizeContext>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNeedResize(value: ((prevState: boolean) => boolean) | boolean): void {},
  needResize: false,
})

export default WindowSizeContext
