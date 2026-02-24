/*
 * @Author: chenmeifeng
 * @Date: 2024-07-18 10:56:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 10:55:18
 * @Description:
 */
import "./index.less"

import { Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validOperate } from "@/utils/util-funs"
import QuotaForm from "./power-predict-form"
import ElecForm from "./elec-form"
import CpCvwForm from "./cp-ovw"
import RealtimeForm from "./day-trend-form"
import SXSiteForm from "./siteForm"
import ModelForm from "./model"
import SiteWeatherForm from "./site-power-form"
import YeatHourForm from "./year-use-hour-form"

export interface IPerateRef {}
export interface IPerateMdlProps {
  setOpenModal: any
  btnClk: (type, formData?) => void
}
const HbUpdateSetting = forwardRef<IPerateRef, IPerateMdlProps>((props, ref) => {
  const { setOpenModal, btnClk } = props
  const yearElecPredictRef = useRef(null)
  const elecRef = useRef(null)
  const cpOvwRef = useRef(null)
  const rltimeRef = useRef(null)
  const modalRef = useRef(null)
  const mapRef = useRef(null)
  const modelRef = useRef(null)
  const wthRef = useRef(null)
  const yuhRef = useRef(null)
  const getHeight = () => {
    modalRef.current.style.height = (window.innerHeight / 2363) * 180 + "em"
  }
  useEffect(() => {
    getHeight()
    window.addEventListener("resize", getHeight)
    return () => window.removeEventListener("resize", getHeight)
  }, [])
  const changeData = async () => {
    const elecData = elecRef.current
    const { formData: cpForm, useInterfaceData: cpIf } = cpOvwRef.current
    const { formData, useInterfaceData } = yearElecPredictRef.current
    const { formData: rtForm, useInterfaceData: rtIf } = rltimeRef.current
    // const { formData: siteMapForm, useInterfaceData: siteMapIf } = mapRef.current
    const { formData: modelForm, useInterfaceData: modelIf } = modelRef.current
    const { formData: wthForm, useInterfaceData: wthIf } = wthRef.current
    const { formData: yuhForm, useInterfaceData: yuhIf } = yuhRef.current
    // const companyQuota = cpnQtRef.current.formData

    const json = {
      yearElecPredict: { data: formData, useInterfaceData },
      electricity: { data: elecData.data, useInterfaceData: elecData.useInterfaceData },
      modelData: { data: modelForm, useInterfaceData: modelIf },
      weatherData: { data: wthForm, useInterfaceData: wthIf },
      dayTrendInfo: { data: rtForm, useInterfaceData: rtIf },
      capacityOverview: { data: cpForm, useInterfaceData: cpIf },
      // siteInfo: { list: siteMapForm, useInterfaceData: siteMapIf },
      yearHourData: { data: yuhForm, useInterfaceData: yuhIf },
    }
    // 记得放开
    const params = {
      id: 1,
      key: "hubei",
      data: JSON.stringify(json),
    }
    const res = await doBaseServer("updateMngStatic", params)
    const operate = validOperate(res)
    setOpenModal(false)
    btnClk?.("ok", json)
  }
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div ref={modalRef} className="hb-screen-form-modal">
      <div className="hb-screen-setting">
        <div className="setting-left">
          <div className="setting-rltime">
            <span className="setting-title">日负荷趋势：</span>
            <RealtimeForm ref={rltimeRef} />
          </div>

          <div className="setting-pdt">
            <span className="setting-title">发电量趋势：</span>
            <QuotaForm ref={yearElecPredictRef} />
          </div>
          <div className="setting-elec">
            <span className="setting-title">装机容量品牌占比：</span>
            <ModelForm ref={modelRef} />
          </div>
        </div>
        <div className="setting-center">
          {/* <span className="setting-title">地图数据</span>
          <SXSiteForm ref={mapRef} /> */}
          <div className="setting-realtime">
            <span className="setting-title">华中实时数据：</span>
            <CpCvwForm ref={cpOvwRef} />
          </div>
        </div>
        <div className="setting-right">
          <div className="setting-elec">
            <span className="setting-title">发电量概览：</span>
            <ElecForm ref={elecRef} />
          </div>
          <div className="setting-elec">
            <span className="setting-title">年利用小时数：</span>
            <YeatHourForm ref={yuhRef} />
          </div>
          <div className="setting-elec">
            <span className="setting-title">气象信息：</span>
            <SiteWeatherForm ref={wthRef} />
          </div>
        </div>
      </div>
      <div className="screen-btn">
        <Button onClick={changeData}>保存</Button>
      </div>
    </div>
  )
})
export default HbUpdateSetting
