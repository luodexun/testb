/*
 * @Author: chenmeifeng
 * @Date: 2024-07-31 11:16:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-31 11:17:45
 * @Description:
 */
import { IBrandData } from "@/types/i-screen"

export interface IModelInfo {
  [deviceType: string]: {
    [modelName: string]: IBrandData
  }
}
