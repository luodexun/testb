/*
 * @Author: chenmeifeng
 * @Date: 2025-09-09 16:07:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 11:21:22
 * @Description:
 */
import { useCallback, useEffect, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"
import { judgeNull } from "@/utils/util-funs"

import TrendLine, { IOperateProps, IPerateRef } from "./trend-line"

interface IProps {
  record: any
  text: any
  valkey?: string
  color?: string
  showTags?: boolean
  className?: string
  click?: () => void
}
export default function PointText(props: IProps) {
  const { record, text, valkey, color, className, click } = props

  const modalRef = useRef(null)
  const [openModal, setOpenModal] = useState(false)
  const [point, setPoint] = useState(null)

  const handleClick = () => {
    click?.()
  }
  const handleMenuClick = useCallback((e) => {
    if (!valkey || !record || !Object.keys(record)?.length) return
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
    <div>
      <span style={{ color: color }} className={className} onClick={handleClick} onContextMenu={handleMenuClick}>
        {judgeNull(text, 1, 2, "-")}
      </span>
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
