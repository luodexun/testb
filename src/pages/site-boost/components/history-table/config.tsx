/*
 * @Author: chenmeifeng
 * @Date: 2025-03-11 14:26:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 14:29:48
 * @Description:
 */
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import { EXPORT_LIST1 } from "@/configs/option-const"
export const SVG_HTRY_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  {
    name: "export",
    label: "导出",
    btnType: "dropdown",
    dropdownProps: { menu: { items: EXPORT_LIST1 }, placement: "bottomLeft" },
  },
  { name: "batchCmomfirm", label: "批量确认" },
]
export const SITE_HSTY_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "systemId",
    label: "归属系统",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      mode: "multiple",
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "alarmLevelId",
    label: "告警等级",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      mode: "multiple",
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "brakeLevelId",
    label: "停机等级",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      mode: "multiple",
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "confirmFlag",
    label: "确认",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      mode: "multiple",
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [
        { value: "1", label: "已确认" },
        { value: "2", label: "未确认" },
      ],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 8 } },
    props: { showTime: true, style: { width: "28em" } },
  },
]
