/*
 * @Author: chenmeifeng
 * @Date: 2024-02-02 09:47:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-11 14:25:07
 * @Description:
 */
import "./index.less"

import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Flex, InputNumber, Radio, Switch } from "antd"
import { useSetAtom } from "jotai"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import { StorageSvgAnalogSet } from "@/configs/storage-cfg"
import { analogInfoSetAtom } from "@/store/atom-analog-data"
import { getDvsMeasurePointsData } from "@/utils/device-funs"
import { getStorage } from "@/utils/util-funs"

import { IPointInfo } from "../../types"

export interface IPerateRef {}
export interface ISvgPointAngMdlProps {
  pointInfo: IPointInfo
  changeClk: (e: any) => void
}
export interface IAnalogInfo {
  isRadio: boolean
  key: string
  label: string
  value: any
}
export interface IAnalogStInfo {
  fk?: boolean
  analogList?: Array<IAnalogInfo>
}

const SvgResetDataBox = forwardRef<IPerateRef, ISvgPointAngMdlProps>((props, ref) => {
  const { pointInfo, changeClk } = props
  const analogStorage = getStorage(StorageSvgAnalogSet) || {}
  const [analogList, setAnalogList] = useState<Array<IAnalogInfo>>([])
  const [useAnalogData, setUseAnalogData] = useState(false)
  const setGlobalSngAngValue = useSetAtom(analogInfoSetAtom)
  // const [currentInfo, setCurrentInfo] = useState(null)
  const initData = async () => {
    const analogStorageList = analogStorage?.analogList || []
    setUseAnalogData(analogStorage?.fk)
    const isExist = analogStorageList.find((i) => i.key === pointInfo?.pointName)
    const point = await getDvsMeasurePointsData({ deviceId: pointInfo?.deviceId, pointName: pointInfo?.pointName })
    // setCurrentInfo(point?.[0] || null)
    const res = isExist
      ? analogStorageList
      : analogStorageList.concat([
          {
            label: point?.[0]?.pointDesc || "-",
            key: pointInfo.pointName,
            isRadio: pointInfo.actType !== "TP",
            value: null,
          },
        ])
    setAnalogList(res)
  }
  useEffect(() => {
    if (!pointInfo) return
    initData()
  }, [pointInfo])

  const reCurmove = (info) => {
    setAnalogList((prev) => {
      return prev.filter((item) => item.key !== info.key)
    })
  }

  const onChange = (e, info, index) => {
    setAnalogList((prev) => {
      const value = info.isRadio ? e.target.value : e
      prev[index].value = value
      return [...prev]
    })
  }
  const useAnalog = (e) => {
    setUseAnalogData(e)
  }
  const saveAnalog = () => {
    setGlobalSngAngValue({ analogInfo: { analogList, fk: useAnalogData } })
    // setStorage({ analogList, fk: useAnalogData }, StorageSvgAnalogSet)
    changeClk("")
  }
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="reset-list">
      {analogList?.map((i, index) => {
        return (
          <div key={i.key} className="reset-item">
            <span className="reset-item-name">{i.label}:</span>
            {!i.isRadio ? (
              <InputNumber defaultValue={i.value} value={i.value} onChange={(e) => onChange(e, i, index)} />
            ) : (
              <Radio.Group onChange={(e) => onChange(e, i, index)} value={i.value}>
                <Radio value={true}>true</Radio>
                <Radio value={false}>false</Radio>
              </Radio.Group>
            )}
            <MinusCircleOutlined onClick={() => reCurmove(i)} style={{ fontSize: "2em", marginLeft: "1em" }} />
          </div>
        )
      })}
      <div className="reset-item">
        <span className="reset-item-name">使用样例数据:</span>
        <Switch checked={useAnalogData} checkedChildren="开启" unCheckedChildren="关闭" onChange={useAnalog} />
      </div>

      <Flex gap="small" wrap="wrap" justify="flex-end">
        <Button onClick={saveAnalog}>确认</Button>
        <Button onClick={changeClk}>取消</Button>
      </Flex>
    </div>
  )
})
export default SvgResetDataBox
