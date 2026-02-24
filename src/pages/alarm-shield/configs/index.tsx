/*
 * @Author: chenmeifeng
 * @Date: 2024-03-05 14:15:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 15:15:21
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import SelectOrdinary from "@/components/select-ordinary"
import StationTreeSelect from "@/components/station-tree-select"
import { day4Y2S } from "@/configs/time-constant"
import { setAlarmColor } from "@/pages/alarm-history/methods"
import { uDate } from "@/utils/util-funs"

import EditableCell from "../components/edit-input"
import EditSelectCell from "../components/edit-select"
import { setDescColor } from "../methods"
import { IAlarmShieldData } from "../types"

export const ALARM_SHIELD_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "detail", label: "详情" },
  { name: "edit", label: "编辑" },
  // { name: "add", label: "新增屏蔽" },
  // { name: "cancel", label: "取消屏蔽" },
  { name: "search", label: "搜索" },
]

export const MODEL_ALARM_SHIELD_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN]
const resetLevelOpt = [
  { label: "禁止复位", value: "禁止复位" },
  { label: "远程复位", value: "远程复位" },
  { label: "就地复位", value: "就地复位" },
]

export const ALARM_SHIELD_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationIdList",
    label: "场站",
    props: {
      needFirst: true,
      style: { minWidth: "10em" },
      placeholder: "全部",
      needId: true,
    },
  },
  {
    type: SelectOrdinary,
    name: "deviceTypeList",
    label: "设备类型",
    props: {
      // needFirst: true,
      options: [],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: CommonTreeSelect,
    name: "deviceIdList",
    label: "设备",
    props: {
      multiple: true,
      placeholder: "全部",
      treeCheckable: true,
      style: { minWidth: "13em" },
    },
  },
]
export const alarm_shied_columns = (type, isEditState, setDataSource, optionMap) => {
  let columns: ColumnsType<IAlarmShieldData> = []
  const detailList = type
    ? [
        {
          dataIndex: "tags",
          title: "故障解释",
          // width: 400,
          render: (text, record) =>
            isEditState ? (
              <EditableCell value={record.tags?.condition} record={record} curkey="tags.condition" setDataSource={setDataSource} />
            ) : (
              <span>{record.tags?.condition || '-'}</span>
            ),
        },
      ]
    : []
  columns = [
    { dataIndex: "index", title: "序号", align: "center", width: 50 },
    { dataIndex: "stationDesc", title: "场站" },
    { dataIndex: "deviceTypeName", title: "设备类型" },
    { dataIndex: "deviceDesc", title: "设备" },
    { dataIndex: "deviceModel", title: "型号" },
    { dataIndex: "alarmId", title: "故障码" },
    {
      dataIndex: "alarmDesc",
      title: "故障描述",
      width: 400,
      render: (text, record) =>
        isEditState ? (
          <EditableCell value={text} record={record} curkey="alarmDesc" setDataSource={setDataSource} />
        ) : (
          <span style={{ color: setDescColor(record.isSeach) }}>{text}</span>
        ),
    },
    ...detailList,
    {
      dataIndex: "systemName",
      title: "归属系统",
      width: 120,
      render: (text, record) =>
        isEditState ? (
          <EditSelectCell
            value={record?.systemId}
            record={record}
            curkey="systemId"
            option={optionMap?.beSysOption}
            setDataSource={setDataSource}
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      dataIndex: "alarmLevelName",
      title: "告警等级",
      width: 120,
      render: (text, record) =>
        isEditState ? (
          <EditSelectCell
            value={record?.alarmLevelId}
            record={record}
            curkey="alarmLevelId"
            option={optionMap?.alarmLevelOption || []}
            setDataSource={setDataSource}
          />
        ) : (
          <span style={{ color: setAlarmColor(record) }}>{text}</span>
        ),
    },
    {
      dataIndex: "brakeLevelName",
      title: "停机等级",
      width: 120,
      render: (text, record) =>
        isEditState ? (
          <EditSelectCell
            value={record?.brakeLevelId}
            record={record}
            curkey="brakeLevelId"
            option={optionMap?.brakeLevelOption || []}
            setDataSource={setDataSource}
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      dataIndex: "resetLevel",
      title: "复位等级",
      width: 120,
      // render: (text, record) =>
      //   isEditState ? (
      //     <EditSelectCell
      //       value={record?.resetLevel}
      //       record={record}
      //       curkey="resetLevel"
      //       option={resetLevelOpt}
      //       setDataSource={setDataSource}
      //     />
      //   ) : (
      //     <span>{text}</span>
      //   ),
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: "resetNum",
      title: "允许复位次数",
      width: 120,
      // render: (text, record) =>
      //   isEditState ? (
      //     <EditableCell
      //       value={record?.resetNum}
      //       record={record}
      //       curkey="resetNum"
      //       setDataSource={setDataSource}
      //       cpnType="number"
      //     />
      //   ) : (
      //     <span>{text}</span>
      //   ),
      render: (text) => <span>{text}</span>,
    },
    // { dataIndex: "enableFlag", title: "是否屏蔽", render: (text) => <span>{text ? "是" : "否"}</span> },
    // { dataIndex: "blockBy", title: "屏蔽人" },
    // {
    //   dataIndex: "blockTime",
    //   title: "屏蔽时间",
    //   width: 120,
    //   render: (text) => <span>{uDate(text, day4Y2S, day4Y2S)}</span>,
    // },
  ]
  return columns
}

export const EXPLAIN_COLUMNS = { dataIndex: "brakeLevelNameSS", title: "故障解释" }
