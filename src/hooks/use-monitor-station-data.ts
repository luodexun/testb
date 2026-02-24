/*
 * @Author: xiongman
 * @Date: 2023-09-21 13:52:13
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-21 13:52:13
 * @Description: 获取和处理场站监控运行数据的hooks
 */

import { MS_SCEND_4 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { getMonitorStnInfoData } from "@pages/area-matrix/methods"
import { AtomStnMonitorDataMap } from "@store/atom-run-station.ts"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

import { IDeviceData } from "@/types/i-device.ts"

export default function useMonitorStationData(deviceType: IDeviceData["deviceType"][]) {
  const setStnMonitorDataMap = useSetAtom(AtomStnMonitorDataMap)
  const [reload, setReload] = useRefresh(MS_SCEND_4) // 4 秒

  useEffect(() => {
    if (!reload || !deviceType?.length) return

    const serveArr = deviceType.map((deviceType) => getMonitorStnInfoData({ deviceType }))
    // 将场站基础数据按设备类型分组
    Promise.all(serveArr)
      .then((dataArr) => {
        setStnMonitorDataMap((prev) => {
          if (!prev) prev = {}
          deviceType.forEach((dvsType, index) => (prev[dvsType] = dataArr[index]))
          return { ...prev }
        })
      })
      .then(() => setReload(false))
  }, [deviceType, reload, setReload, setStnMonitorDataMap])
}
