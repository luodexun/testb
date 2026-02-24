/*
 * @Author: chenmeifeng
 * @Date: 2025-06-25 17:32:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-09 15:57:55
 * @Description:
 */
import { useEffect, useMemo, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"
import { YCBox } from "@/components/device-point-tab/yaoce-box"
import { YXBox } from "@/components/device-point-tab/yaoxin-box"
import TrendLine, { IOperateProps, IPerateRef } from "@/components/trend-line-by-dvs/trend-line"
import { IDvsMeasurePointData } from "@/types/i-device"
import { judgeNull } from "@/utils/util-funs"

import { IRealtimeDvs } from "../types"
interface IProps {
  device: IRealtimeDvs[]
}
export default function RealtimePoint(props: IProps) {
  const { device } = props
  const modalRef = useRef(null)
  const [openModal, setOpenModal] = useState(false)
  const [point, setPoint] = useState(null)
  const actualPoint = useMemo(() => {
    const points = device?.reduce((prev, cur) => {
      const pointsData =
        cur.point?.map((i) => {
          const { pointName, pointType, minimum, maximum } = i
          const val = cur.data?.[pointName]
          return {
            ...i,
            showValue: val,
            color:
              pointType === "2" && (maximum < (val as number) || (val as number) < minimum)
                ? "var(--fault)"
                : "var(--white-color)",
          }
        }) || []
      prev.push(...pointsData)
      return prev
    }, [])
    return points
  }, [device])

  const handleClick = useRef((point: IDvsMeasurePointData) => {
    console.log(point, "point")
    setPoint(point)
  })
  useEffect(() => {
    if (point) {
      setOpenModal(true)
    }
  }, [point])
  return (
    <div className="dvs-list">
      {actualPoint?.map((point) => {
        const className = typeof point.showValue === "undefined" ? "no" : point.showValue ? "red" : "blue"
        return point?.pointType === "2" ? (
          <div key={point.pointName} className="point-item" onClick={() => handleClick.current(point)}>
            <YCBox
              color={point.color}
              name={point.pointDesc}
              value={judgeNull(point.showValue, 1, 2, "-")}
              unit={point.unit}
            />
          </div>
        ) : (
          <div key={point.pointName} className="point-item" onClick={() => handleClick.current(point)}>
            <YXBox value={point.showValue} name={point.pointDesc} className={className} color={point.color} />
          </div>
        )
      })}
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
