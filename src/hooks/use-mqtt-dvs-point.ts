/*
 * @Author: chenmeifeng
 * @Date: 2024-08-12 10:11:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-26 15:22:19
 * @Description:
 */
import { getOtherMqttDvs } from "@configs/mqtt-info.ts"
import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import CustomMqtt from "@utils/custom-mqtt.ts"
import { createUUID, isEmpty, validResErr } from "@utils/util-funs.tsx"
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react"

import { IBoostMQData, IBoostMQDataRes } from "@/types/i-boost"
import { TDvsQxzData } from "@/types/i-device"

interface IParams {
  deviceType: string
  deviceCode?: string
  stationCode?: string
  setPointData?: Dispatch<SetStateAction<IBoostMQData>>
}

// const { publicTopic, topicSuffix, uri } = WITH_PUBLIC_WS_TOPIC["qxz"]

const DEF_OPT = { method: "get/post", header: "" }

function dealDvsPointMqRes(mqData: IBoostMQDataRes): IBoostMQData | any {
  if (!mqData) return null
  const { payload } = mqData
  if (validResErr(payload) || isEmpty(payload.data)) return null
  return payload.data as IBoostMQData | TDvsQxzData
}
const timeout = parseInt(process.env.VITE_MQTT_TIMEOUT)
export default function useMqttDvsPoint(params: IParams) {
  const { deviceType, deviceCode, stationCode, setPointData } = params || {}
  const mqttDataRef = useRef(new CustomMqtt())
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2 秒
  const timer = useRef(null)

  const mqttBasisRef = useMemo(() => {
    return getOtherMqttDvs(deviceType)
  }, [deviceType])
  useEffect(() => {
    const mqtt = mqttDataRef.current
    const topic = `${mqttBasisRef.topicSuffix}/${createUUID()}`
    if (!reload || !mqtt || !deviceType) return () => mqtt?.unsubscribe(topic)
    const parameter = JSON.stringify({ code: deviceCode || "", stationCode })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setReload(false)
    }, timeout)
    mqtt.connect(
      {
        topic,
        callback: (mqData) => {
          const theMqData = dealDvsPointMqRes(mqData as IBoostMQDataRes)
          clearTimeout(timer.current)
          // if (!theMqData) return
          setPointData?.(theMqData)
          setReload(false)
        },
      },
      { publicTopic: mqttBasisRef.publicTopic, payload: { uri: mqttBasisRef.uri, ...DEF_OPT, parameter } },
    )
    return () => {
      clearTimeout(timer.current)
      mqtt?.unsubscribe(topic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, mqttBasisRef])
}
