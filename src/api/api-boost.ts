/*
 * @Author: xiongman
 * @Date: 2023-10-24 10:18:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-24 11:04:21
 * @Description:
 */

import { IApiMapItem } from "@/types/i-api.ts"

const isElectronENV = process.env["VITE_CS"]
const isMqttProxyHttp = process.env["MQTT_PROXY_HTTP"]
const SERVE_NAME = `${process.env.VITE_ELE_SVG_DIR}`

export const boostElectApiMap: IApiMapItem = {
  getElecDiagramImg: {
    // url: isElectronENV || isMqttProxyHttp ? `${SERVE_NAME}/main.svg` : `${SERVE_NAME}/{stationCode}/{svgName}.svg`,
    // baseURL: isElectronENV || isMqttProxyHttp ? `` : `/`,
    url: `${SERVE_NAME}/{stationCode}/{svgName}.svg`,
    // baseURL: isElectronENV || isMqttProxyHttp ? `` : `/`,
    baseURL: isElectronENV || isMqttProxyHttp ? `` : `https://ness.crnewenergy.com.cn`,
    withCredentials: false,
    timeout: 5000,
    method: "get",
    headers: {
      "Content-Type": "image/svg+xml",
    },
    desc: "获取升压站电气图",
  },
  getAssetsFile: {
    url: `{filePath}`,
    baseURL: `/`,
    withCredentials: false,
    timeout: 5000,
    method: "get",
    desc: "获取assets的静态资源文件",
  },
}
