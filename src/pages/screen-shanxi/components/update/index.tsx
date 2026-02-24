/*
 * @Author: chenmeifeng
 * @Date: 2024-07-18 10:56:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 17:36:28
 * @Description:
 */
import "./index.less"

import { Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validOperate, validResErr } from "@/utils/util-funs"
import QuotaForm from "./power-predict-form"
import ElecForm from "./elec-form"
import CpCvwForm from "./cp-ovw"
import RealtimeForm from "./realtime-form"
import SXSiteForm from "./siteForm"
import ModelForm from "./model"
import LargeScreenContext from "@/contexts/screen-context"
import { testScreenData } from "../../configs/form-data"

export interface IPerateRef {}
export interface IPerateMdlProps {
  setOpenModal: any
  btnClk: (type, formData?) => void
}
const UpdateSetting = forwardRef<IPerateRef, IPerateMdlProps>((props, ref) => {
  const { setOpenModal, btnClk } = props
  const yearElecPredictRef = useRef(null)
  const elecRef = useRef(null)
  const cpOvwRef = useRef(null)
  const rltimeRef = useRef(null)
  const modalRef = useRef(null)
  const mapRef = useRef(null)
  const modelRef = useRef(null)
  const [settingData, setSettingData] = useState(testScreenData)

  const initData = async () => {
    // 获取接口临时数据
    const res = await doBaseServer("queryMngStatic", { key: "shanxi" })
    if (validResErr(res)) return
    setSettingData(JSON.parse(res.data))
    // changejson(JSON.parse(res.data))
  }
  const changeData = async () => {
    const elecData = elecRef.current
    const { formData: cpForm, useInterfaceData: cpIf } = cpOvwRef.current
    const { formData, useInterfaceData } = yearElecPredictRef.current
    const { formData: rtForm, useInterfaceData: rtIf, rltimeInfo } = rltimeRef.current
    const { formData: siteMapForm, useInterfaceData: siteMapIf } = mapRef.current
    const { formData: modelForm, useInterfaceData: modelIf } = modelRef.current
    // const companyQuota = cpnQtRef.current.formData

    const json = {
      yearElecPredict: { data: formData, useInterfaceData },
      electricity: { data: elecData.data, rate: elecData.rate, useInterfaceData: elecData.useInterfaceData },
      modelData: { data: modelForm, useInterfaceData: modelIf },
      realtimeInfo: { data: rltimeInfo, list: rtForm, useInterfaceData: rtIf },
      capacityOverview: { data: cpForm, useInterfaceData: cpIf },
      siteInfo: { list: siteMapForm, useInterfaceData: siteMapIf },
    }
    // 记得放开
    const params = {
      id: 1,
      key: "shanxi",
      data: JSON.stringify(json),
    }
    const res = await doBaseServer("updateMngStatic", params)
    const operate = validOperate(res)
    setOpenModal(false)
    btnClk?.("ok", json)
  }
  const getHeight = () => {
    modalRef.current.style.height = (window.innerHeight / 2363) * 180 + "em"
  }
  useEffect(() => {
    getHeight()
    window.addEventListener("resize", getHeight)
    return () => window.removeEventListener("resize", getHeight)
  }, [])

  useEffect(() => {
    initData()
  }, [])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <LargeScreenContext.Provider value={{ quotaInfo: settingData, setQuotaInfo: setSettingData }}>
      <div ref={modalRef} className="sx-screen-modal">
        <div className="sx-screen-setting">
          <div className="setting-left">
            <div className="setting-elec">
              <span className="setting-title">发电量：</span>
              <ElecForm ref={elecRef} />
            </div>
            <div className="setting-pdt">
              <span className="setting-title">预测电量：</span>
              <QuotaForm ref={yearElecPredictRef} />
            </div>
            <div className="setting-elec">
              <span className="setting-title">机型占比：</span>
              <ModelForm ref={modelRef} />
            </div>
          </div>
          <div className="setting-center">
            <span className="setting-title">地图数据</span>
            <SXSiteForm ref={mapRef} />
          </div>
          <div className="setting-right">
            <div className="setting-elec">
              <span className="setting-title">装机概况：</span>
              <CpCvwForm ref={cpOvwRef} />
            </div>
            <div className="setting-rltime">
              <span className="setting-title">实时信息：</span>
              <RealtimeForm ref={rltimeRef} />
            </div>
          </div>
        </div>
        <div className="screen-btn">
          <Button onClick={changeData}>保存</Button>
        </div>
      </div>
    </LargeScreenContext.Provider>
  )
})
export default UpdateSetting
