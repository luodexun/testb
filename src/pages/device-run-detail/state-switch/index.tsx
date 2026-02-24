/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:00:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 10:11:10
 * @Description: 状态转换
 */

import { MS_SCEND_3 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { DatePicker } from "antd"
import { Dayjs } from "dayjs"
import { useContext, useEffect, useState } from "react"

import CustomTable from "@/components/custom-table"
import InfoCard from "@/components/info-card"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IBaseProps } from "@/types/i-page.ts"

import { STATE_SWITCH_COLUMNS } from "./configs.tsx"
import { getDvsStateTrendData } from "./methods.ts"
import { IDvsStateTrendData, IDvsStateTrendParams } from "./types.ts"

interface IProps extends IBaseProps {}
export default function StateSwitch(props: IProps) {
  const { className } = props
  const { device, isUseNewDvsState } = useContext(DvsDetailContext)
  const [dataSource, setDataSource] = useState<IDvsStateTrendData[]>([])
  const [endDate, setEndDate] = useState<Dayjs>() // 查询时间

  const [reload, setReload] = useRefresh(MS_SCEND_3)

  useEffect(() => {
    setReload(true)
  }, [setReload, endDate])

  useEffect(() => {
    if (!reload || !device?.deviceCode) return
    const params: IDvsStateTrendParams = { ...device }
    getDvsStateTrendData(params, endDate, isUseNewDvsState)
      .then(setDataSource)
      .then(() => setReload(false))
  }, [device, endDate, reload, setReload, isUseNewDvsState])

  useEffect(() => {
    setReload(true)
  }, [device])
  return (
    <InfoCard
      title="状态转换"
      extra={<DatePicker allowClear={false} size="small" value={endDate} onChange={setEndDate} />}
      className={`l-full ${className}`}
    >
      <CustomTable
        rowKey="id"
        size="small"
        limitHeight
        pagination={false}
        columns={STATE_SWITCH_COLUMNS}
        dataSource={dataSource}
      />
    </InfoCard>
  )
}
