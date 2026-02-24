import { ISearchFormProps } from "@/components/custom-form/types.ts"
import { ColumnsType } from "antd/es/table"
import RangeDatePicker from "@/components/range-date-picker"
import SelectOrdinary from "@/components/select-ordinary"
import StationTreeSelect from "@/components/station-tree-select"
import CommonTreeSelect from "@/components/common-tree-select"

export const LOG_FORM_BTNS: ISearchFormProps["buttons"] = [{ name: "search", label: "查询" }, { name: "export", label: "导出" }]

export const LOG_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
    { 
        label: "场站",
         name: "stationId", 
         type: StationTreeSelect, 
         props: {
            style: { minWidth: "10em" },
            placeholder: "",
            needId: true,
            }
    },
    { 
        label: "设备类型",
         name: "deviceType", 
         type: SelectOrdinary, 
         props: {
            // options: [],
            placeholder: "",
            style: { minWidth: "10em" },
        }
    },
    { 
        label: "设备",
         name: "deviceId", 
         type: CommonTreeSelect, 
         props: {
            multiple: true,
            placeholder: "",
            treeCheckable: true,
            style: { minWidth: "13em" },
        },
    },
    { 
        type: SelectOrdinary,
        name: "isEnd",
        label: "是否关闭",
        props: {
            options: [
            { label: "是", value: true },
            { label: "否", value: false },
            ],
            placeholder: "",
        },
    },
    { 
        label: "时间", 
        name: "dateRange", 
        type: RangeDatePicker,
        props: {
            showTime: true,
            style: { width: "22em" },
        },
    },

]
export const LOG_COLUMS:ColumnsType<any>  = [
    { title: "序号", align: "center", width: 60, render: (text, record, index) => index + 1 },
    { dataIndex: "stationName", title: "场站", align: "center" },
    { dataIndex: "deviceName", title: "设备", align: "center" },
    { dataIndex: "cWorkordertype", title: "型号", align: "center" },
    { dataIndex: "wonum", title: "工单号", align: "center" },
    { dataIndex: "haschildwo", title: "是否子工单", align: "center" },
    { dataIndex: "status", title: "工单状态", align: "center"},
    { dataIndex: "description", title: "工单描述", align: "center"},
    { dataIndex: "signState", title: "挂牌类型", align: "center"},
    
]
