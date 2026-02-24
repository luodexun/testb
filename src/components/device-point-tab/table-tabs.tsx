/*
 * @Author: chenmeifeng
 * @Date: 2025-04-07 10:03:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 17:26:21
 * @Description: 设备遥信遥控tabs,数据来源接口,非mqtt
 */
import "./table-tabs.less"

import { BulbFilled } from "@ant-design/icons"
import { Button, Input, Pagination, Tabs } from "antd"

const { Search } = Input
import { useSetAtom } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"

import useInterval from "@/hooks/useInterval"
import { doExportDvsPartData } from "@/pages/device-part-monitor/methods/methods"
import { pointInfoSetAtom } from "@/store/atom-point-modal"
import { judgeNull } from "@/utils/util-funs"

import { getDvsSystemPointRealTimeData } from "./method"
import { IDvsSystemTelemetryTableData } from "./type"
import { YCBox } from "./yaoce-box"
import { YXBox } from "./yaoxin-box"
const typeList = [
  { label: "遥测", key: "2", closable: false },
  { label: "遥信", key: "1", closable: false },
]
interface IProps {
  data: Array<IDvsSystemTelemetryTableData>
  teleindications: Array<IDvsSystemTelemetryTableData>
}
export default function MonitorTableTab(props) {
  const { deviceCode } = props
  const [searchVal, setSearchVal] = useState("")
  const [activeKey, setActiveKey] = useState("2")
  const [currentKey, setCurrentKey] = useState("")
  const [data, setData] = useState<Array<IDvsSystemTelemetryTableData>>([])
  const [teleindications, setTeleindications] = useState<Array<IDvsSystemTelemetryTableData>>([])
  const [overlayStyle, setOverlayStyle] = useState(null)
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 100,
  })
  const pageSizeOptions = useRef([100, 200, 500, 1000])
  const [total, setTotal] = useState(0)
  const [reload, setReload] = useInterval(3000)
  const actualData = useMemo(() => {
    if (!searchVal) return data
    return data.filter((i) => i.name?.indexOf(searchVal) !== -1)
  }, [data, searchVal])
  const actualTeleindications = useMemo(() => {
    if (!searchVal) return teleindications
    return teleindications.filter((i) => i.name?.indexOf(searchVal) !== -1)
  }, [teleindications, searchVal])
  const initPointData = async () => {
    const params = {
      deviceCode: deviceCode,
      pageSize: pageInfo.pageSize,
      pageNum: pageInfo.current,
      pointType: activeKey,
    }
    const { teleindication, telemetry, total } = await getDvsSystemPointRealTimeData(params)
    setReload(false)
    setTeleindications(teleindication)
    setData(telemetry)
    setTotal(total)
  }
  const onTabsChgRef = useRef((e: string) => {
    setActiveKey(e)
  })
  const searchName = (e) => {
    setSearchVal(e)
  }
  const mouseLeaveRef = useRef((e, info) => {
    setCurrentKey("")
  })
  const mouseEnterRef = useRef((e, info) => {
    setCurrentKey(info.pointName)
    const position = {}
    e.clientY < 350 ? (position["bottom"] = "-1.5em") : (position["top"] = "-1.5em")
    setOverlayStyle(position)
  })
  const onChangePage = useRef((page, pageSize) => {
    setPageInfo((prev) => {
      prev.current = page
      prev.pageSize = pageSize
      return { ...prev }
    })
  })
  const exportFile = () => {
    const params = {
      deviceCode: deviceCode,
      pointType: activeKey,
      pageSize: pageInfo.pageSize,
      pageNum: pageInfo.current,
    }
    doExportDvsPartData(params)
  }

  useEffect(() => {
    setReload(true)
  }, [pageInfo, activeKey])
  useEffect(() => {
    if (!reload) return
    initPointData()
  }, [reload])
  return (
    <div className="monitor-tbt">
      <div className="tabList page-tabs-wrap">
        <Tabs
          type="editable-card"
          hideAdd
          tabBarGutter={4}
          items={typeList}
          activeKey={activeKey}
          onChange={(e) => onTabsChgRef.current.call(null, e)}
        />
        <div className="search-wrap">
          <Search className="search-box" onSearch={(e) => searchName(e)} />
          <Button onClick={exportFile}>导出</Button>
        </div>
      </div>
      {activeKey === "2" ? (
        <div className="monitor-tbt-coml monitor-tbt-c">
          {actualData?.map((i) => {
            return (
              <div
                key={i.id}
                className="monitor-tbt-item"
                onMouseLeave={(e) => mouseLeaveRef.current(e, i)}
                onMouseEnter={(e) => mouseEnterRef.current(e, i)}
              >
                {currentKey === i.pointName ? (
                  <div className="tooltip-name" style={overlayStyle}>
                    {judgeNull(i.minimum, 1, 3, "-")}至{judgeNull(i.maximum, 1, 3, "-")}
                  </div>
                ) : (
                  ""
                )}
                <YCBox color={i.color} name={i.name} value={i.value} unit={i.unit} />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="monitor-tbt-coml monitor-tbt-x">
          {actualTeleindications?.map((i) => {
            return (
              <div key={i.id} className="monitor-tbt-item">
                <YXBox value={i.value} name={i.name} className={i.className} color={i.color} />
              </div>
            )
          })}
        </div>
      )}
      <Pagination
        pageSizeOptions={pageSizeOptions.current}
        current={pageInfo.current}
        pageSize={pageInfo.pageSize}
        total={total}
        onChange={onChangePage.current}
      />
    </div>
  )
}
