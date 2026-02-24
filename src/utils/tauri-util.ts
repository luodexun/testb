import { invoke } from "@tauri-apps/api/tauri"

export type TauriMaqttConnectOptions = {
  username: string
  password?: string
  protocol: string
  id: string
  host: string
  path: string
  port: number
}
export async function tauri_mqtt_connect({
  username,
  password = "",
  protocol,
  id,
  host,
  path,
  port,
}: TauriMaqttConnectOptions) {
  console.log(`【tauri】 tauri_mqtt_connect`)
  return invoke("mqtt_connect", {
    id,
    port,
    host,
    username,
    password,
  })
}

//
export async function tauri_mqtt_subscribe(topic: string) {
  console.log(`【tauri】 tauri_mqtt_subscribe:${topic}`)
  return invoke("mqtt_subscribe_topic", { topic })
}

export async function tauri_mqtt_unsubscribe(topic: string) {
  console.log(`【tauri】 tauri_mqtt_unsubscribe:${topic}`)
  return invoke("mqtt_unsubscribe_topic", { topic })
}

export async function tauri_mqtt_publish(
  topic: string,
  publish_data: { destination: string; payload: IApiItem | IPayload },
) {
  const message = JSON.stringify(publish_data)
  console.log(`【tauri】 tauri_mqtt_publish:${topic},${message}`)
  return invoke("mqtt_publish_message", { topic, message })
}
export async function tauri_mqtt_disconnect() {
  console.log(`【tauri】 tauri_mqtt_disconnect`)
  return invoke("mqtt_disconnect")
}
