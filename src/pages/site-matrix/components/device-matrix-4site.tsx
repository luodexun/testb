/*
 * @Author: xiongman
 * @Date: 2023-10-24 15:42:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-18 16:59:49
 * @Description:
 */

import useMatrixDeviceList from "@hooks/use-matrix-device-list.ts"
import DeviceMatrixForType from "@pages/area-matrix/components/device-matrix-for-type.tsx"
import NamePanel from "@pages/area-matrix/components/name-panel.tsx"
import SiteInfoBox from "@pages/site-matrix/components/site-info-box.tsx"
import { useContext, useEffect, useMemo } from "react"

import { TDeviceType } from "@/types/i-config.ts"
import { IStationData } from "@/types/i-station.ts"
import { getHappeningAlarm } from "@/utils/device-funs"
import useInterval from "@/hooks/useInterval"
import DvsDetailContext from "@/contexts/dvs-detail-context"

interface IProps {
  station: IStationData
}
export default function DeviceMatrix4site(props: IProps) {
  const { station } = props

  const [reload, setReload] = useInterval(3000)
  const dvsTypeGroup = useMatrixDeviceList({ station })
  const dTypeList = useMemo(() => Object.keys(dvsTypeGroup || {}) as TDeviceType[], [dvsTypeGroup])
  const { setNeedShangdevice } = useContext(DvsDetailContext)
  const happeningAlarm = async () => {
    const params = {
      data: {
        stationIdList: [station.id],
        deviceTypeList: ["WT", "PVINV", "ESPCS"],
      },
      params: {
        pageNum: 1,
        pageSize: 1000,
      },
    }
    const res = await getHappeningAlarm(params)

    if (!res) return
    const devices = res?.map((i) => i.deviceId?.toString())
    setNeedShangdevice(devices)
    setReload(false)
  }
  useEffect(() => {
    if (!station?.id || !reload) return
    happeningAlarm()
  }, [station?.stationCode, reload])
  return (
    <>
      <SiteInfoBox typeList={dTypeList} station={station} />
      <NamePanel name={station?.fullName} option={station} className="site-name" />
      <div className="type-of-device-matrix">
        {dTypeList.map((deviceType) => (
          <DeviceMatrixForType
            key={`${station.id}_${deviceType}`}
            dvsType={deviceType}
            station={station}
            dvsList={dvsTypeGroup[deviceType]}
          />
        ))}
      </div>
    </>
  )
}
