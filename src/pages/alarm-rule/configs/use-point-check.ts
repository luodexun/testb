/*
 * @Author: chenmeifeng
 * @Date: 2024-08-29 17:29:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-10 16:29:50
 * @Description:
 */
import { IDvsMeasurePointData } from "@/types/i-device"
import { createContext, Dispatch, SetStateAction } from "react"
import { ICursorInfo } from "../types/form"
import { IBatchStn2DvsTreeData } from "../types"
import { IAlarmRuleLs } from "../types/table"

export interface IAreaElecContext {
  curCheckPoint: IDvsMeasurePointData
  serCurCheckPoint: Dispatch<SetStateAction<IAreaElecContext["curCheckPoint"]>>
  exitPointList?: Array<IDvsMeasurePointData>
  setExitPointList?: Dispatch<SetStateAction<IAreaElecContext["exitPointList"]>>
  cursorInfo?: ICursorInfo
  setCursorInfo?: Dispatch<SetStateAction<IAreaElecContext["cursorInfo"]>>
  chooseDeviceLs?: Array<IBatchStn2DvsTreeData>
  setChooseDeviceLs?: Dispatch<SetStateAction<IAreaElecContext["chooseDeviceLs"]>>
  curDevice?: IAlarmRuleLs
  setCurDevice?: Dispatch<SetStateAction<IAreaElecContext["curDevice"]>>
}

const PiontContext = createContext<IAreaElecContext>({
  curCheckPoint: null,
  exitPointList: [],
  cursorInfo: null,
  setExitPointList: () => {},
  serCurCheckPoint: () => {},
  setCursorInfo: () => {},
  chooseDeviceLs: [],
  setChooseDeviceLs: () => {},
  curDevice: null,
  setCurDevice: () => {},
})

export default PiontContext
