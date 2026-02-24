/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 16:02:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-28 11:32:02
 * @Description:
 */
import { getParamDataFromUrl } from "@/utils/menu-funs"
import "./index.less"
import { AtomStation } from "@/store/atom-station"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router"
import NamePanel from "../area-matrix/components/name-panel"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import { changePar, getSiteDvSchData, transformCurData } from "./methods"
import { IFormInst } from "@/components/custom-form/types"
import { SIT_DEVICE_COLUMNS } from "./configs"
import { IDeviceData } from "@/types/i-device"
import useMqttDvsPoint from "@/hooks/use-mqtt-dvs-point"
import PointDrawer from "@pages/site-device/components/point-drawer"
import { IControlParamMap } from "@/components/device-control/types"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step"
import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step"
import PointTrendChart from "./components/energy-trend-chart"

export default function SiteFrequencyDevice() {
  const formRef = useRef<IFormInst | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showDrawn, setShowDrawn] = useState(false)
  const [allRealtimeDvsPoint, setAllRealtimeDvsPoint] = useState(null)
  const [operateInfo, setOperateInfo] = useState<IDeviceData>(null)
  const controlParamMapRef = useRef<IControlParamMap>({})
  const [operateCellInfo, setOperateCellInfo] = useState<IControlParamMap["executeInfo"]>()
  const [openIpModal, setOpenIpModal] = useState(false)
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const [modalLoading, setLoading] = useState(false)
  const { stationMap } = useAtomValue(AtomStation)

  const { pathname } = useLocation()

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])
  const deviceType = useMemo(() => {
    const type = getParamDataFromUrl(pathname, 4)
    return type.toUpperCase()
  }, [pathname, stationMap])
  useMqttDvsPoint({
    deviceType: "yctp",
    stationCode: stationInfo?.stationCode,
    setPointData: setAllRealtimeDvsPoint,
  })
  const { dataSource, loading, pagination, onSearch } = usePageSearch(
    { serveFun: getSiteDvSchData },
    {
      otherParams: {
        stationCode: stationInfo?.stationCode,
        deviceType: "YCTP", // deviceType
      },
    },
  )

  const onTbAction = useRef((record) => {
    setOperateInfo(record)
    setShowDrawn(true)
  })
  const openCtl = useRef((key, record) => {
    console.log(key, record)
    controlParamMapRef.current.executeInfo = transformCurData(record, key)
    setOperateCellInfo(controlParamMapRef.current.executeInfo)
    setOpenIpModal(true)
  })
  const realtimeDvsLs = useMemo(() => {
    if (!allRealtimeDvsPoint || !dataSource?.length) return false
    const actualLs = dataSource.map((i) => {
      const ls = allRealtimeDvsPoint?.[i.deviceCode] || {}
      return {
        ...i,
        ...ls,
      }
    })
    return actualLs
  }, [allRealtimeDvsPoint, dataSource])
  const { stepBtnClkRef } = useDvsControlStep({
    controlParamMapRef,
    modalRef,
    setOpenModal: setOpenIpModal,
    setLoading,
  })
  useEffect(() => {
    changePar()
    onSearch()
    return () => {
      changePar()
    }
  }, [stationInfo])
  return (
    <div className="l-full site-dv-wrap" ref={containerRef}>
      {/* <CardTitle children={stationInfo?.shortName} /> */}
      <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" />
      <div className="site-dv-table">
        <CustomTable
          rowKey="row_idx"
          limitHeight
          loading={loading}
          columns={SIT_DEVICE_COLUMNS({ onClick: onTbAction.current, openCtl: openCtl.current })}
          dataSource={realtimeDvsLs || dataSource}
          pagination={dataSource.length > 50 ? pagination : false}
        />
      </div>
      <div className="site-dv-chart">
        <PointTrendChart dataSource={dataSource} />
      </div>
      <CustomModal<IOperateStepProps, IOperateStepRef>
        ref={modalRef}
        width="30%"
        title="设备控制"
        destroyOnClose
        open={openIpModal}
        footer={null}
        onCancel={setOpenIpModal.bind(null, false)}
        Component={OperateStep}
        componentProps={{ loading: modalLoading, data: operateCellInfo, buttonClick: stepBtnClkRef.current }}
      />
      <PointDrawer
        containerDom={containerRef.current}
        showDrawn={showDrawn}
        clickDevice={operateInfo}
        setShowDrawn={setShowDrawn}
        deviceList={dataSource}
      />
    </div>
  )
}
