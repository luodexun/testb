/*
 * @Author: chenmeifeng
 * @Date: 2024-07-16 17:34:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-06 13:59:21
 * @Description:
 */
export let testScreenData = {
  electricity: {
    useInterfaceData: true,
    data: {
      yearlyProduction: 0,
      monthlyProduction: 0,
      dailyProduction: 0,
    },
    rate: {
      yearRate: 0,
      monthRate: 0,
    },
  },
  yearElecPredict: {
    useInterfaceData: true,
    data: [
      // { id: 1, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 2, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 3, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 4, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 5, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 6, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 7, forecastTime: "6/24", shortPredProduction: 30 },
      // { id: 8, forecastTime: "6/24", shortPredProduction: 30 },
    ],
  },
  modelData: {
    useInterfaceData: true,
    data: [
      // { id: 1, name: "金凤", value: 30 },
      // { id: 2, name: "明阳", value: 30 },
      // { id: 3, name: "远景", value: 30 },
      // { id: 4, name: "联合动力", value: 30 },
    ],
  },
  capacityOverview: {
    useInterfaceData: true,
    data: {
      totalInstalledCapacity: 0,
      totalInstalledCapacity1: 0,
      wtOperationCapacity: 0,
      wtOperationDeviceCount: 0,
      pvinvOperationCapacity: 0,
      pvinvOperationDeviceCount: 0,
    },
  },
  realtimeInfo: {
    useInterfaceData: true,
    data: {
      windSpeed: 0,
      totalIrradiance: 0,
    },
    list: [
      // { id: 1, Time: "12", activePower: 12, wtActiveP: 10, pvActiveP: 1 },
      // { id: 2, Time: "2", activePower: 2, wtActiveP: 10, pvActiveP: 2 },
      // { id: 3, Time: "3", activePower: 65, wtActiveP: 10, pvActiveP: 1 },
      // { id: 4, Time: "6", activePower: 1, wtActiveP: 6, pvActiveP: 9 },
    ],
  },
  siteInfo: {
    useInterfaceData: true,
    list: [
      {
        id: 1,
        value: "112.74, 38.53",
        name: "风机1",
        type: "WT",
        tooltipContent: {
          windSpeed: 23,
          activePower: 345,
          totalDeviceCount: 12,
          totalInstalledCapacity: 234,
        },
      },
      {
        id: 2,
        value: "112.53, 39.33",
        name: "隆润",
        type: "PVINV",
        tooltipContent: {
          windSpeed: 23,
          activePower: 345,
          totalDeviceCount: 12,
          totalInstalledCapacity: 234,
        },
      },
    ],
  },
}

export const changejson = (json) => {
  testScreenData = json
}
