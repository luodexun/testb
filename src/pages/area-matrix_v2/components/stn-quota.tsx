/*
 * @Author: chenmeifeng
 * @Date: 2024-12-11 14:39:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-10 10:20:06
 * @Description:
 */
import "./stn-quota.less"

import { useContext, useMemo, useRef, useState } from "react"

import TrendLine, { IOperateProps, IPerateRef } from "@/components/common-target-box/trend-line"
import CustomModal from "@/components/custom-modal"
import { MONITOR_SITE_INFO_MAP } from "@/configs/dvs-state-info"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { judgeNull } from "@/utils/util-funs"

export default function StationQuota(props) {
  const { data, quotaInfo, stationCode } = props

  const [openModal, setOpenModal] = useState(false)
  const [ponit, setPoint] = useState("")
  const modalRef = useRef(null)
  const { deviceType } = useContext(DvsDetailContext)
  const infoList = useMemo(() => {
    if (!deviceType) return []
    const checks = quotaInfo?.map((i) => i.split("-")?.[0]) || []
    return MONITOR_SITE_INFO_MAP[deviceType]?.filter((i) => checks.includes(i.field)) || []
  }, [deviceType, quotaInfo])
  const clickItem = (info) => {
    if (info?.trendNoShow) return
    setOpenModal(true)
    setPoint(info.field)
  }
  return (
    <div className="matrix-stn-quota">
      {infoList?.map((i) => {
        return (
          <div
            className="stn-quota-item"
            style={{ width: `${i.width || 15}em` }}
            key={i.field}
            onClick={() => clickItem({ field: i.field, trendNoShow: i.trendNoShow })}
          >
            <span className="item1">{i.title}</span>
            <span className="item2">{judgeNull(data?.[i.field], 1, 2, "-")}</span>
            <span className="item1">{i.unit}</span>
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
        componentProps={{ deviceType: deviceType, stationCode: stationCode, point: ponit }}
      />
    </div>
  )
}
