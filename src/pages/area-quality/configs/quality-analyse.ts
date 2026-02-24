/*
 * @Author: chenmeifeng
 * @Date: 2024-09-12 10:06:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-26 16:36:50
 * @Description:数据质量最低
 */
import CommonTreeSelect from "@/components/common-tree-select"
import CustomDatePicker from "@/components/custom-date-picker"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import SelectOrdinary from "@/components/select-ordinary"
import StationTreeSelect from "@/components/station-tree-select"
export const DATA_QUALITY_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN]
export const DATA_QUALITY_FORM_ITEMS = (multiple = false) => {
  return [
    {
      type: SelectOrdinary,
      name: "deviceType",
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
      name: "deviceList",
      label: "设备",
      props: {
        multiple: multiple,
        placeholder: "全部",
        treeCheckable: true,
        treeDefaultExpandAll: false,
        style: { minWidth: "13em" },
      },
    },
    {
      type: CustomDatePicker,
      name: "Time",
      label: "日期",
      props: {
        style: { minWidth: "10em" },
      },
    },
  ] as ISearchFormProps["itemOptions"]
}
export const DATA_QUALITY_DETAIL_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      options: [],
      needId: true,
      disabled: false,
      style: { width: "10em" },
    },
  },
]
export const RATE_OPTION = [
  { label: "数据合规率", value: "dataQualityRate" },
  { label: "数据完整率", value: "dataIntegrityRate" },
  { label: "采集覆盖率", value: "collectionCoverageRate" },
]
