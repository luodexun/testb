/*
 * @Author: chenmeifeng
 * @Date: 2024-01-08 16:06:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-21 14:56:30
 * @Description:
 */
import "./attr-trend-modal.less"

import { CloseOutlined } from "@ant-design/icons"
// import Draggable from "draggable"
import Draggable from "react-draggable"
import { useSetAtom } from "jotai"
import { useEffect, useRef } from "react"

// import CustomModal from "@/components/custom-modal"
import { pointInfoSetAtom } from "@/store/atom-point-modal"

import TrendLine from "./trend-line/trend-line"
export interface TTrendOption {
  xAxis: string[]
  series: any[]
}
export default function AttrTrendModal(props) {
  const { open, device } = props

  const nodeRef = useRef(null)
  const modeRef = useRef(null)
  const setPiontList = useSetAtom(pointInfoSetAtom)
  const closeModal = useRef(() => {
    setPiontList({ pointInfo: null, open: false })
  })
  useEffect(() => {
    if (open && modeRef.current) {
      // const drog = new Draggable(modeRef.current)
    }
  }, [open])
  return (
    // <CustomModal
    //   ref={modeRef}
    //   width="80%"
    //   title="趋势曲线"
    //   destroyOnClose
    //   open={open}
    //   footer={null}
    //   onCancel={() => setCanOpen(false)}
    //   Component={TrendLine}
    //   componentProps={{ info, device }}
    // ></CustomModal>
    <Draggable cancel=".attr-trend-ymx,.echarts-for-react" nodeRef={nodeRef}>
      <div className="attr-trend-modal" ref={nodeRef}>
        {open ? (
          <div ref={modeRef} className="trend-out">
            <div className="trend-out-box ">
              <div className="trend-box-top">
                <div className="trend-box-name">趋势曲线</div>
                <CloseOutlined style={{ cursor: "pointer" }} onClick={() => closeModal.current?.()} />
              </div>
              <TrendLine device={device} />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </Draggable>
  )
}
