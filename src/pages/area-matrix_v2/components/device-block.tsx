/*
 * @Author: chenmeifeng
 * @Date: 2024-12-10 11:48:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-10 15:20:40
 * @Description: 设备列表
 */
import "./device-block.less"
import { useContext, useMemo } from "react"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { IDeviceData } from "@/types/i-device"
import { isEmpty, reduceList2KeyValueMap } from "@/utils/util-funs"
import classnames from "classnames"
import DeviceDetail from "./device-detail"
import { AtomConfigMap } from "@/store/atom-config"
import { useAtomValue } from "jotai"
const NOT_GROUP = "NOT_GROUP"
interface IProps {
  deviceList: IDeviceData[]
}
function isNotGroup(lineName: string) {
  return isEmpty(lineName) || lineName === NOT_GROUP
}
export default function DeviceBlock(props: IProps) {
  const { deviceList } = props

  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const { currentLayout, deviceType } = useContext(DvsDetailContext)
  const { nameList, groupMap } = useMemo(() => {
    const bySite = currentLayout === "site"
    const groupBy = bySite ? NOT_GROUP : currentLayout
    const fieldInfo = { vField: groupBy }
    const groupMap = bySite ? { [NOT_GROUP]: deviceList || [] } : reduceList2KeyValueMap(deviceList, fieldInfo, [])
    const nameList = Object.keys(groupMap)
    return { nameList, groupMap }
  }, [currentLayout, deviceList])
  return (
    <div className="area-matrix-dvsblock">
      {nameList.map((lineName) => (
        <div key={lineName} className={classnames("line-metrix-group", { "matrix-by-group": !isNotGroup(lineName) })}>
          {isNotGroup(lineName) ? null : <div className="line-name" children={lineName} />}
          <div className="line-group">
            {groupMap[lineName]?.map(({ runData, ...deviceInfo }) => {
              return (
                <DeviceDetail
                  key={deviceInfo.deviceCode}
                  state={runData}
                  deviceType={deviceType}
                  device={deviceInfo as IDeviceData}
                  deviceTypeMap={deviceTypeMap}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
