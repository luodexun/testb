/*
 * @Author: xiongman
 * @Date: 2023-09-26 11:35:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-06 10:19:31
 * @Description: 区域中心-矩阵监视-整体运行参数
 */

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"
import { useCallback, useContext, useMemo } from "react"

import MetricTag from "@/components/metric-tag"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IDeviceData } from "@/types/i-device.ts"

const DVS_DETAIL_INFO: IDvsRunStateInfo<keyof IDeviceData, string>[] = [
  { title: "场站名称", field: "stationFullName" },
  { title: "设备名称", field: "deviceName", compType: "select" },
  { title: "设备型号", field: "model" },
  { title: "容量", field: "ratedPower", unit: UNIT.POWER_K },
  { title: "投产日期", field: "operatDateStr" },
]

export default function DeviceInfoBox() {
  const { device, setDevice, deviceList } = useContext(DvsDetailContext)
  const getSelection = (changedValue, compType) => {
    if (compType !== "select") return
    const devices = deviceList.find((i) => i.deviceId == changedValue)
    setDevice(devices)
  }
  const deviceOptions = useMemo(() => {
    const result = deviceList.map((i) => {
      return {
        ...i,
        value: i.deviceId,
        label: i.deviceName,
      }
    })
    return result
  }, [deviceList])
  const filterOption = useCallback(
    (input: string, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    [device],
  )

  return (
    <div className="device-info-box">
      {DVS_DETAIL_INFO.map(({ field, title, unit, compType }) => {
        return (
          <MetricTag
            key={field}
            value={device?.[field] ?? "-"}
            unit={unit}
            title={title}
            compType={compType}
            onClickValue={(e) => getSelection(e, compType)}
            selectCompProps={{
              showSearch: true,
              optionFilterProp: "children",
              filterOption: filterOption,
              options: deviceOptions,
            }}
            className="site-info-tag"
          />
        )
      })}
    </div>
  )
}
