/*
 * @Author: chenmeifeng
 * @Date: 2024-12-31 10:26:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-31 16:29:39
 * @Description:
 */
import "./index.less"

import NXCommonBox from "../common-box"
import { useEffect, useMemo, useRef, useState } from "react"
import { IAgvcInfo, IAgvcMQDataMap } from "@/types/i-agvc"
import { AtomStation } from "@/store/atom-station"
import { useAtomValue } from "jotai"
import useMqttAgvc from "@/hooks/use-mqtt-agvc"
import { doBaseServer } from "@/api/serve-funs"
import { parseNum, validResErr } from "@/utils/util-funs"
import { Progress } from "antd"
import { AGC_COLUMNS } from "../../configs"

export default function NXAgc() {
  const [dataSource, setDataSource] = useState<IAgvcInfo[]>()
  const [agvcMqttData, setAgvcMqttData] = useState<IAgvcMQDataMap>()
  const [deviceList, setDeviceList] = useState([])
  const { stationMap, stationList } = useAtomValue(AtomStation)
  useMqttAgvc({ isStart: true, deviceCode: "", setAgvcMqttData })

  const getDeviceList = async () => {
    const params = {
      deviceType: "AGVC",
    }
    const res = await doBaseServer("queryDevicesDataByParams", params)
    if (validResErr(res)) return
    setDeviceList(res)
  }

  const processColor = useRef((info) => {
    return {
      "0": info < 30 ? "rgba(169, 255, 1, 1)" : info < 80 ? "rgba(255, 217, 0, 1)" : "rgba(255, 187, 127, 1)",
      "100": info < 30 ? "rgba(0, 200, 14, 1)" : info < 80 ? "rgba(255, 165, 77, 1)" : "rgba(216, 48, 8, 1)",
    }
  })

  useEffect(() => {
    if (!agvcMqttData || !stationList?.length) return
    // 先获取所有场站，根据mqtt返回的数据得出哪些场站没有数据，没数据的所有字段用“-”表示
    const getAllStationList = [] // 所有所有场站中的数据
    const actualData = Object.values(agvcMqttData).map((mqData) => {
      Object.keys(mqData).forEach((field) => {
        mqData[field] = parseNum(mqData[field], 2, mqData[field])
      })
      mqData.stationName = stationMap?.[mqData.stationCode]?.shortName || mqData.stationCode
      mqData.voltRate = parseNum((mqData.realTimeGirdVolt * 100) / (mqData.AVCVoltageOrderBySchedule || 1))
      mqData.rate = parseNum(
        (mqData.realTimeTotalActivePowerOfSubStation * 100) / (mqData.AGCActivePowerOrderBySchedule || 1),
      )
      mqData.deviceId = deviceList?.find((i) => i.deviceCode === mqData.deviceCode)?.deviceId
      mqData.deviceName = deviceList?.find((i) => i.deviceCode === mqData.deviceCode)?.deviceName
      return mqData
    })

    // 获取所有mqtt未返回中存在的场站
    stationList.forEach((i, index) => {
      const findStation = actualData.find((j) => j.stationCode == i.stationCode)
      const deviceId = deviceList?.find((j) => j.stationCode === i.stationCode)?.deviceId
      const deviceName = deviceList?.find((j) => j.stationCode === i.stationCode)?.deviceName
      if (i.stationCode === findStation?.stationCode) {
        getAllStationList.push({
          ...findStation,
          deviceId,
          deviceName,
          index: index + 1,
        })
      } else {
        getAllStationList.push({
          stationCode: i.stationCode,
          stationName: i.shortName,
          deviceId,
          deviceName,
          index: index + 1,
        })
      }
    })
    setDataSource(getAllStationList)
  }, [agvcMqttData, stationMap, deviceList])
  useEffect(() => {
    getDeviceList()
  }, [])
  return (
    <NXCommonBox title="AGC数据">
      <div className="nx-agc">
        <div className="nx-agc-title">
          {AGC_COLUMNS?.map((i) => {
            return (
              <div className="title-item" key={i.key} style={{ width: i.width, textAlign: i.align || "center" }}>
                <span className="name">{i.name}</span>
              </div>
            )
          })}
        </div>
        <div className="nx-agc-body">
          {dataSource?.length &&
            dataSource?.map((item) => {
              return (
                <div className="agc-row" key={item.stationCode}>
                  {AGC_COLUMNS?.map((i) => {
                    return (
                      <div
                        className="agc-cell"
                        key={i.key}
                        style={{ width: i.width, justifyContent: i.align || "center" }}
                      >
                        {i.type === "process" ? (
                          <Progress
                            percent={item[i.key]}
                            strokeColor={processColor.current(item[i.key])}
                            trailColor="rgba(216, 216, 216, 0.24)"
                            size="small"
                          />
                        ) : i.type === "text" ? (
                          <span className="name">{item[i.key]}</span>
                        ) : (
                          <span
                            className="icon"
                            style={{ backgroundColor: item[i.key] ? "#FE524D" : "#56E540" }}
                          ></span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
        </div>
      </div>
    </NXCommonBox>
  )
}
