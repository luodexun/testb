/*
 * @Author: chenmeifeng
 * @Date: 2023-11-08 17:34:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-11 10:18:31
 * @Description:
 */
import "./incss.less"

import { Image } from "antd"

import { IDeviceData } from "@/types/i-device"

import PointText from "../trend-line-by-dvs/text"
interface ItemProp {
  key?: string
  icon?: any
  unit?: number | string
  name?: string
}
interface Iprops {
  dvsInfo?: IDeviceData
  item: ItemProp
  data: any
}
export default function CustomBoxWth(props: Iprops) {
  const { item, data, dvsInfo = {} } = props
  return (
    <div key={item.key} className="stList-item">
      <div className="stList-item-left">
        <Image src={item.icon} />
      </div>
      <div className="stList-item-right">
        <span>{item.name}</span>
        {item.unit ? (
          <div className="stList-item-right--value">
            {/* <span className="stList-value-value">{judgeNull(data?.[item.key])}</span> */}
            <PointText record={dvsInfo} valkey={item.key} text={data?.[item.key]} className="stList-value-value" />
            <span className="stList-value-unit">{item.unit}</span>
          </div>
        ) : (
          <PointText record={dvsInfo} valkey={item.key} text={data?.[item.key]} className="stList-value-value" />
        )}
      </div>
    </div>
  )
}
