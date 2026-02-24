/**
 * 日志
*/
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { useEffect, useMemo, useRef, useState } from "react"
import CustomTable from "@/components/custom-table"
import CustomForm from "@/components/custom-form"
import { doBaseServer } from "@/api/serve-funs.ts";
import { AxiosResponse } from "axios"
import { AtomConfigMap } from "@store/atom-config.ts"

import { dealDownload4Response } from "@/utils/file-funs"
import { vDate } from "@/utils/util-funs"
import { TSignLogSchFmItemName, ISignLogSchForm, ISignLogData } from "./types"
import { exportControlLog, getSignLogData, getStn2DvsTypeInfoMap, onSignLogSchFormChange } from "../../../control-sign-log/methods"
import { useAtomValue } from "jotai"

import { LOG_COLUMS, LOG_FORM_BTNS, LOG_FORM_ITEMS } from "./log-columns.tsx"
interface IDeviceData {
    deviceId: number,
    deviceName: string,
    deviceType: string,
    deviceTypeName: string,
    deviceStatus: string,
    deviceStatusName: string,
}
export default function LogForm(props) { 
    const { device, dataSource, ...otherProps } = props
    const [currentDataSource, setCurrentDataSource] = useState([])
    const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<any>>({})
    const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})
    const { deviceTypeOfStationMap, deviceTypeMap, controlTypeMap } = useAtomValue(AtomConfigMap).map
    useEffect(() => {
        dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
      }, [deviceTypeMap, deviceTypeOfStationMap])
    const formRef = useRef<IFormInst | null>(null)
    const onSearch = async() => { 
        const formData = formRef.current?.getFormValues()
        
        let obj = {
            "pageNum": 1,
            "pageSize": 10,
            "deviceId": formData.deviceId?.length?formData.deviceId.join(',') : "",
            "stationId": formData.stationId,
            "deviceType": formData.deviceType,
            "isEnd": formData.isEnd,
            "startTime": new Date(formData?.dateRange[0]).getTime(),
            "endTime": new Date(formData?.dateRange[1]).getTime()
            }
        const res = await doBaseServer('selectPage', obj)
        console.log(res,'=res')
        if(res.records && res?.records?.length) {
            setCurrentDataSource(res.records)
        } else {
            setCurrentDataSource([])
        }
    }
    let onFormAction = (action) => { 
        const formData = formRef.current?.getFormValues()
        console.log(action, "export===", formData, device)
        if (action === 'search') {
            onSearch()
        }
        if (action === "export") {
            let params = {
                "pageNum": 1,
                "pageSize": 10,
                "deviceId": formData.deviceId?.length?formData.deviceId.join(',') : "",
                "stationId": formData.stationId,
                "isEnd": formData.isEnd,
                "deviceType": formData.deviceType,
                "startTime": new Date(formData?.dateRange[0]).getTime(),
                "endTime": new Date(formData?.dateRange[1]).getTime()
            }
            doBaseServer<typeof params, AxiosResponse>("exportEamOrder", params).then((data) => {
                dealDownload4Response(data, "工单日志导出表.xlsx")
            })
        }
    }
    const deviceTypeMapRef = useRef(deviceTypeMap)
      deviceTypeMapRef.current = deviceTypeMap
    const onSchValueChgRef = async (changedValue: ISignLogSchForm) => {
        const dvsTypeInfoOfStnMap = dvsTypeInfoOfStnMapRef.current
        const deviceTypeMap = deviceTypeMapRef.current
        if(changedValue.hasOwnProperty("stationId")) {
        const forItemCfgData = await onSignLogSchFormChange(
          changedValue,
          formRef.current,
          dvsTypeInfoOfStnMap,
          deviceTypeMap,
        )
        setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
        }
      }
    useEffect(() => {
        const formInst = formRef.current?.getInst()
        const now = vDate()
        const startTime = now.clone().subtract(1, "month").startOf("day")
        const endTime = now.clone().endOf("day")

        formInst?.setFieldsValue({
            dateRange: [startTime, endTime],
            deviceType: device.deviceType,
            stationId: device.stationId
         })
         setTimeout(() => {
            formInst?.setFieldsValue({
                deviceId: [device.deviceId],
            })
            
         }, 500)
         onSearch()
        
    }, [])
    
    return (
        <div className="logo-module">
            <div className="log-conditions">
                <CustomForm
                    ref={formRef}
                    buttons={LOG_FORM_BTNS}
                    itemOptionConfig={formItemConfig}
                    itemOptions={LOG_FORM_ITEMS}
                    formOptions={{
                        onValuesChange: onSchValueChgRef,
                    }}
                    onSearch={onSearch}
                    onAction={onFormAction}
                />
            </div>
            <div className="log-list">
                <CustomTable
                    rowKey="id"
                    columns={LOG_COLUMS}
                    dataSource={currentDataSource||dataSource}
                />

            </div>
        </div>
    )
}