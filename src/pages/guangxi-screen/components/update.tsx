/*
 * @Author: chenmeifeng
 * @Date: 2024-02-22 09:31:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 14:07:58
 * @Description:
 */
import "./update.less"

import { Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validOperate } from "@/utils/util-funs"

import { changeJson } from "../configs/configs"
import ComQtForm from "./company-quota-form"
import CompanyInfo from "./companyInfo"
import QuotaForm from "./quotaForm"
import SiteForm from "./siteForm"
export interface IPerateRef {}
export interface IPerateMdlProps {
  setOpenModal: any
  btnClk: (type) => void
}
const UpdateSetting = forwardRef<IPerateRef, IPerateMdlProps>((props, ref) => {
  const { setOpenModal, btnClk } = props
  const quotaRef = useRef(null)
  const companyRef = useRef(null)
  const cpnQtRef = useRef(null)
  const siteRef = useRef(null)
  const modalRef = useRef(null)
  const getHeight = () => {
    modalRef.current.style.height = (window.innerHeight / 2363) * 180 + "em"
  }
  useEffect(() => {
    getHeight()
    window.addEventListener("resize", getHeight)
    return () => {
      window.removeEventListener("resize", getHeight)
    }
  }, [])
  const changeData = async () => {
    changeJson("quotaList", quotaRef.current.formData)
    changeJson("companyInfo", companyRef.current.formData)
    changeJson("siteInfo", siteRef.current.formData)
    changeJson("companyQuota", cpnQtRef.current.formData)
    const companyInfo = companyRef.current.formData
    const siteInfo = siteRef.current.formData
    const quotaList = quotaRef.current.formData
    const companyQuota = cpnQtRef.current.formData
    console.log(companyQuota, "companyQuota")

    const json = { companyInfo, siteInfo, quotaList, companyQuota }
    const params = {
      id: 1,
      key: "guangXi",
      data: JSON.stringify(json),
    }
    const res = await doBaseServer("updateMngStatic", params)
    validOperate(res)
    setOpenModal(false)
    btnClk?.("ok")
  }
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div ref={modalRef} className="screen-modal">
      <div className="screen-setting">
        <div className="setting-company">
          <span>公司资料编辑：</span>
          <CompanyInfo ref={companyRef} />
          <ComQtForm ref={cpnQtRef} />
        </div>
        <div className="setting-site">
          <span>地图场站：</span>
          <SiteForm ref={siteRef} />
        </div>
        <div className="setting-quota">
          <span>指标：</span>
          <QuotaForm ref={quotaRef} />
        </div>
      </div>
      <div className="screen-btn">
        <Button onClick={changeData}>保存</Button>
      </div>
    </div>
  )
})
export default UpdateSetting
