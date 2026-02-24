/*
 * @Author: xiongman
 * @Date: 2023-10-16 16:39:20
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-16 16:39:20
 * @Description: 风机运行详情-温度曲线-类型们
 */

// 设备测点温度查询参数
export interface IDvsSystemTempTrendParams {
  deviceCode: string
  systemId: number | string
}

// 设备测点温度数据
export interface IDvsSystemTempTrendData {
  data: {
    Time: 1697015075141
    deviceCode: "441882H01WT1101014"
    stationCode: "441882H01"
    sensor_2: 0.0
    sensor_1: 0.0
  }[]
  point: {
    pointName: "sensor_1"
    pointDesc: "塔基柜温度"
    pointType: "2"
    coefficient: 1.0
    unit: "℃"
  }[]
}
