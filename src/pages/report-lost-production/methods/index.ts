
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { IQueryRpDvsParams, IRpDvsAll, IRpDvsList, IRpDvsParams, TRpDvsFormField } from "../types"
import { deviceTrform, getStorage, isEmpty, showMsg, validResErr } from "@/utils/util-funs"
import { IStnDvsType4LocalStorage } from "@/types/i-device"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { CONTROL_DEFAULT_TYPE, CONTROL_OPTION } from "../configs"
import { queryDevicesByParams } from "@/utils/device-funs"
import { doBaseServer } from "@/api/serve-funs"
import { IPageInfo } from "@/types/i-table"
import { AxiosResponse } from "axios"
import { dealDownload4Response } from "@/utils/file-funs"
import { getStartAndEndTime } from "@/utils/form-funs"

// 执行数据查询
export async function getReportDevSchData(pageInfo: IPageInfo, formData: IQueryRpDvsParams, checked:any[], paramsType:string) {
  // if (!formData?.deviceType) {
  //   showMsg("请选择设备类型")
  //   return
  // }
  const selectedStates = localStorage.getItem('selectedStates')
  let type = ''
  let states = []
  if(selectedStates) {
    type = JSON.parse(selectedStates).type
    states = JSON.parse(selectedStates).states
  }
  const params = dealParams(formData, formData?.stationList)
  params.pageNum = pageInfo.current
  params.pageSize = pageInfo.pageSize
  params.mainState = type == "MAIN" ? states.join(",") : ""
  params.subState =  type == "SUB" ? states.join(",") : ""
  params.stationCode = paramsType == 'stn'?checked.length && checked.map((i:any) => i).join(',') : ''
  params.deviceCode = paramsType == 'dvs'?checked.length && checked.map((i:any) => i.deviceCode).join(',') : ''
  console.log("params", params,formData, checked, paramsType)
  if(formData.isGroupByStationOrDeviceCode == '1') { 
    params.isGroupByMState= true
    params.isGroupByDeviceCode = true
    params.isGroupByStationCode = false
  }else if(formData.isGroupByStationOrDeviceCode == '2') {
    params.isGroupByMState= true
    params.isGroupByDeviceCode = false
    params.isGroupByStationCode = true
  }else if(formData.isGroupByStationOrDeviceCode == '3') {
    params.isGroupByMState= false
    params.isGroupByDeviceCode = true
    params.isGroupByStationCode = false
  }else if(formData.isGroupByStationOrDeviceCode == '4') {
    params.isGroupByMState= false
    params.isGroupByDeviceCode = false
    params.isGroupByStationCode = true
  } else {
    params.isGroupByMState= false
    params.isGroupByStationCode = false
    params.isGroupByDeviceCode = false
  }

  const res = await doBaseServer<IRpDvsParams, IRpDvsAll>("getDeviceStateLossProduction", params)
  if (validResErr(res)) return null
  const actualData = res?.list.map((i, idx) => {
    return {
      ...i,
      id: i.deviceCode + i.endTime + i.startTime + idx,
      // production: formData?.deviceType === "WT" ? i.dailyProduction : (i.dailyCharge || 0) + (i.dailyDischarge || 0),
    }
  })
  return { records: actualData || [], total: res?.total }
}
export async function onReportDvsSchFormChg(
  changedValue: IQueryRpDvsParams,
  formInst: IFormInst,
  deviceTypeMap,
): Promise<TFormItemConfig<TRpDvsFormField>> {
  const [chgedKey, chgedVal] = Object.entries(changedValue || {})?.[0] || []
  if (!["stationId", "deviceType"].includes(chgedKey)) return {}
  console.log(chgedKey, "chgedKey111")

  const theFormInst = formInst?.getInst()
  if (chgedKey === "stationId" && chgedVal) {
    const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
    const items = deviceTypesOfSt.find((e) => e.stationId == chgedVal)
    const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal)
    theFormInst?.setFieldsValue({
      deviceCode: [],
      deviceType: null,
    })
    return { deviceType: { options: deviceTypeOptions }, deviceCode: { options: [] } }
  } else if (chgedKey === "stationId" && !chgedVal) {
    theFormInst?.setFieldsValue({
      deviceCode: [],
      deviceType: null,
    })
    return { deviceType: { options: CONTROL_OPTION }, deviceCode: { options: [] } }
  }
  if (chgedKey == "deviceType") {
    const data = theFormInst?.getFieldsValue()
    const schParams = { stationId: data.stationId, deviceType: chgedVal }
    const dvsList = await queryDevicesByParams(schParams, deviceTypeMap)
    const dvsOptions = deviceTrform(dvsList, "deviceCode")
    theFormInst?.setFieldsValue({
      deviceCode: [],
    })
    return { deviceCode: { options: dvsOptions } }
  }
  return {}
}


const getIntersection = (data = [], stationIds) => {
  if (!data.length) return []
  const newData = data && data
    .filter((item) => Object.prototype.hasOwnProperty.call(CONTROL_DEFAULT_TYPE, item))
    .map((item) => ({
      label: CONTROL_DEFAULT_TYPE[item],
      value: item,
      stationIds,
    }))

  return newData
}
// 执行数据导出
export function reportDvsExport( formData: IQueryRpDvsParams, stationList, checked:any[], paramsType:string) {
  const params = dealParams(formData, formData?.stationList)
  // params.pageNum = pageInfo.current
  // params.pageSize = pageInfo.pageSize
  const selectedStates = localStorage.getItem('selectedStates')
  let type = ''
  let states = []
  if(selectedStates) {
    type = JSON.parse(selectedStates).type
    states = JSON.parse(selectedStates).states
  }
  params.mainState = type && type == "MAIN" ? states.join(",") : ""
  params.subState =  type && type == "SUB" ? states.join(",") : ""
  params.stationCode = paramsType == 'stn'?checked.length && checked.map((i:any) => i).join(',') : ''
  params.deviceCode = paramsType == 'dvs'?checked.length && checked.map((i:any) => i.deviceCode).join(',') : ''
  if(formData.isGroupByStationOrDeviceCode == '1') { 
    params.isGroupByMState= true
    params.isGroupByDeviceCode = true
    params.isGroupByStationCode = false
  }else if(formData.isGroupByStationOrDeviceCode == '2') {
    params.isGroupByMState= true
    params.isGroupByDeviceCode = false
    params.isGroupByStationCode = true
  }else if(formData.isGroupByStationOrDeviceCode == '3') {
    params.isGroupByMState= false
    params.isGroupByDeviceCode = true
    params.isGroupByStationCode = false
  }else if(formData.isGroupByStationOrDeviceCode == '4') {
    params.isGroupByMState= false
    params.isGroupByDeviceCode = false
    params.isGroupByStationCode = true
  } else {
    params.isGroupByMState= false
    params.isGroupByStationCode = false
    params.isGroupByDeviceCode = false
  }
  console.log("params export", params)
  doBaseServer<typeof params, AxiosResponse>("exportDeviceStateLossProduction", params).then((data) => {
    dealDownload4Response(data, "单机损失电量.xlsx")
  })
}

// 处理查询及导出参数
function dealParams(formData: IQueryRpDvsParams, stationLists): IRpDvsParams {
  const { dateRange, stationId, stationList, deviceCode, deviceState, isGroupByStationOrDeviceCode, ...others } = formData
  const stationCodes = stationLists?.find((i) => i.id === formData.stationId)?.stationCode || ""
  const dvsCode = deviceCode?.join(",")
  return { ...others, deviceCode: dvsCode, stationCode: stationCodes,mainState:'',subState:'', ...getStartAndEndTime(dateRange, "", null, true) }
}

export const getStateNumberInfo = (currntStateList, runDataList, unKnownState) => {
  const unKnown = runDataList && runDataList.filter((i) => !i?.runData?.subState || i?.runData?.subState == unKnownState?.["state"])
  currntStateList.forEach((state) => {
    state.num = runDataList.filter((data) => data?.runData?.mainState == state.state)?.length || 0
    state.stateDesc === "无通讯" ? (state.num = unKnown.length) : ""
    state.children.forEach((child) => {
      child.num = runDataList.filter((data) => data?.runData?.subState == child.state)?.length || 0
      child.stateDesc === "无通讯" ? (child.num = unKnown.length) : ""
    })
  })
  // const res = {main: {}, sub: {}}
  return currntStateList
}
