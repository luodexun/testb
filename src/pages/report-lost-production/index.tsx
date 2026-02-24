/*
 * @Description: 单机损失电量
 */
import  "./index.less"
import usePageSearch from "@hooks/use-page-search.ts"
import { useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"
import { IQueryRpDvsParams, IRpDvsList, TRpDvsFormField } from "./types"
import { getReportDevSchData, onReportDvsSchFormChg, reportDvsExport, getStateNumberInfo } from "./methods"
import {
  CONTROL_OPTION,
  REPORT_DEVICE_COLUMNS1,
  REPORT_DEVICE_COLUMNS2,
  REPORT_DEVICE_COLUMNS3,
  RP_DEVICE_SCH_FORM_BTNS,
  RP_DEVICE_SCH_FORM_ITEMS,
  TAB_LIST,
} from "./configs"
import { AtomConfigMap } from "@/store/atom-config"
import { useAtomValue } from "jotai"
import { AtomStation } from "@/store/atom-station"
import { ColumnsType } from "antd/es/table"
// import PivotTable from "@/components/excel-test"
import SelectWidthAll from "@/components/select-with-all"
import ControlBatchTree, { IControlBatchTreeProps } from "./components/control-batch-tree"
import { CONTROL_SELECT } from "@pages/control-batch/configs"
import { TDeviceType } from "@/types/i-config.ts"
import { Button, Input } from "antd"
import { CloseOutlined, SearchOutlined } from "@ant-design/icons"
import ModuleData from "./module-data"
import { IModelListData } from "@/pages/setting-state-model/types"


export default function ReportDevice() {
    const [isSelected, setSelect] = useState<number>(0)
    const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
    const [showSearch, setShowSearch] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [paramsType, setParamsType] = useState("")
    const [checkedDevices, setCheckedDevices] = useState<any>([])
    const checkedDevicesRef = useRef<any[]>([]);

    const handleDeviceTypeChange = (value: TDeviceType) => {
      setDeviceType(value);
      // 同时更新表单中的 deviceType 字段
      formRef.current?.getInst()?.setFieldsValue({ deviceType: value, deviceState: [] });//此时设备状态的数据应该先清空
      console.log('formRef===',formRef,value)
    };
      
    const onSubmitRef = useRef<IControlBatchTreeProps["onSubmit"]>((devices, isSubmit, paramsType) => {
        // if (isSubmit) {
        //   setBtnGroupDevices(devices)
        //   return setCheckedDevices(devices)
        // }
        // setBtnGroupDevices([])
        console.log('选中的设备数据:', devices, isSubmit, paramsType)
        setParamsType(paramsType)
        setCheckedDevices([...devices])
      })
    useEffect(() => {
      console.log('checkedDevices 已更新:', checkedDevices);
      checkedDevicesRef.current = checkedDevices
      // 在这里可以执行依赖于最新 checkedDevices 值的操作
    }, [checkedDevices]);

  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpDvsFormField>>()

  const { stationList } = useAtomValue(AtomStation)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const deviceTypeMapRef = useMemo(() => {
    return deviceTypeMap
  }, [deviceTypeMap])

  const paramsTypeRef = useRef(paramsType);
  // 在 useEffect 中更新 ref 的值
  useEffect(() => {
    paramsTypeRef.current = paramsType;
  }, [paramsType]);

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IQueryRpDvsParams, IRpDvsList>(
    { 
      serveFun: (pageInfo, formData) => {
      // 在这里可以访问 checkedDevices 并传递给 getReportDevSchData
      return getReportDevSchData(pageInfo, formData, checkedDevicesRef.current, paramsTypeRef.current) }
    },
    { formRef, needFirstSch: false, otherParams: { stationList } },
  )

  //   const { currntStateList, unKnownState } = useStateType(deviceType)

  // const stateNumberInfo = useMemo<IModelListData[]>(() => {
  //     return getStateNumberInfo(currntStateList, combineData, unKnownState)
  //   }, [])

  async function onFormAction(type: "export") {
    
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      console.log(type, "sdfjkl export", formData)
      reportDvsExport(formData, stationList,checkedDevicesRef.current, paramsTypeRef.current)
      
    }
  }
  let testTableData = [
        {
            "stationName": "楚州风电场",
            "deviceName": "F05",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 01:05:15",
            "endTime": "2025-09-24 01:37:27",
            "duration": 0.53667,
            "totalLossProduction": 173.8830149312809,
            "windSpeedAvg": 4.082315684754521,
            "deviceCode": "320803W01WT1101005",
            "stationCode": "320803W01",
            "startTimeLong": 1758647115000,
            "endTimeLong": 1758649047000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,

        },
        {
            "stationName": "博景风电场",
            "deviceName": "F15",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 00:58:39",
            "endTime": "2025-09-24 01:34:36",
            "duration": 0.59917,
            "totalLossProduction": 103.33941825455793,
            "windSpeedAvg": 3.2522207638888863,
            "deviceCode": "320803W02WT1103015",
            "stationCode": "320803W02",
            "startTimeLong": 1758646719000,
            "endTimeLong": 1758648876000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "高邮风电场",
            "deviceName": "#16",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 01:30:33",
            "endTime": "2025-09-24 02:06:51",
            "duration": 0.605,
            "totalLossProduction": 392.8052097411369,
            "windSpeedAvg": 5.114088583218704,
            "deviceCode": "321084W01WT1102016",
            "stationCode": "321084W01",
            "startTimeLong": 1758648633000,
            "endTimeLong": 1758650811000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场",
            "deviceName": "#05",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:26:15",
            "endTime": "2025-09-24 09:38:15",
            "duration": 4.2,
            "totalLossProduction": 150.19320363037048,
            "windSpeedAvg": 1.9517171989684796,
            "deviceCode": "320282W01WT1101005",
            "stationCode": "320282W01",
            "startTimeLong": 1758662775000,
            "endTimeLong": 1758677895000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场",
            "deviceName": "#07",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:37:30",
            "endTime": "2025-09-24 09:42:21",
            "duration": 4.08083,
            "totalLossProduction": 123.75102662391481,
            "windSpeedAvg": 1.9248275112290714,
            "deviceCode": "320282W01WT1101007",
            "stationCode": "320282W01",
            "startTimeLong": 1758663450000,
            "endTimeLong": 1758678141000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场1",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场2",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场3",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场4",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场5",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },,
        {
            "stationName": "徐舍风电场5",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场5",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场5",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        },
        {
            "stationName": "徐舍风电场5",
            "deviceName": "#08",
            "mainStateName": "待机",
            "subStateName": "小风待机",
            "startTime": "2025-09-24 05:34:09",
            "endTime": "2025-09-24 09:47:36",
            "duration": 4.22417,
            "totalLossProduction": 156.80444976608194,
            "windSpeedAvg": 2.0361247731755427,
            "deviceCode": "320282W01WT1101008",
            "stationCode": "320282W01",
            "startTimeLong": 1758663249000,
            "endTimeLong": 1758678456000,
            "mainState": 3,
            "subState": 6,
            "activePower": 3,
        }
    ]

  const ACTUAL_COLUMS = useMemo<ColumnsType<any>>(() => {
    const { deviceType = "WT" } = formRef.current?.getFormValues() || {}
    if (deviceType === "PVINV") {
      return REPORT_DEVICE_COLUMNS1
    }
    if (deviceType === "WT") {
      return REPORT_DEVICE_COLUMNS3
    }
    return REPORT_DEVICE_COLUMNS2
    // return testTableData
  }, [dataSource])

  const onSchValueChgRef = useRef(async (changedValue) => {
    console.log('current form value:', changedValue)
    const chgOptions = await onReportDvsSchFormChg(changedValue, formRef.current, deviceTypeMapRef)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  })

  const handleSelect = (index: number) => {
    setSelect(index)
    console.log('dataSource=',dataSource)
    if(index == 0) {
      // changeCurve()
      onSearch()
    }
  }

   const [treeData, setTreeData] = useState<any[]>([])
  const handleTreeDataChange = (data: any[]) => {
    setTreeData(data);
  };
  const dynamicFormItems = useMemo(() => {
  return RP_DEVICE_SCH_FORM_ITEMS.map(item => {
    if (item.name === 'deviceState') {
      return {
        ...item,
        props: {
          ...item.props,
          deviceType: deviceType // 动态注入 deviceType
        }
      };
    }
    return item;
  });
}, [deviceType]);

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [vDate().subtract(1, "day"), vDate()] })
    formInst?.setFieldsValue({ deviceType: deviceType })
    setFormItemConfig((prevState) => ({ ...prevState, deviceType: { options: CONTROL_OPTION } }))
    // formInst?.submit()
    setTimeout(() => {
      onSearch();
    }, 0);
  }, [])
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    // 获取昨天的日期
    const yesterday = vDate().subtract(1, "day")
    // 获取昨天的开始时间（0点）
    const startOfYesterday = yesterday.startOf("day")
    // 获取昨天的结束时间（24点）
    const endOfYesterday = yesterday.endOf("day")

    formInst?.setFieldsValue({ dateRange: [startOfYesterday, endOfYesterday] })
    formInst?.submit()
  }, [])
  const getFormData = () => {
    return formRef.current?.getFormValues();
  };

  return (
    <div className={"content-wrap"}>
      <div className={"control-batch-left"}>
        <div className="batch-left-top">
          <SelectWidthAll
            style={{ width: "80%" }}
            options={CONTROL_SELECT}
            value={deviceType}
            allowClear={false}
            onChange={handleDeviceTypeChange}
          />
          <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => setShowSearch(!showSearch)} />
        </div>
        <ControlBatchTree 
        deviceType={deviceType} 
        onSubmit={onSubmitRef.current} 
        searchDevice={searchVal} 
        onTreeDataChange={handleTreeDataChange}
        />
      </div>
      <div className={"control-batch-right"}> 
        <CustomForm
          ref={formRef}
          loading={loading}
          itemOptionConfig={formItemConfig}
          itemOptions={dynamicFormItems}
          buttons={RP_DEVICE_SCH_FORM_BTNS}
          formOptions={{
            onValuesChange: onSchValueChgRef.current,
          }}
          onSearch={onSearch}
          onAction={onFormAction}
        />
        <div className={"tab"}>
          <div className={"tab-list"}>
            {TAB_LIST.map((e, index) => (
              <span
                key={e}
                className={`item ${isSelected === index ? "active" : ""}`}
                onClick={() => handleSelect(index)}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
        <div className={"content"}>
          {isSelected === 0 ? (
            <CustomTable
                rowKey="id"
                loading={loading}
                limitHeight
                columns={ACTUAL_COLUMS}
                dataSource={dataSource}
                pagination={pagination}
              />
            ) : isSelected === 1 ? (
              <ModuleData
                isStart={true}
                getFormData={getFormData}
                deviceType={deviceType}
                pagination={pagination}
                treeData={dataSource}
              />
            ) : (
              <div></div>
            )
          }
        </div>
        
      </div>

      
    </div>
  )
}
