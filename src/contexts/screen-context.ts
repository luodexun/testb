import { createContext, Dispatch, SetStateAction } from "react"

export interface IScreencContext {
  quotaInfo?: any
  setQuotaInfo?: Dispatch<SetStateAction<IScreencContext["quotaInfo"]>>
  openupdateMenu?: boolean
  setOpenupdateMenu?: Dispatch<SetStateAction<IScreencContext["openupdateMenu"]>>
}

const LargeScreenContext = createContext<IScreencContext>({
  quotaInfo: {}, // 指标数据
  setQuotaInfo: () => {},
  openupdateMenu: false,
})

export default LargeScreenContext
