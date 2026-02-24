/*
 * @Author: chenmeifeng
 * @Date: 2024-09-11 15:47:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-25 16:55:03
 * @Description: 数据质量
 */
import { tableSortByKey } from "@/utils/table-funs"
import { ColumnsType } from "antd/es/table"

export const QUALITY_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (_v, _r, index) => index + 1 },
  {
    dataIndex: "stationName",
    title: "场站",
    align: "center",
  },
  {
    dataIndex: "collectionCoverageRate",
    title: "采集覆盖率%",
    align: "center",
    sorter: tableSortByKey("collectionCoverageRate"),
    render: (text) => <span style={{ color: text >= 90 ? "var(--label-color)" : "var(--fault)" }}>{text}</span>,
  },
  {
    dataIndex: "dataIntegrityRate",
    title: "数据完整率%",
    align: "center",
    sorter: tableSortByKey("dataIntegrityRate"),
    render: (text) => <span style={{ color: text >= 95 ? "var(--label-color)" : "var(--fault)" }}>{text}</span>,
  },
  {
    dataIndex: "dataQualityRate",
    title: "数据合规率%",
    align: "center",
    sorter: tableSortByKey("dataQualityRate"),
    render: (text) => <span style={{ color: text >= 95 ? "var(--label-color)" : "var(--fault)" }}>{text}</span>,
  },
  {
    dataIndex: "communicationReliabilityRate",
    title: "通讯正常率%",
    align: "center",
    sorter: tableSortByKey("communicationReliabilityRate"),
    render: (text) => <span style={{ color: text >= 95 ? "var(--label-color)" : "var(--fault)" }}>{text}</span>,
  },
  {
    dataIndex: "fileUploadRate",
    title: "文件上传率%",
    align: "center",
    sorter: tableSortByKey("fileUploadRate"),
    render: (text) => <span style={{ color: text >= 95 ? "var(--label-color)" : "var(--fault)" }}>{text}</span>,

    // render: (_, record) => {
    //   return parseNum((record.receivedDataCount / record.expectedDataCount) * 100) || null
    // },
  },
]

export const DEVICE_DATA_ERROR = [
  { key: "collectionCoverageErrorDevice", label: "采集覆盖率异常设备数", rate: "collectionCoverageErrorDeviceRate" },
  { key: "dataIntegrityErrorDevice", label: "数据完整率异常设备数", rate: "dataIntegrityErrorDeviceRate" },
  { key: "dataQualityErrorDevice", label: "数据合规率异常设备数", rate: "dataQualityErrorDeviceRate" },
  // { key: "df3", label: "发电量异常设备数" },
  // { key: "df4", label: "功率预测调度上报率" },
  // { key: "df5", label: "AGC与AVC上报率" },
]
