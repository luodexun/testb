/*
 * @Author: chenmeifeng
 * @Date: 2024-08-28 16:38:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-24 10:48:27
 * @Description: 编辑告警规则详情
 */
import "./index.less"
import { Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import EditRulePoint from "./left"
import PiontContext from "../../configs/use-point-check"
import EditRuleForm from "./right"
import { getDvsMeasurePointsData } from "@/utils/device-funs"
import { IBatchStn2DvsTreeData } from "../../types"
import { IAlarmRuleLs, TEditType } from "../../types/table"

export interface IPerateRef {}
export interface IOperateProps {
  deviceId?: number
  data?: IAlarmRuleLs
  buttonClick?: (type: "ok" | "reset" | "close") => void
  loading?: boolean
  devices: Array<IBatchStn2DvsTreeData>
  editType: TEditType
}
const EditRuleModel = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { buttonClick, deviceId, data, devices, editType } = props
  const [curCheckPoint, serCurCheckPoint] = useState(null)
  const [cursorInfo, setCursorInfo] = useState(null)
  const [exitPointList, setExitPointList] = useState([])
  const [chooseDeviceLs, setChooseDeviceLs] = useState([])
  const [curDevice, setCurDevice] = useState(null)

  const getPoints = async () => {
    const res = await getDvsMeasurePointsData({ modelId: devices?.[0].modelId, pointTypes: "1,2" })
    setExitPointList(res)
  }
  useEffect(() => {
    getPoints()
  }, [])
  useEffect(() => {
    setChooseDeviceLs(devices)
  }, [devices])
  useEffect(() => {
    setCurDevice(data)
  }, [data])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    // confirmMsg: confirmMsg,
  }))
  return (
    <div className="ar-edit">
      <PiontContext.Provider
        value={{
          curCheckPoint,
          serCurCheckPoint,
          cursorInfo,
          setCursorInfo,
          exitPointList,
          setExitPointList,
          chooseDeviceLs,
          setChooseDeviceLs,
          curDevice,
          setCurDevice,
        }}
      >
        <div className="ar-edit-left">
          <EditRulePoint deviceId={deviceId} />
        </div>
        <div className="ar-edit-right">
          <EditRuleForm device={data} buttonClick={buttonClick} editType={editType} />
        </div>
      </PiontContext.Provider>
    </div>
  )
})

export default EditRuleModel
