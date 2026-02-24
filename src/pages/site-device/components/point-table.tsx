import "./point-drawer.less"

import { useEffect, useRef, useState } from "react"

import MonitorNoPageTableTab from "@/components/device-point-tab/no-page-tabs"
import useMqttDvsPoint from "@/hooks/use-mqtt-dvs-point"
import { IDvsSystemTelemetryTableData } from "@/pages/device-part-monitor/types"
import { IDeviceData, IDvsMeasurePointData } from "@/types/i-device"
import { getDvsMeasurePointsData } from "@/utils/device-funs"
interface IConvertInfo {
  includesPoint: string[]
  keyValueMap: {
    [key: string | number]: string
  }
}
interface IProps {
  clickDevice?: IDeviceData
  needConvert?: Array<IConvertInfo>
}
const pointTest = {
  SpdStatus: true,
  // SpdStatus111: false,
  DcVoltage: 663.3,
  Current14: 0.3,
  THXF_Other_Ra_F32_1: 3.0,
  THXF_Other_Ra_F32_3: 1,
  THXF_Other_Ra_F32_3674: 4564,
}
const yaoxin = [
  {
    id: 1,
    modelId: 1, //型号id
    pointName: "SpdStatus", //测点编码
    pointDesc: "安全链风机", //测点描述
    pointType: "2", //测点类型： 2遥测  1遥信
    systemId: 101, //子系统id
    coefficient: 1.0, //测点系数
    unit: null, //测点单位
    maximum: 1.0,
    minimum: 0.0,
  },
  {
    id: 2,
    modelId: 1, //型号id
    pointName: "SpdStatus111", //测点编码
    pointDesc: "安全链风机111", //测点描述
    pointType: "2", //测点类型： 2遥测  1遥信
    systemId: 101, //子系统id
    coefficient: 1.0, //测点系数
    unit: null, //测点单位
    maximum: 1.0,
    minimum: 0.0,
  },
]
const yaoce = [
  {
    id: 1,
    modelId: 1, //型号id
    pointName: "THXF_Other_Ra_F32_1", //测点编码
    pointDesc: "安全链风机转速正常", //测点描述
    pointType: "2", //测点类型： 2遥测  1遥信
    systemId: 101, //子系统id
    coefficient: 1.0, //测点系数
    unit: "KM", //测点单位
    maximum: 1.0,
    minimum: 0.0,
  },
  {
    id: 2,
    modelId: 1, //型号id
    pointName: "THXF_Other_Ra_F32_3", //测点编码
    pointDesc: "安全链", //测点描述
    pointType: "2", //测点类型： 2遥测  1遥信
    systemId: 101, //子系统id
    coefficient: 1.0, //测点系数
    unit: null, //测点单位
    maximum: 1.0,
    minimum: 0.0,
  },
  {
    id: 3,
    modelId: 1, //型号id
    pointName: "THXF_Other_Ra_F32_3674", //测点编码
    pointDesc: "安全链222", //测点描述
    pointType: "2", //测点类型： 2遥测  1遥信
    systemId: 101, //子系统id
    coefficient: 1.0, //测点系数
    unit: null, //测点单位
    maximum: 1.0,
    minimum: 0.0,
  },
]
export default function PointTabs(props: IProps) {
  const { clickDevice, needConvert } = props
  const [dataSource, setDataSource] = useState<IDvsSystemTelemetryTableData[]>([]) // 遥测展示数据
  const [teleindications, setTeleindications] = useState<IDvsSystemTelemetryTableData[]>([]) // 遥信展示数据

  const [telemetryPtData, setTelemetryPtData] = useState<IDvsMeasurePointData[]>([]) // 遥测
  const [signalingPtData, setSignalingPtData] = useState<IDvsMeasurePointData[]>([]) // 遥信
  const [realtimePointData, setRealtimePointData] = useState(null)
  useMqttDvsPoint({
    deviceType: clickDevice?.deviceType?.toLowerCase(),
    deviceCode: clickDevice?.deviceCode,
    setPointData: setRealtimePointData,
  })
  const getDevPoints = async () => {
    const res = await getDvsMeasurePointsData({ modelId: clickDevice.modelId })
    setTelemetryPtData(res.filter((i) => i.pointType === "2"))
    setSignalingPtData(res.filter((i) => i.pointType === "1"))
  }
  useEffect(() => {
    if (!telemetryPtData?.length) return
    const transData: IDvsSystemTelemetryTableData[] = telemetryPtData?.map((i) => {
      const value = realtimePointData?.[i.pointName]
      let actualShowValue = value
      if (needConvert) {
        const keyValueMap = needConvert?.find((j) => j.includesPoint?.includes(i.pointName))?.keyValueMap || null
        actualShowValue = keyValueMap ? keyValueMap[value] : value
      }
      const isOverState = i.maximum < (value as number) || (value as number) < i.minimum ? true : false
      return {
        id: `${i.pointName}_${i.pointDesc}`,
        name: i.pointDesc,
        pointName: i.pointName,
        modelId: i.modelId,
        value: actualShowValue,
        className: "no",
        unit: i.unit,
        isOverState: isOverState,
        color: isOverState ? "var(--fault)" : "var(--white-color)",
        maximum: i.maximum,
        minimum: i.minimum,
      }
    })
    setDataSource(transData)
  }, [telemetryPtData, realtimePointData, needConvert])
  useEffect(() => {
    if (!signalingPtData?.length) return
    const transData: IDvsSystemTelemetryTableData[] = signalingPtData?.map((i) => {
      const value = realtimePointData?.[i.pointName]
      let className: "no" | "red" | "blue" | boolean
      // className = typeof value === "undefined" ? "no" : (value as boolean)
      // className = className ? "red" : "blue"
      className = typeof value === "undefined" ? "no" : value ? "red" : "blue"
      return {
        id: `${i.pointName}_${i.pointDesc}`,
        name: i.pointDesc,
        pointName: i.pointName,
        modelId: i.modelId,
        value: value,
        className: className,
        unit: i.unit,
        maximum: i.maximum,
        minimum: i.minimum,
      }
    })
    setTeleindications(transData)
  }, [signalingPtData, realtimePointData])
  useEffect(() => {
    if (!clickDevice) return
    setTelemetryPtData([])
    setSignalingPtData([])
    setDataSource([])
    setTeleindications([])
    getDevPoints()
  }, [clickDevice])
  return <MonitorNoPageTableTab device={clickDevice} data={dataSource} teleindications={teleindications} />
}
