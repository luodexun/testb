/*
 * @Author: chenmeifeng
 * @Date: 2023-10-13 10:35:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-08 11:00:57
 * @Description:
 */

import "./management.less"

import { TEnergyType } from "@pages/site-agvc/types"

import InfoCard from "@/components/info-card"
import { IAgvcMQDataMap } from "@/types/i-agvc.ts"
import { IDeviceData } from "@/types/i-device.ts"

import EnergyParam from "./energy-param.tsx"
import EnergyTrendChart from "./energy-trend-chart.tsx"

interface IProps {
  type: TEnergyType
  deviceCode: string
  dvsInfo: IDeviceData
  realtimeData?: IAgvcMQDataMap
}
const TITLE_MAP: Record<TEnergyType, string> = {
  AGC: "AGC有功调节",
  AVC: "AVC无功调节",
}

export default function Management(props: IProps) {
  const { deviceCode, realtimeData } = props
  // const [isStart, setIsStart] = useState(false)
  // const [agvcMqttData, setAgvcMqttData] = useState<IAgvcMQDataMap>()
  // useMqttAgvc({ deviceCode, setAgvcMqttData, isStart: isStart })
  // useEffect(() => {
  //   if (deviceCode) {
  //     setIsStart(true)
  //   }
  // }, [deviceCode])
  // AGC 参数，AGC 趋势， AVC 参数，AVC 趋势，
  // const test = {
  //   stationCapacity: 245,
  //   loadRate: 0.9,
  //   activePowerAdjustRate: 1.2,
  //   powerLimitDepth: 9,
  //   scheduleToCapacityRate: 0.07,
  //   powerLimitFlag: 245,
  //   AGCRemoteOperation: 1,
  // }
  return (
    <InfoCard title={TITLE_MAP[props.type]} className="energy-management">
      <EnergyParam {...props} data={realtimeData?.[deviceCode]} />
      <EnergyTrendChart {...props} />
    </InfoCard>
  )
}
