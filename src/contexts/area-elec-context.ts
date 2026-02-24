/*
 * @Author: chenmeifeng
 * @Date: 2024-03-19 11:21:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-07 11:10:57
 * @Description: 状态总览-父子传值
 */
import { createContext, Dispatch, SetStateAction } from "react"

import { AlarmListData } from "@/pages/alarm-history/types"
import { IEleOverviewInfo } from "@/pages/area-elec/types"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info"

export interface IAreaElecContext {
  isHideMode?: boolean
  setIsHideMode?: Dispatch<SetStateAction<IAreaElecContext["isHideMode"]>>
  bianAlarmList?: AlarmListData[]
  setBianAlarmList?: Dispatch<SetStateAction<IAreaElecContext["bianAlarmList"]>>
  currentPiontInfo?: IEleOverviewInfo
  setCurrentPiontInfo?: Dispatch<SetStateAction<IAreaElecContext["currentPiontInfo"]>>
  dvsSignRecords?: IDvsSignalRecordInfo[]
  setDvsSignRecords?: Dispatch<SetStateAction<IAreaElecContext["dvsSignRecords"]>>
  isclick?: boolean
  setIsClick?: Dispatch<SetStateAction<IAreaElecContext["isclick"]>>
}

const AreaElecContext = createContext<IAreaElecContext>({
  isHideMode: false, // 是否显示“备”数据
  setIsHideMode: () => {},
  bianAlarmList: [],
  setBianAlarmList: () => {},
  currentPiontInfo: null,
  setCurrentPiontInfo: () => {},
  dvsSignRecords: [],
})

export default AreaElecContext
