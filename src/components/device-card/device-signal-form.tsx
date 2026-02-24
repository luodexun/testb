/*
 * @Author: xiongman
 * @Date: 2023-11-16 12:12:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-04 10:24:14
 * @Description:
 */

import "./device-signal-form.less"

import { AtomConfigMap } from "@store/atom-config.ts"
import type { RadioChangeEvent } from "antd"
import { Input, Radio, Tabs, TreeSelect } from "antd"
import { CheckboxGroupProps } from "antd/lib/checkbox"
import classnames from "classnames"
import { useAtomValue } from "jotai"
import { ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import CustomCheckboxGroup from "@/components/custom-checkbox-group"
import { IDeviceSignal } from "@/types/i-config.ts"
import { IDeviceData } from "@/types/i-device.ts"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info.ts"
import { queryDevicesByParams } from "@/utils/device-funs"

export interface IDvsSignFormVal {
  isChecked: boolean
  id?: IDvsSignalRecordInfo["id"]
  signState?: IDvsSignalRecordInfo["signState"]
  remark?: IDvsSignalRecordInfo["remark"]
  operate: "add" | "edit" | "del"
  deviceId: IDeviceData["deviceId"]
}

export interface IObjDvsSignFormVal {
  [device: number]: IDvsSignFormVal[]
}

export interface IDeviceSignalFormRef {
  getValue: () => IDvsSignFormVal[]
  setValue: (records: IDvsSignalRecordInfo[], deviceId: IDeviceData["deviceId"]) => void
  isMultiple: boolean
  deviceIdList: number[]
}

function dealSignalOptions(list: IDeviceSignal[]) {
  if (!list?.length) return []
  return list.map(({ signState, signDesc }) => ({
    value: signState,
    label: (
      <>
        <span>{signDesc}</span>
        {/* <i className={classnames("signal-icon", `signal-${signState}`)} /> */}
        {/* <span className={classnames("bsign-icon")}>{signDesc?.slice(0, 1)}</span> */}
      </>
    ),
  }))
}

const tabs = [
  { label: "手动挂牌", key: "手动挂牌", closable: false },
  { label: "自动挂牌", key: "自动挂牌", closable: false },
  // { label: "二次判断", key: "二次判断", closable: false },
]
export interface IDeviceSignalIProps {
  disabled?: boolean
  device?: Omit<IDeviceData, "runData"> | null
}
type TSignMap = Partial<Record<IDvsSignalRecordInfo["signState"], IDvsSignFormVal>>
type ISignTypeMap = {
  [way in "手动挂牌" | "自动挂牌" | "二次判断"]: TSignMap
}

const DeviceSignalForm = forwardRef<IDeviceSignalFormRef, IDeviceSignalIProps>((props, ref) => {
  const { disabled, device } = props
  const [signMap, setSignMap] = useState<ISignTypeMap>({
    手动挂牌: {},
    二次判断: {},
    自动挂牌: {},
  })

  const [activeSign, setActiveSign] = useState<string>()
  const { deviceSignal } = useAtomValue(AtomConfigMap).list
  const deviceIdRef = useRef<IDvsSignFormVal["deviceId"]>()
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map

  const [chooseTypeKey, setChooseTypeKey] = useState(1) // 默认选择当条设备
  const [deviceGroupKey, setDeviceGroupKey] = useState([]) // 选中的设备数组
  const [deviceList, setDeviceList] = useState([]) // 设备下拉数组
  const [mtlSignMap, setMtlSignMap] = useState<ISignTypeMap>({
    手动挂牌: {},
    二次判断: {},
    自动挂牌: {},
  })
  const [currentSignWay, setCurrentSignWay] = useState("手动挂牌")

  // 手动挂牌才可以编辑
  const signWayDisabled = useMemo(() => {
    if (disabled) return true
    if (currentSignWay === "手动挂牌" || currentSignWay === "自动挂牌") return false
    return true
  }, [disabled, currentSignWay])

  useImperativeHandle(ref, () => ({
    getValue: () => (chooseTypeKey === 1 ? getSignList(signMap) : getSignList(mtlSignMap)),
    isMultiple: chooseTypeKey === 2,
    deviceIdList: deviceGroupKey,
    setValue: (records: IDvsSignalRecordInfo[], deviceId: IDeviceData["deviceId"]) => {
      deviceIdRef.current = deviceId
      if (!records?.length) {
        setActiveSign(undefined)
        return setSignMap({
          手动挂牌: {},
          二次判断: {},
          自动挂牌: {},
        })
      }
      const sdSign = getSignWayInfo(records, "手动挂牌", deviceId)
      const gdSign = getSignWayInfo(records, "自动挂牌", deviceId)
      const ecSign = getSignWayInfo(records, "二次判断", deviceId)
      setSignMap({
        二次判断: ecSign,
        自动挂牌: gdSign,
        手动挂牌: sdSign,
      })
      setActiveSign(records?.[0].signState)
    },
  }))

  const getSignWayInfo = (records: IDvsSignalRecordInfo[], signWay, deviceId) => {
    const info: TSignMap =
      records
        ?.filter((i) => i.datasource === signWay)
        .reduce((prev, { signState, id, remark }) => {
          prev[signState] = { isChecked: true, operate: "edit", signState, remark, id, deviceId }
          return prev
        }, {} as TSignMap) || {}
    return info
  }
  const getSignList = (info: ISignTypeMap) => {
    const map = Object.values(info)
    return map?.reduce((prev, cur) => {
      prev = prev.concat(Object.values(cur))
      return [...prev]
    }, [] as IDvsSignFormVal[])
  }
  const signalOptions = useMemo(() => {
    if (!device) return []
    const prefix = device.deviceType === "WT" ? "1" : device.deviceType === "PVINV" ? "2" : "3"
    const dvsTypeSignal = deviceSignal?.filter((i: any) => i.signState.startsWith(prefix))
    const sign = dealSignalOptions(dvsTypeSignal as IDeviceSignal[])
    return sign
  }, [deviceSignal, device])

  const onCheckChgRef = useCallback<CheckboxGroupProps["onChange"]>(
    (checkedValue) => {
      const commonSetSignMap = chooseTypeKey === 1 ? setSignMap : setMtlSignMap
      commonSetSignMap((prevState) => {
        const curWay = prevState?.[currentSignWay]
        const signInfos: IDvsSignFormVal[] = Object.values(curWay)
        signInfos.forEach((info) => {
          info.isChecked = checkedValue.includes(info.signState)
          if (!info.isChecked && info.id) info.operate = "del"
        })
        ;(checkedValue as string[]).forEach((chdSign) => {
          if (curWay[chdSign]) return
          curWay[chdSign] = { isChecked: true, operate: "add", signState: chdSign, deviceId: deviceIdRef.current }
        })
        return { ...prevState }
      })
      if (!checkedValue?.length) return
      setActiveSign(checkedValue[checkedValue.length - 1] as string)
    },
    [chooseTypeKey, currentSignWay],
  )

  const activeSignRef = useRef(activeSign)
  activeSignRef.current = activeSign
  const onRemarkChgRef = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const commonSetSignMap = chooseTypeKey === 1 ? setSignMap : setMtlSignMap
      commonSetSignMap((prevState) => {
        const signWay = prevState[currentSignWay]
        const theSign = signWay[activeSignRef.current]
        if (!theSign) return { ...prevState }
        theSign.remark = e.target.value
        if (theSign.id) theSign.operate = "edit"
        return { ...prevState }
      })
    },
    [chooseTypeKey, currentSignWay],
  )

  // 判断选择设置类型，正确得出选中的挂牌情况
  const checkedSign = useMemo(() => {
    const checked = []
    const actualSignMap: TSignMap = chooseTypeKey === 1 ? signMap[currentSignWay] : mtlSignMap[currentSignWay]
    Object.values(actualSignMap).forEach((info) => {
      if (!info.isChecked) return
      checked.push(info.signState)
    })
    return checked
  }, [signMap, mtlSignMap, chooseTypeKey, currentSignWay])
  const theRemark = useMemo(() => {
    return chooseTypeKey === 1
      ? signMap[currentSignWay][activeSign]?.remark
      : mtlSignMap[currentSignWay][activeSign]?.remark
  }, [activeSign, signMap, chooseTypeKey, mtlSignMap, currentSignWay])

  const onChange = useRef((e: RadioChangeEvent) => {
    setChooseTypeKey(e.target.value)
  })
  const chooseDevice = useRef((e) => {
    // console.log(e)
    setDeviceGroupKey(e)
  })
  const getDeviceList = async (device) => {
    const deviceList = await queryDevicesByParams(
      {
        stationCode: device?.stationCode,
        deviceType: device?.deviceType,
      },
      deviceTypeMap,
    )
    const result = [
      {
        title: "所有设备",
        value: "all",
        children: deviceList.map((i) => {
          return {
            title: i.deviceName,
            value: i.deviceId,
          }
        }),
      },
    ]
    setDeviceList(result)
  }
  const onTabsChgRef = useRef((e) => {
    console.log(e, "看了觉得顺丰")
    setCurrentSignWay(e)
  })
  useEffect(() => {
    getDeviceList(device)
  }, [])
  return (
    <div className="signan-form-wrap">
      <div className="signan-form-choose">
        <Radio.Group onChange={onChange.current} value={chooseTypeKey}>
          <Radio value={1}>当前设备挂牌</Radio>
          <Radio value={2}>批量设备挂牌</Radio>
        </Radio.Group>
        {chooseTypeKey === 2 ? (
          <TreeSelect
            value={deviceGroupKey}
            treeData={deviceList}
            treeCheckable
            maxTagCount={1}
            treeNodeFilterProp="title"
            style={{ height: "2em", minWidth: "10em", marginLeft: "0.3125em" }}
            onChange={chooseDevice.current}
          />
        ) : (
          ""
        )}
      </div>
      <div>
        <Tabs
          type="editable-card"
          hideAdd
          tabBarGutter={4}
          items={tabs}
          activeKey={currentSignWay}
          onChange={onTabsChgRef.current}
        />
      </div>
      <div className="signan-form-content">
        <CustomCheckboxGroup
          disabled={signWayDisabled}
          options={signalOptions}
          value={checkedSign}
          onChange={onCheckChgRef}
          active={activeSign}
          onClick={setActiveSign}
        />
        <Input.TextArea disabled={signWayDisabled} value={theRemark} onChange={onRemarkChgRef} className="remark-box" />
      </div>
    </div>
  )
})

DeviceSignalForm.displayName = "DeviceSignalForm"
export default DeviceSignalForm
