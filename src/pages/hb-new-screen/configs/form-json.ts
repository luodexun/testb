/*
 * @Author: chenmeifeng
 * @Date: 2024-07-16 17:34:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-17 10:23:56
 * @Description:
 */
export let testScreenData = {
  // 发电量概览
  electricity: {
    useInterfaceData: true,
    data: {
      yearlyProduction: 989789,
      monthlyProduction: 222,
      monthlyProductionPlan: 234,
      yearlyProductionPlan: 5678,
    },
    rate: {
      yearRate: 20,
      monthRate: 60,
    },
  },
  // 发电量趋势
  yearElecPredict: {
    useInterfaceData: true,
    data: [{ id: 1, Time: "6/24", dailyProduction: 30 }],
  },
  // 品牌
  modelData: {
    useInterfaceData: true,
    data: {
      wt: [],
      pvinv: [],
      espcs: [],
    },
  },
  capacityOverview: {
    useInterfaceData: true,
    data: {
      totalInstalledCapacity: 0,
      activePower: 0,
      dailyProduction: 0,
      windSpeed: 0,
      ojjne: 0,
      wtInstalledCapacity: 0,
      wtDailyProduction: 0,
      wtNum: 0,
      wtInstalledCapacityTRate: 0,
      stationWNum: 0,
      pvinvInstalledCapacity: 0,
      pvinvDailyProduction: 0,
      pvinvNum: 0,
      pvinvInstalledCapacityTRate: 0,
      stationSNum: 0,
    },
  },
  // 日负荷趋势
  dayTrendInfo: {
    useInterfaceData: true,
    // forecastTime: "", shortPredPower: 0, ultraShortPredPower: 0, agvcPower: 0 }]
    data: [
      { id: 1, forecastTime: "12", shortPredPower: 12, wtActiveP: 10, agvcPower: 1 },
      { id: 2, forecastTime: "2", shortPredPower: 2, wtActiveP: 10, agvcPower: 2 },
      { id: 3, forecastTime: "3", shortPredPower: 65, wtActiveP: 10, agvcPower: 1 },
      { id: 4, forecastTime: "6", shortPredPower: 1, wtActiveP: 6, agvcPower: 9 },
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
  // 气象信息
  weatherData: {
    useInterfaceData: true,
    data: {
      WT: [],
      PVINV: [],
    },
  },
  // 年利用小时数
  yearHourData: {
    useInterfaceData: true,
    data: {
      REGION_COM_ID: [],
      MAINTENANCE_COM_ID: [],
      STATION_CODE: [],
    },
  },
}

export const changejson = (json) => {
  testScreenData = json
}
