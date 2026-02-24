/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:00:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-18 14:56:35
 * @Description: 故障报警信息
 */

import { useRefresh } from "@hooks/use-refresh.ts"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import CustomTable from "@/components/custom-table"
import InfoCard from "@/components/info-card"
import RadioButton from "@/components/radio-button/index.tsx"
import { ALARM_TYPE } from "@/configs/option-const.tsx"
import { MS_SCEND_3 } from "@/configs/time-constant.ts"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IBaseProps } from "@/types/i-page.ts"

import { FAULT_ALARM_COLUMNS } from "./configs.tsx"
import { queryDvsAlarmData, queryHtrAlarmData } from "./methods.ts"
import { IDvsAlarmData } from "./types.ts"
const HA_ALARM_TYPE = [
  { value: "getfilterRealTimeMsgData", label: "实时" },
  { value: "getAlarmList", label: "历史" },
]
interface IProps extends IBaseProps {}
export default function FaultAlarm(props: IProps) {
  const { className } = props
  const { device } = useContext(DvsDetailContext)
  const [dataSource, setDataSource] = useState<IDvsAlarmData[]>([])
  const [alarmType, setAlarmType] = useState<string>("1")
  const [haAlarmType, setHaAlarmType] = useState<string>("getAlarmList")

  const [reload, setReload] = useRefresh(15000) //MS_SCEND_3

  useEffect(() => {
    if (!reload || !device?.deviceId) return
    queryHtrAlarmData({ deviceIds: device.deviceId, alarmLevelId: parseInt(alarmType) }, haAlarmType).then((res) => {
      if (typeof res !== "boolean") {
        setDataSource(res)
      }
      setReload(false)
    })
  }, [alarmType, haAlarmType, device, reload, setReload])
  useEffect(() => {
    setReload(true)
  }, [device, alarmType])
  const history = useNavigate()
  const toAlarmPage = useRef((record) => {
    history(
      `/alarm/history?stationId=${record.stationId}&deviceType=${record.deviceType}&deviceIds=${[record.deviceId]}`,
    )
  })
  const changeParentType = useRef((e) => {
    setHaAlarmType(e)
    setReload(true)
  })
  const changeChildType = useRef((e) => {
    setAlarmType(e)
    setReload(true)
  })
  return (
    <InfoCard
      title="故障报警信息"
      className={`l-full ${className}`}
      extra={
        <div>
          <RadioButton size="small" options={HA_ALARM_TYPE} onChange={changeParentType.current} />
          <RadioButton size="small" options={ALARM_TYPE} onChange={changeChildType.current} />
        </div>
      }
    >
      <CustomTable
        rowKey="id"
        size="small"
        limitHeight
        pagination={false}
        columns={FAULT_ALARM_COLUMNS}
        dataSource={dataSource}
        onRow={(record) => {
          return {
            onClick: () => {
              toAlarmPage.current(record)
            }, // 点击行
          }
        }}
      />
    </InfoCard>
  )
}
