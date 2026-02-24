/*
 * @Author: chenmeifeng
 * @Date: 2023-10-24 18:12:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-14 14:01:41
 * @Description:
 */
import sw02 from "@/assets/weather/sw02.png"
import sw03 from "@/assets/weather/sw03.png"
import sw04 from "@/assets/weather/sw04.png"
export const towerHeightList = [
  { name: "10米风速", style: { bottom: "21%", left: "13%" }, unit: "m/s", key: "WindTower10mWindSpeed", value: "0" },
  { name: "10米风向", style: { bottom: "21%", left: "71%" }, unit: "°", key: "WindTower10mWindDirection", value: "0" },
  { name: "30米风速", style: { bottom: "35%", left: "16%" }, unit: "m/s", key: "WindTower30mWindSpeed", value: "0" },
  { name: "30米风向", style: { bottom: "35%", left: "68%" }, unit: "°", key: "WindTower30mWindDirection", value: "0" },
  { name: "50米风速", style: { bottom: "51%", left: "19%" }, unit: "m/s", key: "WindTower50mWindSpeed", value: "0" },
  { name: "50米风向", style: { bottom: "51%", left: "65%" }, unit: "°", key: "WindTower50mWindDirection", value: "0" },
  { name: "70米风速", style: { bottom: "63%", left: "22%" }, unit: "m/s", key: "WindTower70mWindSpeed", value: "0" },
  { name: "70米风向", style: { bottom: "63%", left: "63%" }, unit: "°", key: "WindTower70mWindDirection", value: "0" },
  { name: "轮毂风速", style: { bottom: "77%", left: "25%" }, unit: "m/s", key: "WindTowerHubWindSpeed", value: "0" },
  { name: "轮毂风向", style: { bottom: "77%", left: "60%" }, unit: "°", key: "WindTowerHubWindDirection", value: "0" },
]
export const towerBasicList = [
  { name: "环境温度", icon: sw04, key: "SurfaceTemp", unit: "°C", value: "1" },
  { name: "环境气压", icon: sw02, key: "SurfacePressure", unit: "kPa", value: "1" },
  { name: "环境湿度", icon: sw03, key: "SurfaceRelativeHumidity", unit: "%rh", value: "1" },
]
