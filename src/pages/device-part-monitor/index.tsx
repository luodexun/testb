/*
 * @Author: xiongman
 * @Date: 2023-10-23 14:51:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-29 15:14:12
 * @Description: 入口页面-设备部件监视
 */

import "./index.less"

import { BulbFilled } from "@ant-design/icons"
import { MS_SCEND_2, MS_SCEND_4 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import DetailTitle from "@pages/device-run-detail/components/detail-title.tsx"
import { getDvsSubsystemPartMap } from "@utils/device-funs.ts"
import { Button } from "antd"
import classnames from "classnames"
import { useAtomValue } from "jotai"
import { useContext, useEffect, useRef, useState } from "react"

import InfoCard from "@/components/info-card"
import ThreeModel from "@/components/three-model/index.tsx"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { pointInfoSetAtom } from "@/store/atom-point-modal.ts"
import { ISubSystemType } from "@/types/i-config.ts"

import AttrTrendModal from "../device-run-detail/components/attr-trend-modal.tsx"
import MonitorTableTab from "./components/table-tabs.tsx"
import VirtualTable from "./components/two-table.tsx"
import { dealPartName } from "./configs.tsx"
import { doExportDvsPartData, getDvsSystemPointRealTimeData } from "./methods/methods.ts"
import { IDvsSubPartPointDataSchParams, IDvsSystemTelemetryTableData } from "./types.ts"

export default function DevicePartMonitor() {
  const FirstTotal = useRef({ id: 9999999, name: "全部", label: "全部", value: 9999999 })
  const [deviceParts, setDeviceParts] = useState<ISubSystemType[]>([])
  const [checkedPart, setCheckedPart] = useState<ISubSystemType>()
  const [teleindications, setTeleindications] = useState<IDvsSystemTelemetryTableData[]>([])
  const [dataSource, setDataSource] = useState<IDvsSystemTelemetryTableData[]>([])
  const [loading, setLoading] = useState(false)
  const { device } = useContext(DvsDetailContext)
  const [reload, setReload] = useRefresh(MS_SCEND_4) // 4 秒

  const [canOpen, setCanOpen] = useState(false)
  const piontLs = useAtomValue(pointInfoSetAtom)
  useEffect(() => {
    if (piontLs?.open) {
      setCanOpen(true)
    } else {
      setCanOpen(false)
    }
  }, [piontLs])
  useEffect(() => {
    if (!device?.deviceType) return
    // getDvsSubsystemPartMap(device?.deviceType)
    //   .then(Object.values)
    //   .then((partList) => {
    //     if (!partList?.length) return
    //     const result = [{ id: 9999999, name: "全部", label: "全部", value: 9999999 }].concat(partList)
    //     setDeviceParts(result)
    //     setCheckedPart(result[0])
    //   })
    setCheckedPart(FirstTotal.current)
  }, [device?.deviceType])
  useEffect(() => {}, [])
  useEffect(() => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), MS_SCEND_2)
  }, [checkedPart])

  useEffect(() => {
    if (!reload || !device?.deviceCode || !checkedPart?.id) return
    ;(async function () {
      const id = checkedPart?.id === 9999999 ? null : checkedPart?.id
      const params: IDvsSubPartPointDataSchParams = { deviceCode: device.deviceCode, systemId: id }
      const { telemetry, teleindication, sysList } = await getDvsSystemPointRealTimeData(params)
      // 当查询全部测点的时候，根据测点得到该设备下有多少个子系统
      if (!id) {
        // const testSys = [
        //   { id: 201, value: 201, label: "集中式逆变器", name: "集中式逆变器", deviceType: "PVINV" },
        //   { id: 202, value: 202, label: "箱变", name: "箱变", deviceType: "PVINV" },
        //   { id: 203, value: 203, label: "直流汇流箱", name: "直流汇流箱", deviceType: "PVINV" },
        //   { id: 204, value: 204, label: "组串式逆变器", name: "组串式逆变器", deviceType: "PVINV" },
        //   { id: 205, value: 205, label: "跟踪系统", name: "跟踪系统", deviceType: "PVINV" },
        // ]
        setDeviceParts(sysList)
      }
      setDataSource(telemetry)
      setTeleindications(teleindication)
      setReload(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedPart?.id, device?.deviceCode, reload])

  function onExport() {
    if (!device?.deviceCode || !checkedPart?.id) return
    const id = checkedPart?.id === 9999999 ? null : checkedPart?.id
    doExportDvsPartData({ deviceCode: device.deviceCode, systemId: id })
  }

  return (
    <InfoCard extra={<DetailTitle />} className="device-part-monitor-wrap">
      <div className="part-button">
        <Button
          key={FirstTotal.current.id}
          disabled={loading}
          children={FirstTotal.current.name}
          className={classnames({ "part-btn": true, active: FirstTotal.current.id === checkedPart?.id })}
          onClick={() => setCheckedPart(FirstTotal.current)}
        />
        {deviceParts.map((part) => (
          <Button
            key={part.id}
            disabled={loading}
            children={part.name}
            className={classnames({ "part-btn": true, active: part.id === checkedPart?.id })}
            onClick={() => setCheckedPart(part)}
          />
        ))}
        <Button size="small" type="primary" className="part-state-export" children="导出" onClick={onExport} />
      </div>
      {checkedPart?.id === 9999999 ? (
        <div className="device-monitor-content">
          <MonitorTableTab data={dataSource} teleindications={teleindications} />
        </div>
      ) : (
        <div className="device-part-content">
          <div className="part-content">
            <div className="part-content-model">
              {device?.deviceType === "WT" || device?.deviceType === "PVINV" ? (
                <ThreeModel
                  deviceType={device?.deviceType}
                  type={device?.deviceType === "WT" ? "" : device?.deviceTags?.inverter_type || "组串式"}
                  chooseMeshName={dealPartName(checkedPart?.name, device?.deviceTags?.inverter_type || "组串式")}
                />
              ) : device ? (
                <img src="/images/fanParts/ESPCS.png" alt={checkedPart?.name} className="fan-cross-section" />
              ) : null}
            </div>
            <div className="part-content-table">
              <VirtualTable data={dataSource} />
            </div>
          </div>
          <div className="part-run-state">
            {teleindications?.map(({ name, value, id, className }) => (
              <div key={id} className="part-state-item">
                <BulbFilled className={className || "no"} />
                <span title={`${name}: ${value}`} className="part-state-name" children={name} />
              </div>
            ))}
          </div>
        </div>
      )}
      <AttrTrendModal open={canOpen} device={device} />
    </InfoCard>
  )
}
