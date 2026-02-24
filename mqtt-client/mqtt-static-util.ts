import MqttClientBase from "./mqtt-client-base"

interface IMqttStaticUtil {
  mq: MqttClientBase
  mainWindowSend: (name: string, ...set: any) => void
  init: (mqttModule: any, options: IMqttClient) => void
}

const MqttStaticUtil: IMqttStaticUtil = {
  mq: null,
  mainWindowSend: null,
  init: (mqttModule: any, options: IMqttClient) => {
    if (MqttStaticUtil.mq) return

    MqttStaticUtil.mq = new MqttClientBase(options)
    MqttStaticUtil.mq.mqttConnect(mqttModule)
    MqttStaticUtil.mq.initEventListeners()
  },
}

export default MqttStaticUtil
