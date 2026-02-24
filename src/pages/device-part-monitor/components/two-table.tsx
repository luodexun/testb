/*
 * @Author: chenmeifeng
 * @Date: 2024-01-25 14:26:22
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-17 18:37:12
 * @Description:
 */
import "./two-table.less"

import { useSetAtom } from "jotai"
import { useContext, useRef, useState } from "react"

import MetricTag from "@/components/metric-tag"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import AttrTrendModal from "@/pages/device-run-detail/components/attr-trend-modal"
import { pointInfoSetAtom } from "@/store/atom-point-modal"

import { IDvsSystemTelemetryTableData } from "../types"
interface IProps {
  data: IDvsSystemTelemetryTableData[]
}
export default function VirtualTable(props: IProps) {
  const { data } = props
  const [canOpen, setCanOpen] = useState(false)
  const [currentInfo, setCurrentInfo] = useState({})

  const setPiontList = useSetAtom(pointInfoSetAtom)
  // const { device } = useContext(DvsDetailContext)
  const openDialog = useRef((info) => {

    const cur = {
      ...info,
      subField: info["pointName"],
    }
    setPiontList({
      open: true,
      pointInfo: cur,
    })
    setCanOpen(true)
    setCurrentInfo(cur)
  })
  const setCallBackModal = useRef((value) => {
    setCanOpen(value)
  })
  return (
    <div className="l-full vtable">
      <div className="vtable-title vtable-con">
        <div className="vtable-con-list">
          <span className="vtable-title-name vtable-com-name">名称</span>
          <span className="vtable-title-value vtable-com-value">值</span>
        </div>
        <div className="vtable-con-list">
          <span className="vtable-title-name vtable-com-name">名称</span>
          <span className="vtable-title-value vtable-com-value">值</span>
        </div>
      </div>
      <div className="vtable-content vtable-con">
        {data?.map((i) => {
          return (
            <div key={i.id} className="vtable-con-list vtable-content-list" onClick={() => openDialog.current(i)}>
              <span className="vtable-com-name">{i.name}</span>
              <span className="vtable-com-value">
                <MetricTag value={i.value} unit={i.unit} color={i.color} notEvo={true} />
              </span>
            </div>
          )
        })}
      </div>
      {/* <AttrTrendModal open={canOpen} setCanOpen={setCallBackModal.current} info={currentInfo} device={device} /> */}
    </div>
  )
}
