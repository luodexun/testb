/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 16:56:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-27 15:39:21
 * @Description:
 */
import { ITbColAction } from "@/components/action-buttons/types"
import { IDeviceData } from "@/types/i-device"
import { judgeNull } from "@/utils/util-funs"
import { ColumnsType } from "antd/es/table"

export function SIT_DEVICE_COLUMNS(config): ColumnsType<IDeviceData> {
  const { onClick, deviceType } = config
  const arr: any =
    deviceType === "PVDCB"
      ? Array.from({ length: 24 }, (_, idx) => ({
          dataIndex: `Current${idx + 1}`,
          title: (
            <div>
              I<sub>{idx + 1}</sub>
            </div>
          ),
          align: "center",
          width: 90,
          render: (text, record) => (
            <span style={{ color: text === 0 ? "red" : "var(--white-color)" }}>{judgeNull(text, 1, 2, "-")}</span>
          ),
        }))
      : []
  return [
    { dataIndex: "row_idx", title: "序号", align: "center", width: 70 },
    {
      dataIndex: "deviceName",
      title: "设备名称",
      width: deviceType === "PVDCB" ? 120 : "none",
      render: (text, record) => (
        <span style={{ cursor: "pointer" }} onClick={() => onClick(record, text)}>
          {record.deviceName}
        </span>
      ),
    },
    ...arr,
  ]
}
