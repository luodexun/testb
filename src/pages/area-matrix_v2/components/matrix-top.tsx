import "./matrix-top.less"
import { TDeviceType } from "@/types/i-config"
import { useContext, useRef, useState } from "react"
import MatrixState from "./state"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { IDeviceData } from "@/types/i-device"
import SelectWithAll from "@/components/select-with-all"
import { getSortSelectOpts } from "@/utils/util-funs"
interface Option {
  key: TDeviceType
  label: string
  closable: boolean
}
const areaOvwTabs: Option[] = [
  { key: "WT", label: "风", closable: false },
  { key: "PVINV", label: "光", closable: false },
  { key: "ESPCS", label: "储", closable: false },
]
interface IProps {
  realtimeDvsData: IDeviceData[]
}
export default function MatrixTop(props: IProps) {
  const { realtimeDvsData } = props
  const tabsList = useRef(areaOvwTabs)
  const [layout, setLayout] = useState("site")
  const { deviceType, setDeviceType, setCurrentLayout } = useContext(DvsDetailContext)

  const onTabsChgRef = useRef((key: TDeviceType) => {
    setDeviceType(key)
  })
  const changeLayout = (e) => {
    setLayout(e)
    setCurrentLayout(e)
  }
  return (
    <div className="matrix-wrap-top">
      <div className="matrix-top-type">
        {tabsList.current?.map((i) => {
          return (
            <div
              key={i.key}
              onClick={onTabsChgRef.current.bind(null, i.key)}
              className={`ov-top-item ${deviceType === i.key ? "active-i" : ""}`}
            >
              {i.label}
            </div>
          )
        })}
      </div>
      <div className="matrix-top-right">
        <MatrixState realtimeDvsData={realtimeDvsData} />
        <SelectWithAll
          size="small"
          value={layout}
          options={getSortSelectOpts()}
          onChange={changeLayout}
          placeholder="场站排列"
        />
      </div>
    </div>
  )
}
