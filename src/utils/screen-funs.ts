/*
 * @Author: chenmeifeng
 * @Date: 2024-06-19 14:32:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-26 11:34:35
 * @Description: 大屏公用方法
 */
import { doBaseServer } from "@/api/serve-funs"
import { parseNum, validResErr } from "./util-funs"
import { IMapLatLon } from "@/types/i-screen"
import { getStationType } from "./device-funs"
import { TDeviceType } from "@/types/i-config"
import { IStationInfoData } from "@/types/i-monitor-info"
import { LARGER_W } from "@/configs/text-constant"

// 获取全部区域公司数据并渲染地图
export const getMaintenance = async (companyLonLatList: IMapLatLon[]) => {
  // const allMain = []
  const allMain = await doBaseServer("getScreenPoint", { groupByPath: "MAINTENANCE_COM_ID" })

  const valid = validResErr(allMain)
  if (valid) return []
  const allMaintnList =
    companyLonLatList?.map((i) => {
      let info = allMain?.find((item) => item.maintenanceComShortName === i.name)
      info = commonDealInfo(info)
      return {
        ...i,
        windSpeed: info?.windSpeed,
        activePower: info?.activePower,
        dailyProduction: info?.dailyProduction,
        stnDeviceType: "ALL",
      }
    }) || []
  return allMaintnList
}
// 获取大区数据
export const getScreenPointData = async () => {
  const res = await doBaseServer("getScreenPoint", { groupByPath: "REGION_COM_ID" })
  if (validResErr(res)) return false
  const info = commonDealInfo(res?.[0])
  return info
}

// 获取该检修公司数据
const getMaintenanceOfStn = async (company: string) => {
  const allMain = await doBaseServer("getScreenPoint", { groupByPath: "MAINTENANCE_COM_ID" })
  if (validResErr(allMain)) return null
  let info = allMain.find((item) => item.maintenanceComShortName === company)
  info = commonDealInfo(info)
  console.log(233, info, company)

  // setQuotaInfo(info)
  const stnList = await getStnList(company, info)
  return { info, stnList }
}

const getStnList = async (company: string, info) => {
  const allStn = await doBaseServer("getScreenPoint", { groupByPath: "STATION_CODE" })
  if (validResErr(allStn)) return
  if (!info?.maintenanceComId) return []
  const getAllStn = await doBaseServer("allStationsData", { maintenanceComId: info?.maintenanceComId })
  // console.log(getAllStn, "getAllStn", info)
  const result = getAllStn?.map((i) => {
    let oneInfo = allStn.find((item) => item.stationId === i.id)
    oneInfo = commonDealInfo(oneInfo)
    const mixedInfo = Object.assign({}, oneInfo, i)
    return mixedInfo
  })
  return result || []
}

export const renderMainOrStnData = async (e) => {
  const { stnList, info } = await getMaintenanceOfStn(e.name)
  // if (!info) return null
  const series =
    stnList?.map((i) => {
      const lat = parseFloat(i.tags?.latitude)
      const lng = parseFloat(i.tags?.longitude)
      return {
        ...i,
        name: i.stationShortName,
        value: lat ? [lng, lat, 50] : [],
        stnDeviceType: getStationType(i.stationType),
      }
    }) || []

  return { series, info }
}

// 公共处理数据、进行数据转换
export const commonDealInfo = (info) => {
  if (!info) return null
  info.totalInstalledCapacity = info.totalInstalledCapacity / 10000 // 总装机容量
  info.activePower = info.activePower / 10000 // 总有功
  info.dailyProduction = info.dailyProduction / 10000
  info.wtInstalledCapacity = info.wtInstalledCapacity / 10000 // 装机容量
  info.wtDailyProduction = info.wtDailyProduction / 10000
  info.pvinvInstalledCapacity = info.pvinvInstalledCapacity / 10000
  info.pvinvDailyProduction = info.pvinvDailyProduction / 10000
  info.espcsInstalledCapacity = info.espcsInstalledCapacity / 10000
  info.yearlyProduction = info.yearlyProduction / 10000
  info.monthlyProduction = info.monthlyProduction / 10000
  info.wtActivePower = info.wtActivePower / 10000
  info.pvinvActivePower = info.pvinvActivePower / 10000
  info.espcsActivePower = info.espcsActivePower / 10000
  info.stationNum = info.stationSNum + info.stationWNum
  info.CO2 = (info.yearlyProduction * 10000 * 824) / (1000 * 1000) // （2022年，全国单位火电发电量二氧化碳排放约824克/千瓦时）

  const wtInstalledCapacityTRate = (info?.wtInstalledCapacity / info?.totalInstalledCapacity) * 100
  const pvinvInstalledCapacityTRate = (info?.pvinvInstalledCapacity / info?.totalInstalledCapacity) * 100
  const espcsInstalledCapacityTRate = (info?.espcsInstalledCapacity / info?.totalInstalledCapacity) * 100
  return Object.assign({}, info, {
    wtInstalledCapacityTRate,
    pvinvInstalledCapacityTRate,
    espcsInstalledCapacityTRate,
  })
}

export const getPowerFutureInfo = async (params) => {
  const res = await doBaseServer("getGLYCFutureData", params)
  if (validResErr(res)) return null
  return res || []
}

// 获取所有场站设备信息，转换成地图需要的地理格式
export const getAllStnList = async () => {
  const allStn = await doBaseServer("getScreenPoint", { groupByPath: "STATION_CODE" })
  if (validResErr(allStn)) return
  const getAllStn = await doBaseServer("allStationsData")
  if (validResErr(getAllStn)) return
  // const result = allStn?.map((i) => {
  //   let oneInfo = getAllStn?.find((item) => item.id === i.stationId)
  //   i = commonDealInfo(i)
  //   const mixedInfo = Object.assign({}, i, oneInfo)
  //   return mixedInfo
  // })
  const result = getAllStn?.map((i) => {
    let oneInfo = allStn?.find((item) => item.stationId === i.id)
    oneInfo = commonDealInfo(oneInfo)
    const mixedInfo = Object.assign({}, oneInfo, i)
    return mixedInfo
  })
  // console.log(allStn, "getAllStn", result)
  const series =
    result?.map((i) => {
      const lat = parseFloat(i.tags?.latitude)
      const lng = parseFloat(i.tags?.longitude)
      return {
        ...i,
        name: i.stationShortName,
        value: lat ? [lng, lat, 50] : [],
        stnDeviceType: getStationType(i.stationType),
      }
    }) || []

  return series
}

export const getElecData = async () => {
  const res = await doBaseServer("getCenterProduction")
  const valid = validResErr(res)
  if (valid || !res) return null
  const result = res
  result.monthlyProduction = result?.monthlyProduction / 10000 || 0
  result.monthlyProductionPlan = result?.monthlyProductionPlan / 10000 || 0
  result.yearlyProduction = result?.yearlyProduction / 10000 || 0
  result.yearlyProductionPlan = result?.yearlyProductionPlan / 10000 || 0

  return {
    ...res,
    monthlyProduction: result.monthlyProduction,
    monthlyProductionPlan: result.monthlyProductionPlan,
    yearlyProduction: result.yearlyProduction,
    yearlyProductionPlan: result.yearlyProductionPlan,
    monthRate: parseNum((result?.monthlyProduction / result?.monthlyProductionPlan) * 100),
    yearRate: parseNum((result?.yearlyProduction / result?.yearlyProductionPlan) * 100),
  }
}

export async function getMonitorStnInfoData(params: { deviceType: TDeviceType }) {
  const resData = await doBaseServer<typeof params, IStationInfoData>("getStationInfoData", params)
  if (validResErr(resData)) return null

  const res = Object.values(resData).map((i) => {
    const property = params.deviceType?.toLocaleLowerCase()
    return {
      ...i,
      windSpeed: parseNum(i.data?.windSpeed),
      activePower: parseNum(i.data?.activePower / LARGER_W, 4),
      dailyProduction: parseNum(i.data?.dailyProduction / LARGER_W, 4),
      totalIrradiance: i.data?.totalIrradiance,
      typeRate: parseNum(
        (parseNum(i?.data?.activePower, -1) * 100) / (parseNum(i[`${property}InstalledCapacity`], -1, 1) || 1),
      ),
    }
  })
  return res
}

export const getScreenUrl = async () => {
  const jump = await doBaseServer("queryMngStatic", { key: "screen" })
  const actualKey = jump?.data || process.env.REACT_APP_LARGE_SCREEN_ROOT
  return actualKey
}

export const getTypeList = async (type: "REGION_COM_ID" | "MAINTENANCE_COM_ID" | "STATION_CODE" | "PROJECT_COM_ID") => {
  const allRes = await doBaseServer("getScreenPoint", { groupByPath: type })
  if (validResErr(allRes)) return false
  return allRes
}
