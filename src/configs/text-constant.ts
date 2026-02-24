/*
 * @Author: xiongman
 * @Date: 2023-07-07 14:48:29
 * @LastEditors: xiongman
 * @LastEditTime: 2023-07-07 14:48:29
 * @Description: 提示、报错相关常量
 */

// 标题-操作
export const TEXT_ACTION = "操作"
// 提示-删除数据
export const DELETE_DATA = "确定删除该项？"
// 下载文件成功
export const DOWNLOAD_SUCCESS = "文件数据获取完成，请等待后台执行下载！"
// 下载文件失败
export const DOWNLOAD_ERROR = "下载文件失败!"

// 单位
export const UNIT = {
  // 进率 万
  EVO_W: "万",
  // 进率 亿
  EVO_Y: "亿",
  // 功率 MW
  POWER: "MW",
  // 功率 kW
  POWER_K: "kW",
  // 功率 吉瓦GW
  POWER_G: "GW",
  // 无功功率 kVar
  REACTIVE: "kVar",
  // 无功功率 MVar
  REACTIVE_M: "MVar",
  // 相电压 AVC
  PHASE_VOLAGE: "VAC",
  // 电流 A
  CURRENT: "A",
  // 电压 V
  VOLAGE: "V",
  // 电压 kV
  VOLAGE_K: "kV",
  // 频率 Hz
  FREQUENCY: "Hz",
  // 电量、电能 kWh
  ELEC: "kWh",
  // 电量、电能 万kWh
  ELEC_W: "万kWh",
  // 电量、电能 MWh
  ELEC_M: "MWh",
  // 百分比 %
  PERCENT: "%",
  // 风速 m/s
  WIND: "m/s",
  // 台
  COUNT: "台",
  // 个
  PIECE: "个",
  // 温度 ℃
  TEMPER: "℃",
  // 湿度 ％rh
  HUMIDITY: "％rh",
  // 气压 hPa
  PRESSURE: "hPa",
  // 辐射值,辐照度 W/m²
  RADIATE: "W/m²",
  // 辐射值,辐照度 W/m²
  RADIATEh: "kWh/㎡",
  // 转速 rpm
  ROTATE: "rpm",
  // 角度 °
  ANGLE: "°",
  // 方向角度 deg
  DIRECT_ANGLE: "deg",
  // 运行状态-正常
  RUN_STATE_ON: "正常",
  // 运行状态-异常
  RUN_STATE_ERR: "异常",
  // 自动状态-自动
  AUTO_STATE: "自动",
  // 自动状态-手动
  AUTO_STATE_MANUAL: "手动",
  // 启用状态-启用
  ENABLE_ON: "启用",
  // 启用状态-禁用
  ENABLE_OFF: "禁用",
}

// 千瓦与兆瓦，兆瓦与吉瓦的进率
export const EVO_POWER = 1000
// 判断是否使用进率的阈值
export const LARGER_W = 10000
// 判断是否使用进率的阈值
export const LARGER_Y = LARGER_W ** 2
// 是否需要大单位处理，true 需要，false 不需要
export const TRANS_LARGE_UNIT = Number.parseInt(process.env["VITE_LARGER_UNIT"] || "1") === 1
