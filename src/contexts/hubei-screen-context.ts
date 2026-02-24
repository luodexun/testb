import { createContext, Dispatch, SetStateAction } from "react"

import { IGroupType } from "@/pages/hubei-screen/types"
// REGION_COM_ID 区域
// PROJECT_COM_ID 项目公司
// MAINTENANCE_COM_ID 检修公司
// STATION_CODE 场站
export interface IHbScreencContext {
  quotaInfo?: any
  setQuotaInfo?: Dispatch<SetStateAction<IHbScreencContext["quotaInfo"]>>
  currentMode?: IGroupType
  setCurrentMode?: Dispatch<SetStateAction<IHbScreencContext["currentMode"]>>
  // bianAlarmList?: AlarmListData[]
  // setBianAlarmList?: Dispatch<SetStateAction<IHbScreencContext["bianAlarmList"]>>
}

const HbScreenContext = createContext<IHbScreencContext>({
  quotaInfo: {}, // 指标数据
  setQuotaInfo: () => {},
  currentMode: "REGION_COM_ID",
  setCurrentMode: () => {},
})

export default HbScreenContext
