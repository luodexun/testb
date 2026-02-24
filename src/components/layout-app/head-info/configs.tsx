/*
 * @Author: xiongman
 * @Date: 2023-10-19 14:11:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-22 15:17:57
 * @Description:
 */

import { ColumnsType } from "antd/es/table/index"
import classnames from "classnames"
import { ReactNode } from "react"

import { ITbColAction } from "@/components/action-buttons/types.ts"
import CommonTreeSelect from "@/components/common-tree-select/index.tsx"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import StationTreeSelect from "@/components/station-tree-select/index.tsx"
import { day4Y2S } from "@/configs/time-constant.ts"
import { IDvsStateDetail } from "@/types/i-device.ts"
import { getTableActColumn } from "@/utils/table-funs.tsx"
import { uDate } from "@/utils/util-funs.tsx"

import { IComlossData, IHeadInfoIconInfo, TComlossTbActInfo, TUserActKey } from "./types.ts"
export const IS_ELEC_ENV = process.env["VITE_IS_LINUX"] === "1"
function dropDownItem(icon: string, title: string) {
  return (
    <>
      <i className={classnames("icon-bg-wrap", icon)} />
      <span>{title}</span>
    </>
  )
}

interface IUserActItem {
  key: TUserActKey
  label: ReactNode
}

export const USER_ACT_ITEMS: IUserActItem[] = [
  { label: dropDownItem("icon-font icon-edit", "修改密码"), key: "edit-psw" },
  { label: dropDownItem("icon-font icon-loginout", "退出登录"), key: "loginout" },
]

export const ICON_BTN_LIST: IHeadInfoIconInfo[] = [
  { field: "searchSt", title: "场站搜索" },
  { field: "last", title: "返回上级" },
  { field: "next", title: "下一级" },
  { field: "voice", title: "告警播报", icon: (checked: boolean) => (checked ? "voice_true" : "voice_false") },
  { field: "alarm", title: "告警查看" },
  { field: "comloss", title: "电气通讯中断数" },
  { field: "carousel", title: "菜单轮播" },
  { field: "help", title: "帮助" },
  { field: "user", title: "用户操作" },
]

export const COMLOSS_COLUMN_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { label: "批量确认", name: "ensure" },
]

export const COMLOSS_COLUMN_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: CommonTreeSelect,
    name: "deviceType",
    label: "设备类型",
    props: {
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      style: { minWidth: "10em" },
      placeholder: "全部",
    },
  },
  {
    type: CommonTreeSelect,
    name: "mainState",
    label: "大状态",
    props: {
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
]

export function COMLOSS_COLUMN(config: ITbColAction<TComlossTbActInfo, IDvsStateDetail>): ColumnsType<IDvsStateDetail> {
  const { onClick } = config
  return [
    { dataIndex: "row_index", title: "序号", align: "center", width: 50 },
    { dataIndex: "stationName", title: "场站" },
    { dataIndex: "deviceTypeName", title: "设备类型" },
    { dataIndex: "deviceName", title: "设备" },
    { dataIndex: "stateName", title: "状态" },
    { dataIndex: "time", title: "开始时间", render: (text) => <span>{uDate(text, day4Y2S)}</span> },
    ...getTableActColumn<IDvsStateDetail, TComlossTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          confirmBtn: {
            disabled: record.firstFlag !== 1,
            danger: false,
            color: "primary",
          },
        },
        confirmProps: { title: "确认首发状态" },
      }),
      null,
      { width: 150 },
    ),
  ]
}

const TABLE_ACTION = [{ key: "confirmBtn", label: "确认" }]
