/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-16 11:04:55
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageDeviceType, StorageStnDvsType } from "@/configs/storage-cfg"
import { AVCChartSeries } from "@/pages/site-agvc/configs/trend-chart"
import { getStorage, uDate } from "@/utils/util-funs"

import { IDeviceListData } from "../types/index"
import EditableCellDate from "../components/edit-date-picker"
import EditableCell from "../components/edit-input"
import EditableCellSelect from "../components/edit-select"

export const deviceTypesOfSt = getStorage(StorageStnDvsType)
export const alldeviceTypes = getStorage(StorageDeviceType)

export const ST_MANAGE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "save", label: "编辑" }]

export const ST_MANAGE_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      needFirst: true,
      needId: true,
      disabled: false,
    },
  },
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "设备类型",
    props: {
      needFirst: true,
      disabled: false,
      options: [],
      placeholder: "请选择设备类型",
      style: { minWidth: "10em" },
    },
  },
  // {
  //   type: SelectWithAll,
  //   name: "deviceIds",
  //   label: "设备",
  //   props: {
  //     // needFirst: true,
  //     disabled: false,
  //     showAll: true,
  //     options: [],
  //     placeholder: "请选择设备",
  //     style: { minWidth: "10em" },
  //     mode: "multiple",
  //   },
  // },
]

export const DEVICE_ATT_COLUMNS: ColumnsType<IDeviceListData> = [
  { dataIndex: "row_idx", title: "序号", width: 60 },
  { dataIndex: "regionComShortName", title: "区域公司" },
  { dataIndex: "maintenanceComShortName", title: "检修公司" },
  { dataIndex: "projectComShortName", title: "项目公司" },
  { dataIndex: "stationName", title: "场站" },
  { dataIndex: "periodName", title: "期次" },
  { dataIndex: "lineName", title: "线路" },
  { dataIndex: "deviceName", title: "设备" },
  { dataIndex: "deviceType", title: "设备类型" },
]

export function DEVICE_DEFAULT_TEXT_COLUMN(deviceType): ColumnsType<IDeviceListData> {
  const arr =
    deviceType === "WT" || deviceType === "W"
      ? [
          { dataIndex: "rated_wspd", title: "额定风速", render: (text, record) => record.deviceTags?.rated_wspd || "" },
          {
            dataIndex: "cut_in_wspd",
            title: "切入风速",
            render: (text, record) => record.deviceTags?.cut_in_wspd || "",
          },
          {
            dataIndex: "cut_out_wspd",
            title: "切出风速",
            render: (text, record) => record.deviceTags?.cut_out_wspd || "",
          },
          {
            dataIndex: "rotor_diameter",
            title: "风轮直径",
            render: (text, record) => record.deviceTags?.rotor_diameter || "",
          },
          {
            dataIndex: "blade_length",
            title: "叶片长度",
            render: (text, record) => record.deviceTags?.blade_length || "",
          },
          { dataIndex: "hub_height", title: "轮毂高度", render: (text, record) => record.deviceTags?.hub_height || "" },
          { dataIndex: "type", title: "类型", render: (text, record) => record.deviceTags?.type || "" },
        ]
      : []
  const benchmark =
    deviceType === "WT" || deviceType === "W"
      ? [
          {
            dataIndex: "benchmark_flag",
            title: "标杆机组",
            render: (text, record) => record.deviceTags?.benchmark_flag || "",
          },
        ]
      : []
  const pvArr =
    deviceType === "PVINV" || deviceType === "S" || deviceType === "P"
      ? [
          {
            dataIndex: "array",
            title: "方阵",
            render: (text, record) => record?.array || "",
          },
        ]
      : []
  return [
    {
      dataIndex: "operation_code",
      title: "运营编号",
      render: (text, record) => record.deviceTags?.operation_code || "",
    },
    { dataIndex: "manufacturer", title: "厂家" },
    { dataIndex: "model", title: "型号" },
    { dataIndex: "rated_power", title: "顺序", render: (text, record) => record.deviceTags?.priority || "" },
    { dataIndex: "rated_power", title: "额定功率", render: (text, record) => record.deviceTags?.rated_power || "" },
    ...arr,
    ...pvArr,
    { dataIndex: "longitude", title: "经度", render: (text, record) => record.deviceTags?.longitude || "" },
    { dataIndex: "latitude", title: "纬度", render: (text, record) => record.deviceTags?.latitude || "" },
    { dataIndex: "altitude", title: "海拔高度", render: (text, record) => record.deviceTags?.altitude || "" },
    ...benchmark,
    { dataIndex: "install_date", title: "安装日期", render: (text, record) => record.deviceTags?.install_date || "" },
    { dataIndex: "grid_on_date", title: "并网日期", render: (text, record) => record.deviceTags?.grid_on_date || "" },
    { dataIndex: "operationDate", title: "转运营日期", render: (text) => uDate(text, "YYYY-MM-DD") },
    {
      dataIndex: "out_of_warranty_date",
      title: "出质保日期",
      render: (text, record) => record.deviceTags?.out_of_warranty_date || "",
    },
  ]
}

export const getDeviceColumns = (deviceType, setDataSource) => {
  const arr =
    deviceType === "WT" || deviceType === "W"
      ? [
          {
            dataIndex: "rated_wspd",
            title: "额定风速",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.rated_wspd}
                record={record}
                dataIndex="rated_wspd"
                setDataSource={setDataSource}
              />
            ),
          },
          {
            dataIndex: "cut_in_wspd",
            title: "切入风速",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.cut_in_wspd}
                record={record}
                dataIndex="cut_in_wspd"
                setDataSource={setDataSource}
              />
            ),
          },
          {
            dataIndex: "cut_out_wspd",
            title: "切出风速",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.cut_out_wspd}
                record={record}
                dataIndex="cut_out_wspd"
                setDataSource={setDataSource}
              />
            ),
          },
          {
            dataIndex: "rotor_diameter",
            title: "风轮直径",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.rotor_diameter}
                record={record}
                dataIndex="rotor_diameter"
                setDataSource={setDataSource}
              />
            ),
          },
          {
            dataIndex: "blade_length",
            title: "叶片长度",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.blade_length}
                record={record}
                dataIndex="blade_length"
                setDataSource={setDataSource}
              />
            ),
          },
          {
            dataIndex: "hub_height",
            title: "轮毂高度",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.hub_height}
                record={record}
                dataIndex="hub_height"
                setDataSource={setDataSource}
              />
            ),
          },
          {
            dataIndex: "type",
            title: "类型",
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.type}
                record={record}
                dataIndex="type"
                setDataSource={setDataSource}
              />
            ),
          },
        ]
      : []
  const benchmark =
    deviceType === "WT" || deviceType === "W"
      ? [
          {
            dataIndex: "benchmark_flag",
            title: "标杆机组",
            width: 75,
            render: (text, record) => (
              <EditableCellSelect
                value={record.deviceTags?.benchmark_flag}
                record={record}
                dataIndex="benchmark_flag"
                setDataSource={setDataSource}
                option={BENCHMARK_FLAG_OPTIONS}
              />
            ),
          },
        ]
      : []
  const pvEdit =
    deviceType === "WT" || deviceType === "S" || deviceType === "P"
      ? [
          {
            dataIndex: "array",
            title: "方阵",
            width: 75,
            render: (text, record) => (
              <EditableCell
                value={record.deviceTags?.array}
                record={record}
                dataIndex="array"
                setDataSource={setDataSource}
              />
            ),
          },
        ]
      : []
  return DEVICE_ATT_COLUMNS.concat([
    {
      dataIndex: "operation_code",
      title: "运营编号",
      render: (text, record) => (
        <EditableCell
          value={record.deviceTags?.operation_code}
          record={record}
          dataIndex="operation_code"
          setDataSource={setDataSource}
        />
      ),
    },
    { dataIndex: "manufacturer", title: "厂家" },
    { dataIndex: "model", title: "型号" },
    {
      dataIndex: "priority",
      title: "顺序",
      render: (text, record) => (
        <EditableCell
          value={record.deviceTags?.priority}
          dataIndex="priority"
          record={record}
          setDataSource={setDataSource}
        />
      ),
    },
    {
      dataIndex: "rated_power",
      title: "额定功率",
      render: (text, record) => (
        <EditableCell
          value={record.deviceTags?.rated_power}
          record={record}
          dataIndex="rated_power"
          setDataSource={setDataSource}
        />
      ),
    },
    ...arr,
    ...pvEdit,
    {
      dataIndex: "longitude",
      title: "经度",
      render: (text, record) => (
        <EditableCell
          value={record.deviceTags?.longitude}
          record={record}
          dataIndex="longitude"
          setDataSource={setDataSource}
        />
      ),
    },
    {
      dataIndex: "latitude",
      title: "纬度",
      render: (text, record) => (
        <EditableCell
          value={record.deviceTags?.latitude}
          record={record}
          dataIndex="latitude"
          setDataSource={setDataSource}
        />
      ),
    },
    {
      dataIndex: "altitude",
      title: "海拔高度",
      render: (text, record) => (
        <EditableCell
          value={record.deviceTags?.altitude}
          record={record}
          dataIndex="altitude"
          setDataSource={setDataSource}
        />
      ),
    },
    ...benchmark,
    {
      dataIndex: "install_date",
      title: "安装日期",
      width: 140,
      render: (text, record) => (
        <EditableCellDate
          value={record.deviceTags?.install_date}
          record={record}
          dataIndex="install_date"
          setDataSource={setDataSource}
        />
      ),
    },
    {
      dataIndex: "grid_on_date",
      title: "并网日期",
      width: 140,
      render: (text, record) => (
        <EditableCellDate
          value={record.deviceTags?.grid_on_date}
          record={record}
          dataIndex="grid_on_date"
          setDataSource={setDataSource}
        />
      ),
    },
    { dataIndex: "operationDate", title: "转运营日期", render: (text) => uDate(text, "YYYY-MM-DD") },
    {
      dataIndex: "out_of_warranty_date",
      title: "出质保日期",
      width: 140,
      render: (text, record) => (
        <EditableCellDate
          value={record.deviceTags?.out_of_warranty_date}
          record={record}
          dataIndex="out_of_warranty_date"
          setDataSource={setDataSource}
        />
      ),
    },
  ])
}
export const BENCHMARK_FLAG_OPTIONS = [{ value: "是" }, { value: "否" }]
