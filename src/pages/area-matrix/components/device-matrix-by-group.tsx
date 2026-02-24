/*
 * @Author: chenmeifeng
 * @Date: 2024-01-15 18:12:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-13 13:42:27
 * @Description:
 */
import "./device-matrix-by-group.less"

import { TSiteLayout } from "@configs/option-const.tsx"
import { isEmpty, reduceList2KeyValueMap } from "@utils/util-funs.tsx"
import classnames from "classnames"
import { useContext, useMemo } from "react"

import MetricTag from "@/components/metric-tag/index.tsx"
import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@/configs/dvs-state-info.ts"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IDeviceData } from "@/types/i-device.ts"

import DeviceMatrixByList from "./device-matrix-by-list.tsx"
import DeviceMatrixTable from "./device-matrix-by-table.tsx"

interface IProps {
  list: IDeviceData[]
  deviceType?: string
  layout?: TSiteLayout
}
const keyNames = {
  lineName: "lineCode",
  periodName: "periodCode",
  model: "modelId",
  array: "array",
}
const defaultColumns = [
  {
    dataIndex: "deviceNumber",
    title: "设备编号",
  },
]
const NOT_GROUP = "NOT_GROUP"

function isNotGroup(lineName: string) {
  return isEmpty(lineName) || lineName === NOT_GROUP
}

export default function DeviceMatrixByGroup(props: IProps) {
  const { list, layout, deviceType } = props
  const { chooseColumnKey, showMode } = useContext(DvsDetailContext)

  const { nameList, groupMap, parentGroupMap } = useMemo(() => {
    const bySite = layout === "site"
    const groupBy = bySite ? NOT_GROUP : layout
    const fieldInfo = { vField: groupBy }
    const sortKey = !bySite ? keyNames[layout] : ""
    const sortList = sortKey ? list?.sort((a, b) => a[sortKey] - b[sortKey]) : list
    const groupMap = bySite ? { [NOT_GROUP]: list } : reduceList2KeyValueMap(sortList, fieldInfo, [])
    const nameList = Object.keys(groupMap)

    // 线路-箱变-设备层级
    const parentFieldInfo = { vField: "parentName" }
    const parentGroupMap = {}
    if (!bySite) {
      nameList.forEach((item) => {
        parentGroupMap[item] = reduceList2KeyValueMap(groupMap[item], parentFieldInfo, [])
      })
    }

    return { nameList, groupMap, parentGroupMap }
  }, [layout, list])

  const columns = useMemo(() => {
    const allColumns = DEVICE_RUN_CARD_FIELD_4TYPE[deviceType]
    const filterChooseKeyColumns = allColumns
      ?.filter((i) => chooseColumnKey?.[deviceType]?.includes(i.field + "-" + deviceType))
      ?.map((i) => {
        return {
          dataIndex: i.field === "mainState" ? "mainStateLabel" : i.field,
          title: i.title,
          sorter: tableSortByKey(i.field),
          render: (text) => <MetricTag value={text} unit={i.unit} notEvo={true} />,
        }
      })
    return defaultColumns.concat(filterChooseKeyColumns)
  }, [deviceType, chooseColumnKey])

  return (
    <div className="device-matrix-by-group">
      {nameList?.map((lineName) => (
        <div key={lineName} className={classnames("line-metrix-group", { "matrix-by-group": !isNotGroup(lineName) })}>
          {isNotGroup(lineName) ? null : <div className="line-name" children={lineName} />}
          {deviceType === "WT" ||
          (deviceType === "PVINV" && layout !== "lineName") ||
          (deviceType === "ESPCS" && layout !== "lineName") ? (
            showMode === "table" ? (
              <DeviceMatrixTable columns={columns} list={groupMap[lineName]} />
            ) : (
              <DeviceMatrixByList key={lineName} list={groupMap[lineName]} allDvs={list} deviceType={deviceType} />
            )
          ) : (
            <div className={classnames("device-matrix-by-group", { "line-by-group": !isEmpty(lineName) })}>
              {Object.keys(parentGroupMap?.[lineName])?.map((parentName) => (
                <div
                  key={parentName}
                  className={classnames("line-metrix-group", { "matrix-by-group": !isEmpty(parentName) })}
                >
                  {isEmpty(parentName) ? null : <div className="line-name" children={parentName} />}
                  {showMode === "table" ? (
                    <DeviceMatrixTable columns={columns} list={parentGroupMap?.[lineName]?.[parentName]} />
                  ) : (
                    <DeviceMatrixByList
                      key={parentName}
                      list={parentGroupMap?.[lineName]?.[parentName]}
                      allDvs={list}
                      deviceType={deviceType}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
export const tableSortByKey = (key) => {
  return (a, b) => a[key] - b[key]
}
