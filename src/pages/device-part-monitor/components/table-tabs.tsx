/*
 * @Author: chenmeifeng
 * @Date: 2024-04-03 09:49:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-26 11:24:57
 * @Description: 部件监控-全部模块页面
 */
import "./table-tabs.less"

import { BulbFilled } from "@ant-design/icons"
import { Input, Tabs } from "antd"

const { Search } = Input
import { useSetAtom } from "jotai"
import { useMemo, useRef, useState } from "react"

import { pointInfoSetAtom } from "@/store/atom-point-modal"
import { IDvsSystemTelemetryTableData } from "../types"
import { judgeNull } from "@/utils/util-funs"
import { YCBox } from "@/components/device-point-tab/yaoce-box"
import { YXBox } from "@/components/device-point-tab/yaoxin-box"
const typeList = [
  { label: "遥测", key: "1", closable: false },
  { label: "遥信", key: "2", closable: false },
]
interface IProps {
  data: Array<IDvsSystemTelemetryTableData>
  teleindications: Array<IDvsSystemTelemetryTableData>
}
export default function MonitorTableTab(props: IProps) {
  const { data, teleindications } = props
  const [searchVal, setSearchVal] = useState("")
  const [activeKey, setActiveKey] = useState("1")
  const [currentKey, setCurrentKey] = useState("")
  const [overlayStyle, setOverlayStyle] = useState(null)

  const setPiontList = useSetAtom(pointInfoSetAtom)
  const actualData = useMemo(() => {
    if (!searchVal) return data
    return data.filter((i) => i.name?.indexOf(searchVal) !== -1)
  }, [data, searchVal])
  const actualTeleindications = useMemo(() => {
    if (!searchVal) return teleindications
    return teleindications.filter((i) => i.name?.indexOf(searchVal) !== -1)
  }, [teleindications, searchVal])
  const onTabsChgRef = useRef((e: string) => {
    setActiveKey(e)
  })
  const searchName = (e) => {
    setSearchVal(e)
  }
  const openDialog = useRef((info) => {
    const cur = {
      ...info,
      subField: info["pointName"],
    }

    setPiontList({
      open: true,
      pointInfo: cur,
    })
  })
  const mouseLeaveRef = useRef((e, info) => {
    setCurrentKey("")
  })
  const mouseEnterRef = useRef((e, info) => {
    setCurrentKey(info.pointName)
    const position = {}
    e.clientY < 350 ? (position["bottom"] = "-1.5em") : (position["top"] = "-1.5em")
    setOverlayStyle(position)
  })
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
        <Search className="search-name" onSearch={(e) => searchName(e)} />
      </div>
      {activeKey === "1" ? (
        <div className="monitor-tbt-coml monitor-tbt-c">
          {actualData?.map((i) => {
            return (
              <div
                key={i.id}
                className="monitor-tbt-item"
                onMouseLeave={(e) => mouseLeaveRef.current(e, i)}
                onMouseEnter={(e) => mouseEnterRef.current(e, i)}
                onClick={() => openDialog.current(i)}
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
    </div>
  )
}
