/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 14:47:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-17 14:43:08
 * @Description:
 */
import "./center.less"

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react"
import HbUpdateSetting, { IPerateMdlProps, IPerateRef } from "./update"
import CustomModal from "@/components/custom-modal"
import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"
import { changejson, testScreenData } from "../configs/form-json"
import LargeScreenContext from "@/contexts/screen-context"
import { getScreenStaticInfo } from "../methods"
const HubeiScreenHeader = lazy(() => import("./header/header"))
const CenterContent = lazy(() => import("./center/center"))
export default function Hb1SrcTtCenter() {
  const [openModal, setOpenModal] = useState(false)
  const [settingData, setSettingData] = useState(testScreenData)
  const modalRef = useRef(null)

  const initData = async () => {
    // 获取接口临时数据
    const res = await getScreenStaticInfo()
    setSettingData(JSON.parse(res.data))
    // changejson(JSON.parse(res.data))
  }
  const openUpdateForm = useCallback(
    (e) => {
      setOpenModal(e)
    },
    [openModal],
  )
  const btnClk = useRef((type, formData) => {
    if (type === "ok") {
      // 护网测试阶段启用，因为没接口数据
      setSettingData((prev) => {
        return {
          ...prev,
          ...formData,
        }
      })
      initData()
    }
  })
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="l-full hb1-tc">
      <LargeScreenContext.Provider value={{ quotaInfo: settingData, setQuotaInfo: setSettingData }}>
        <Suspense fallback={<div>Loading...</div>}>
          <HubeiScreenHeader openUpdateForm={openUpdateForm} />
          <div className="hb1-tc-content">
            <CenterContent />
          </div>
          <CustomModal<IPerateMdlProps, IPerateRef>
            ref={modalRef}
            width="90%"
            title="修改属性"
            destroyOnClose
            open={openModal}
            footer={null}
            onCancel={() => setOpenModal(false)}
            Component={HbUpdateSetting}
            componentProps={{ setOpenModal, btnClk: btnClk.current }}
          />
        </Suspense>
      </LargeScreenContext.Provider>
    </div>
  )
}
