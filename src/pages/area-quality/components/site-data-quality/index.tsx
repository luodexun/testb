/*
 * @Author: chenmeifeng
 * @Date: 2024-08-09 10:16:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-27 10:34:52
 * @Description:数据质量一览
 */
import CustomTable from "@/components/custom-table"
import "./index.less"
import InfoCard from "@/components/info-card"
import { QUALITY_COLUMNS } from "../../configs/site-quality"
import { useContext, useEffect, useRef, useState } from "react"
import AreaQualityContext from "../../configs/use-data-context"
import { getStationLs } from "../../methods"
import { useRefresh } from "@/hooks/use-refresh"
const test = [{ row_id: "1", stationId: 28, stationName: "龙华", caiji: 90, complete: 95 }]
export default function SiteaDataQuality(props) {
  const { title } = props
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const isFirstLoad = useRef(true)
  const currentClickRowStnCode = useRef("")
  const [refresh, setRefresh] = useRefresh(5 * 1000) // 5s
  const { setAreaQualityCt } = useContext(AreaQualityContext)
  const getSiteQuality = async () => {
    const res = await getStationLs()
    if (!res) return
    setDataSource(res)
    setRefresh(false)
    isFirstLoad.current ? clickRow.current?.(res[0]) : ""
    isFirstLoad.current = false
  }
  const clickRow = useRef((e) => {
    currentClickRowStnCode.current = e?.stationCode
    setAreaQualityCt((prev) => {
      prev["stationCode"] = e?.stationCode
      prev["stationId"] = e?.stationId || 28
      return { ...prev }
    })
  })
  // 行样式设置
  const setRowClassName = (record, index) => {
    return record.stationCode === currentClickRowStnCode.current ? "clickRowStyl" : "" //赋予点击行样式
  }
  useEffect(() => {
    if (!refresh) refresh
    getSiteQuality()
  }, [refresh])
  return (
    <InfoCard title={title} className={`area-site-quality`}>
      <CustomTable
        rowKey="stationCode"
        limitHeight
        loading={loading}
        columns={QUALITY_COLUMNS}
        dataSource={dataSource}
        pagination={false}
        rowClassName={setRowClassName}
        onRow={(record) => {
          return { onClick: clickRow.current.bind(null, record) }
        }}
      />
    </InfoCard>
  )
}
