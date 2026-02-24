/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 09:15:16
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-16 09:15:16
 *@Description: 升压站全局变量
 */
import { atom } from "jotai"

interface DataTYpe {
  type?: number
  src?: string
}

const BOOSTER_DATA = atom<DataTYpe>({})

export const AtomRunBooster = atom(
  (get) => get(BOOSTER_DATA),
  (get, set, newData: DataTYpe) => {
    const preData = get(BOOSTER_DATA)
    set(BOOSTER_DATA, { ...preData, ...newData })
  },
)
