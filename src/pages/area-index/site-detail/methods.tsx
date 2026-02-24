/*
 * @Author: xiongman
 * @Date: 2023-10-13 14:10:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-12 16:08:31
 * @Description: 区域中心-指标总览-场站详情-方法们
 */

import { MONITOR_SITE_INFO_MAP } from "@configs/dvs-state-info.ts"
import { LARGER_W, TRANS_LARGE_UNIT, UNIT } from "@configs/text-constant.ts"
import { getDvsMainStateList } from "@hooks/use-matrix-device-list.ts"
import { TRun4DvsData } from "@store/atom-run-device.ts"
import {
  evoluateNum,
  getStationMainId,
  isEmpty,
  isNumVal,
  numberVal,
  reduceList2KeyValueMap,
} from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"
import { ColumnType } from "antd/es/table/interface"
import { Link } from "react-router-dom"

import MetricTag from "@/components/metric-tag"
import { getsiteUrl } from "@/router/menu-site.ts"
import { IConfigDeviceStateData, TDeviceType } from "@/types/i-config.ts"
import { TDvsTypeRunData4MQ } from "@/types/i-device.ts"
import { TStnMonitorDataMap } from "@/types/i-monitor-info.ts"

import { ISiteDetailTableData } from "./types.ts"

const EVO_UNITS = [UNIT.POWER_K, UNIT.ELEC]
export const tableSortByKey = (key) => {
  return (a, b) => a[key] - b[key]
}
export function stnMonitorDataAndRun4StationData2TableData(
  deviceStdStateMap: Record<TDeviceType, IConfigDeviceStateData[]>,
  deviceType: TDeviceType,
  stnMonitorDataMap: TStnMonitorDataMap,
  run4Device: TRun4DvsData,
): ISiteDetailTableData[] | null {
  const stnMonitorData = stnMonitorDataMap?.[deviceType]
  if (isEmpty(stnMonitorData)) return null
  const monitorSiteInfos = MONITOR_SITE_INFO_MAP[deviceType]
  if (!monitorSiteInfos?.length) return null
  // 含有选中设备类型的场站
  const stnCodeList = Object.keys(stnMonitorData)

  const run4DvsOfDvsType: TDvsTypeRunData4MQ = run4Device?.[deviceType] || {}
  let siteCode: string
  //无通讯或未知
  const run4StateCountMap: Record<string, Record<string, number>> = Object.values(run4DvsOfDvsType)
    .filter(({ stationCode }) => stnCodeList.includes(stationCode))
    .reduce((prev, runData) => {
      if (!runData.mainStateLabel) return prev
      siteCode = runData.stationCode
      if (!prev[siteCode])
        prev[siteCode] = {
          无通讯:
            deviceType === "WT"
              ? stnMonitorData?.[siteCode]?.["wtNum"] || 0
              : deviceType === "PVINV"
                ? stnMonitorData?.[siteCode]?.["pvinvNum"] || 0
                : stnMonitorData?.[siteCode]?.["espcsNum"] || 0,
        }
      if (runData.mainStateLabel === "无通讯") return prev
      if (!prev[siteCode][runData.mainStateLabel]) prev[siteCode][runData.mainStateLabel] = 0
      prev[siteCode][runData.mainStateLabel] += 1
      prev[siteCode]["无通讯"] -= 1
      return prev
    }, {})

  // 获取设备类型下的主状态列表
  const { stateInfoList } = getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN", "old")
  const stnMonitorDataList = Object.values(stnMonitorData)
  return stnMonitorDataList.map((item) => ({
    id: item.stationCode,
    stationCode: item.stationCode,
    stationName: item.stationShortName,
    maintenanceComId: item.maintenanceComId,
    maintenanceComShortName: item.maintenanceComShortName,
    // maintenanceComName: mainNameList.find(i => i. === item.)
    ...reduceList2KeyValueMap(monitorSiteInfos, { vField: "field" }, (data) => {
      if (TRANS_LARGE_UNIT && EVO_UNITS.includes(data.unit)) {
        return evoluateNum(item[data.field] as number, LARGER_W, 4)
      }
      return numberVal(item[data.field] as number)
    }),
    //无通讯或未知
    ...reduceList2KeyValueMap(stateInfoList, { vField: "stateDesc" }, (data) => {
      return run4StateCountMap[item.stationCode]?.[data.stateDesc] ||
        run4StateCountMap[item.stationCode]?.[data.stateDesc] === 0
        ? run4StateCountMap[item.stationCode]?.[data.stateDesc]
        : data.stateDesc === "无通讯"
          ? deviceType === "WT"
            ? item["wtNum"] || 0
            : deviceType === "PVINV"
              ? item["pvinvNum"] || 0
              : item["espcsNum"] || 0
          : "-"
    }),
  }))
}
export function crtSiteDetailColumns(
  deviceStdStateMap: Record<TDeviceType, IConfigDeviceStateData[]>,
  deviceType: TDeviceType,
  isSort = false,
  showState = true,
  dataSource = null,
  siteQuota = null,
) {
  const columns: ColumnsType<ISiteDetailTableData> = [
    {
      dataIndex: "stationName",
      title: "场站名称",
      align: "center",
      width: "8em",
      fixed: "left",
      ellipsis: true,
      render: (val: number, record) => (
        <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/${getsiteUrl(record?.stationType)}`}>
          <span style={{ color: "#fff" }}>{val}</span>
        </Link>
      ),
    },
  ]
  if (dataSource) {
    columns.unshift({
      dataIndex: "maintenanceComShortName",
      title: "",
      align: "center",
      fixed: "left",
      render: (text, record, idx) => {
        const obj = {
          children: text,
          props: {
            rowSpan: 0,
          },
        }
        const arr = dataSource?.filter((res) => res.maintenanceComId === record.maintenanceComId) || []
        if (idx === 0 || dataSource[idx - 1].maintenanceComId !== record.maintenanceComId) {
          obj.props.rowSpan = arr.length
        }
        return obj
      },
    })
  }
  let infoList = MONITOR_SITE_INFO_MAP[deviceType]
  if (siteQuota && Object.keys(siteQuota).length > 0) {
    const checks = siteQuota[deviceType || "WT"]?.map((i) => i.split("-")?.[0]) || []
    infoList = infoList?.filter((i) => checks.includes(i.field)) || []
  }
  let evoUnit: string
  columns.push(
    ...(infoList.map(({ field, title, unit }) => {
      evoUnit = unit
      if (TRANS_LARGE_UNIT && EVO_UNITS.includes(unit)) evoUnit = `${UNIT.EVO_W}${unit}`
      return crtColumn({
        dataIndex: field,
        title,
        unit: evoUnit,
        sorter: isSort ? tableSortByKey(field) : null,
      })
    }) || []),
  )
  if (!showState) return columns
  // 获取设备类型下的主状态列表
  const { stateInfoList } = getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN", "old")

  columns.push(
    ...stateInfoList.map(({ stateDesc, color }) => {
      return crtColumn({ dataIndex: stateDesc, title: stateDesc, color, unit: UNIT.COUNT })
    }),
  )
  return columns
}

function crtColumn(
  params: Partial<(typeof MONITOR_SITE_INFO_MAP)[TDeviceType][0]> & ColumnType<ISiteDetailTableData>,
): ColumnType<ISiteDetailTableData> {
  const { dataIndex, title, unit, color, ...others } = params
  return {
    dataIndex,
    title: title + `(${unit})`,
    align: "center",
    render: (val: number | string) => {
      if (val == "-") {
        return <span style={{ color: color || "#fff" }}>0</span>
      }
      if (!isNumVal(val)) return val
      // return <MetricTag value={val} unit={unit} color={color} notEvo={true} />
      return <span style={{ color: color }}>{val}</span>
    },
    ...others,
  }
}
