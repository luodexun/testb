/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:39:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-31 09:26:01
 * @Description: 区域中心-指标总览-场站详情
 */

import { MAIN_DVS_TYPE } from "@configs/option-const.tsx"
import { getDvsMainStateList } from "@hooks/use-matrix-device-list.ts"
import useMonitorStationData from "@hooks/use-monitor-station-data.ts"
import useRun4deviceData from "@hooks/use-run-4device-data.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomStnMonitorDataMap } from "@store/atom-run-station.ts"
import { TableScroll } from "@utils/table-scroll.ts"
import { useAtomValue } from "jotai"
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal/index.tsx"
import CustomTable from "@/components/custom-table"
import { ICustomTabRef } from "@/components/custom-table/interfaces.ts"
import InfoCard from "@/components/info-card"
import RadioButton from "@/components/radio-button"
import { TDeviceType } from "@/types/i-config.ts"
import { IBaseProps } from "@/types/i-page.ts"
import { getMngStaticInfo } from "@/utils/device-funs.ts"

import SiteModalList, { IOperateProps, IPerateRef } from "./components/site-list.tsx"
import { crtSiteDetailColumns, stnMonitorDataAndRun4StationData2TableData } from "./methods.tsx"
import { ISiteDetailTableData } from "./types.ts"

interface IProps extends IBaseProps {}
export default function SiteDetail(props: IProps) {
  const { title, className } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [siteQuota, setSiteQuota] = useState({})
  const modeRef = useRef(null)
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const [dataSource, setDataSource] = useState<ISiteDetailTableData[]>([])
  const tableRef = useRef<ICustomTabRef>(null)
  const tableScrollRef = useRef<TableScroll>(null)
  const stnMonitorDataMap = useAtomValue(AtomStnMonitorDataMap)
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map
  const timeoutRef = useRef(null)
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: [deviceType] }
  }, [deviceType])
  const { run4Device } = useRun4deviceData(runParams)
  useMonitorStationData([deviceType])

  useEffect(() => {
    if (!deviceType) return
    getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN", "old")
    if (!stnMonitorDataMap[deviceType]) return setDataSource([])
    const tableData = stnMonitorDataAndRun4StationData2TableData(
      deviceStdStateMap,
      deviceType,
      stnMonitorDataMap,
      run4Device,
    )
    if (!tableData) return
    setDataSource(tableData || [])
  }, [stnMonitorDataMap, run4Device, deviceType, deviceStdStateMap])

  const columns = useMemo(() => {
    return crtSiteDetailColumns(deviceStdStateMap, deviceType, false, true, null, siteQuota)
  }, [deviceStdStateMap, deviceType, siteQuota])

  const resetTbScrollRef = useRef(
    (tableScroll: MutableRefObject<TableScroll>, tableWrap: MutableRefObject<ICustomTabRef>) => {
      const timeout = tableWrap.current ? 1000 : 3000
      timeoutRef.current = window.setTimeout(() => {
        if (!tableWrap.current) return
        const scrollBox = tableWrap.current.tableWrap.querySelector(".ant-table-container .ant-table-body")
        tableScroll.current.setDom(scrollBox)
        if (tableScrollRef.current?.scrollBoxDom) return
        resetTbScrollRef.current(tableScroll, tableWrap)
      }, timeout)
    },
  )
  const initQuotaChecks = async () => {
    const res = await getMngStaticInfo()
    if (!res) return
    setSiteQuota(res.siteChecks)
  }
  useEffect(() => {
    if (!dataSource?.length) return
    const tableScroll = (tableScrollRef.current = new TableScroll(null, {
      haltMode: { scrollRowClass: ".ant-table-row" },
      initScroll: true,
    }))
    if (tableRef.current) {
      resetTbScrollRef.current(tableScrollRef, tableRef)
    } else {
      window.setTimeout(() => {
        resetTbScrollRef.current(tableScrollRef, tableRef)
      }, 2000)
    }

    return () => {
      // 再次执行 useEffect 前调用以清理状态
      tableScroll?.destory()
    }
  }, [dataSource?.length])

  useEffect(() => {
    initQuotaChecks()
  }, [])
  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current)
  }, [])

  const titleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="site-detail">
      <InfoCard
        title={title}
        className={`site-detail-ct ${className ?? ""}`}
        titleClick={titleClick}
        extra={<RadioButton size="small" options={MAIN_DVS_TYPE} onChange={setDeviceType} />}
        children={
          <CustomTable
            ref={tableRef}
            rowKey="id"
            size="small"
            limitHeight
            // scroll={{ x: "100vw" }}
            loading={false}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
          />
        }
      />
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="90%"
        title="场站列表"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={SiteModalList}
        componentProps={{ run4Device: run4Device, siteQuota }}
      />
    </div>
  )
}
