import { IDvsMeasurePointData } from "@/types/i-device"
import { createContext, Dispatch, SetStateAction } from "react"
import { IAreaQltData } from "../types"

export interface IAreaQualityContext {
  areaQualityCt?: IAreaQltData
  setAreaQualityCt?: Dispatch<SetStateAction<IAreaQualityContext["areaQualityCt"]>>
}

const AreaQualityContext = createContext<IAreaQualityContext>({
  areaQualityCt: {
    stationId: null,
    stationCode: "",
    chooseInfo: null,
    openDraw: false,
  },
  setAreaQualityCt: () => {},
})

export default AreaQualityContext
