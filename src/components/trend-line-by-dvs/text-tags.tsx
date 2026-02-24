/*
 * @Author: chenmeifeng
 * @Date: 2025-09-09 16:07:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-10 16:02:09
 * @Description:
 */
import { useCallback, useEffect, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"

import MetricTag from "../metric-tag"
import TrendLine, { IOperateProps, IPerateRef } from "./trend-line"

interface IProps {
  record: any
  text: any
  title: string
  unit: any
  valkey: string
  color?: string
  showTags?: boolean
  click?: () => void
}
export default function PointTextTags(props: IProps) {
  const { record, text, unit, title, valkey, color } = props

  const modalRef = useRef(null)
  const [openModal, setOpenModal] = useState(false)
  const [point, setPoint] = useState(null)

  const handleMenuClick = useCallback((e) => {
    e.preventDefault()
    setOpenModal(true)
  }, [])
  useEffect(() => {
    if (!openModal || !valkey) return
    const data = {
      pointName: valkey,
      ...record,
    }
    setPoint(data)
  }, [openModal, valkey])
  return (
    <div className="tag-wai">
      {/* <span style={{ color: color }} onClick={handleClick.current} onContextMenu={handleMenuClick}>
        {judgeNull(text, 1, 2, "-")}
      </span> */}
      <MetricTag
        key={valkey}
        title={title}
        value={text ?? "-"}
        unit={unit as string}
        color={color}
        notEvo={true}
        onClickValue={(e) => handleMenuClick(e)}
        className="index-info-tag"
      />
      <CustomModal<IPerateRef, IOperateProps>
        ref={modalRef}
        width="70%"
        title="历史曲线"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        Component={TrendLine}
        componentProps={{ point: point }}
      />
    </div>
  )
}
