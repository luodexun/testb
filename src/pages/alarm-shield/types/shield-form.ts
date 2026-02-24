import { TDeviceType } from "@/types/i-config"

/*
 * @Author: chenmeifeng
 * @Date: 2024-03-06 09:55:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-01 14:03:00
 * @Description:
 */
export interface TShieldForm {
  shieldType: string
  stationId: number // 场站ID
  deviceType: TDeviceType
  modelId: number // 设备型号ID
  deviceId: number // 设备ID
  alarmId: number // 告警ID
  enableFlag?: string // 是否屏蔽, 1屏蔽 0取消屏蔽
  createBy?: string // 创建人
  cancelTime?: number
}
export type TShieldFmItemName = keyof TShieldForm
