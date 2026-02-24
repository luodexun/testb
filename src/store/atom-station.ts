/*
 * @Author: xiongman
 * @Date: 2022-12-12 15:38:39
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-22 11:31:03
 * @Description: 全局数据-场站数据
 */

import { StorageStationData } from "@configs/storage-cfg"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomUserOfMenuMap } from "@store/atom-menu.ts"
import { getStorage, reduceList2KeyValueMap, setStorage, stationTrform, validResErr } from "@utils/util-funs"
import { atom } from "jotai"

import { doNoParamServer } from "@/api/serve-funs"
import { IAtomStation, IProjectCompany, IStationData } from "@/types/i-station"

export const STATION_DATA_MAP: IAtomStation = {
  stationList: [],
  stationMap: {},
  stationOptions: [],
  stationOptions4Id: [],
}
export const INIT_STATION_DATA_MAP: IAtomStation = {
  stationList: [],
  stationMap: {},
  stationOptions: [],
  stationOptions4Id: [],
}

const ATOM_STATION = atom<IAtomStation>(STATION_DATA_MAP)

export const AtomStation = atom(
  (get) => get(ATOM_STATION),
  async (get, set, flag?) => {
    if (flag) {
      set(ATOM_STATION, INIT_STATION_DATA_MAP)
    } else {
      await set(AtomConfigMap) // 触发配置数据的获取
      const hasSitList = get(ATOM_STATION).stationList?.length
      if (hasSitList) return

      const localData = getStorage<IAtomStation>(StorageStationData)
      if (localData?.stationList?.length) {
        window.setTimeout(() => setStorage(localData, StorageStationData), 0)
        set(ATOM_STATION, localData)
        return set(AtomUserOfMenuMap, localData.stationList)
      }
    }
    const resData = await doNoParamServer<IStationData[]>("allStationsData")
    const companyList = await doNoParamServer<Array<IProjectCompany>>("getProjectCompany")

    if (validResErr(resData) || !Array.isArray(resData)) return
    const stationMap = reduceList2KeyValueMap(resData, { vField: "stationCode" }, (d) => d)
    const stationOptions = resData.map((item) => ({ value: item.stationCode, label: item.shortName }))
    const stationOptions4Id = resData.map((item) => ({ label: item.shortName, value: item.id }))
    const stationOfRegionOptions = stationTrform(resData, companyList)
    const stationOfRegionOptions4Id = stationTrform(resData, companyList, "id")

    const stationData: IAtomStation = {
      stationList: resData,
      stationMap,
      stationOptions,
      stationOptions4Id,
      stationOfRegionOptions,
      stationOfRegionOptions4Id,
    }
    set(ATOM_STATION, stationData)
    setStorage(stationData, StorageStationData)
    Object.assign(STATION_DATA_MAP, stationData)
    await set(AtomUserOfMenuMap, resData)
  },
)
