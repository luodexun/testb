/*
 * @Author: chenmeifeng
 * @Date: 2024-07-31 11:07:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-01 15:09:22
 * @Description:
 */
import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"
import { IModelInfo } from "../types"
import { IBrandData } from "@/types/i-screen"

export const modelData = async () => {
  const res = await doBaseServer<any, IModelInfo>("queryBrand")
  if (validResErr(res)) return false
  // const res = {
  //   wt: {
  //     GW: {
  //       manufacturer: "GW", //该厂家名称
  //       deviceQuantity: "6", //该厂家设备数量
  //       deviceCapacity: "9000", //该厂家设备装机容量，单位kW
  //       allCapacity: "19253", //风电机组总装机容量，单位kW
  //       capacityCent: "0.4675", //该厂家装机容量占比
  //       allQuantity: "106", //风电机组总设备数量
  //     },
  //     ZHONGCHE: {
  //       manufacturer: "ZHONGCHE",
  //       deviceQuantity: "100",
  //       deviceCapacity: "10253",
  //       allCapacity: "19253",
  //       capacityCent: "0.5325",
  //       allQuantity: "106",
  //     },
  //   },
  //   pvinv: {
  //     YANGGUANG: {
  //       manufacturer: "YANGGUANG",
  //       deviceQuantity: "12",
  //       deviceCapacity: "1200",
  //       allCapacity: "1200",
  //       capacityCent: "1.0000",
  //       allQuantity: "12",
  //     },
  //     ZHONGCHE: {
  //       manufacturer: "ZHONGCHE",
  //       deviceQuantity: "100",
  //       deviceCapacity: "10253",
  //       allCapacity: "19253",
  //       capacityCent: "0.5325",
  //       allQuantity: "106",
  //     },
  //   },
  //   espcs: {
  //     HUARUN: {
  //       manufacturer: "HUARUN",
  //       deviceQuantity: "14",
  //       deviceCapacity: "1400.01",
  //       allCapacity: "1400.01",
  //       capacityCent: "1.0000",
  //       allQuantity: "14",
  //     },
  //   },
  // }
  let sum = 0
  const result =
    Object.values(res)?.reduce((prev, cur) => {
      Object.values(cur)?.forEach((model) => {
        sum = sum + parseInt(model.deviceQuantity)
        const exist = prev.find((i) => i.manufacturer === model.manufacturer)
        if (exist) {
          exist.value = exist.value + parseInt(model.deviceQuantity)
        } else {
          prev.push({ ...model, value: parseInt(model.deviceQuantity), name: model.manufacturer })
        }
      })
      return prev
    }, []) || null
  console.log(result, "result大使馆反对广泛", sum)
  return { result, sum }
}
