/*
 * @Author: chenmeifeng
 * @Date: 2024-04-07 14:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-26 11:06:00
 * @Description:
 */
import usePageSearch from "@hooks/use-page-search.ts"
import { getDvsMeasurePointsData } from "@utils/device-funs.ts"
import { Empty } from "antd"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"

import CustomTable from "@/components/custom-table"
import useMqttDevicemng from "@/hooks/use-mqtt-devicemng"

import { CONTROL_GRID_COLUMNS } from "../configs"
import { getDevicemngLogSchData } from "../methods"
export default function AnalyseContent(props) {
  const { message, clickDevice } = props
  const [deviceMqList, setDeviceMqList] = useState([])
  const [yaoCe, setYaoCe] = useState([])
  const [yaoXin, setYaoXin] = useState([])
  const { dataSource, loading, pagination, onSearch } = usePageSearch<any, any>(
    { serveFun: getDevicemngLogSchData },
    {
      otherParams: {
        deviceType: clickDevice?.deviceType,
        deviceIds: clickDevice?.deviceId,
        startTime: dayjs().subtract(24, "hour").valueOf(),
        endTime: dayjs().valueOf(),
      },
      needFirstSch: false,
    },
  )

  async function getTelemetryData() {
    const dvsMeasurePoints = await getDvsMeasurePointsData({ deviceId: clickDevice?.deviceId, pointTypes: "1,2" })
    const tmpData = dvsMeasurePoints.filter((item) => item.pointType == "1")
    const tmpData2 = dvsMeasurePoints.filter((item) => item.pointType == "2")
    setYaoCe(tmpData2)
    setYaoXin(tmpData)
  }

  useEffect(() => {
    if (clickDevice?.deviceId) {
      getTelemetryData()
      onSearch()
    }
  }, [clickDevice])
  useMqttDevicemng({ code: clickDevice?.deviceCode, setDeviceMqList })
  return (
    <div className="point-data-warp ">
      <div className="echart-content-top">
        <div className="table-contanier">
          <div className="table-contanier-head">遥测量</div>
          <div className="table-contanier-content">
            {yaoCe.length ? (
              yaoCe.map((item) => {
                return (
                  <div className="clo-item">
                    <span>{`${item.pointDesc}: ${`${deviceMqList?.[item.pointName]}` === "undefined" ? "-" : `${deviceMqList?.[item.pointName]}` || "-"} ${item.unit || ""}`}</span>
                  </div>
                )
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
        <div className="table-contanier">
          <div className="table-contanier-head">遥信量</div>
          <div className="table-contanier-content">
            {yaoXin.length ? (
              yaoXin?.map((item) => {
                return (
                  <div className="clo-item">
                    <span
                      style={{
                        background:
                          `${deviceMqList?.[item.pointName]}` === "undefined"
                            ? "#c5c4c4"
                            : deviceMqList?.[item.pointName]
                              ? "red"
                              : "green",
                        color: `${deviceMqList?.[item.pointName]}` === "undefined" ? "black" : "var(--fontcolor)",
                      }}
                    >{`${item?.pointDesc}`}</span>
                  </div>
                )
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      </div>
      <div className="echart-content-bottom">
        <div className="table-contanier">
          <div className="table-contanier-head">执行日志</div>
          <div className="table-contanier-content">
            <CustomTable
              rowKey="operatorTime"
              loading={loading}
              limitHeight
              columns={CONTROL_GRID_COLUMNS}
              dataSource={dataSource}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
