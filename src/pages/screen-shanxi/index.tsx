/*
 * @Author: chenmeifeng
 * @Date: 2024-07-12 16:17:54
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-09 15:18:44
 * @Description:
 */
import "./index.less"

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react"
import { useSetAtom } from "jotai"
import { mainComSetAtom } from "@/store/atom-screen-data"
import { useRefresh } from "@/hooks/use-refresh"
import { getScreenPointData } from "@/utils/screen-funs"
import { doBaseServer } from "@/api/serve-funs"
import { changejson, testScreenData } from "./configs/form-data"
import { validResErr } from "@/utils/util-funs"
import LargeScreenContext from "@/contexts/screen-context"
import CustomModal from "@/components/custom-modal"
import UpdateSetting, { IPerateMdlProps, IPerateRef } from "./components/update"
const SxHeader = lazy(() => import("./components/header"))
const SXElec = lazy(() => import("./components/electricity"))
const SXRealtime = lazy(() => import("./components/realtime"))
const SXPredictPower = lazy(() => import("./components/power-generation"))
const SXOverview = lazy(() => import("./components/overview"))
const SXCenterMap = lazy(() => import("./components/center"))
export default function SxScreen() {
  const [settingData, setSettingData] = useState(testScreenData)
  const setScreenMainValue = useSetAtom(mainComSetAtom)
  const [openModal, setOpenModal] = useState(false)
  const [openupdateMenu, setOpenupdateMenu] = useState(false)
  const modalRef = useRef(null)
  const [reload, setReload] = useRefresh(3000) // 3s

  const initData = async () => {
    // 获取接口临时数据
    const res = await doBaseServer("queryMngStatic", { key: "shanxi" })
    if (validResErr(res)) return
    setSettingData(JSON.parse(res.data))
    changejson(JSON.parse(res.data))
  }
  //获取实时数据，有几个模块同时用到
  const initActualData = async () => {
    const mainInfo = await getScreenPointData()
    if (!mainInfo) return
    setScreenMainValue({
      mainComInfo: mainInfo,
      call: () => {
        setReload(false)
      },
    })
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
      // setSettingData((prev) => {
      //   return {
      //     ...prev,
      //     ...formData,
      //   }
      // })
      initData()
    }
    setOpenupdateMenu(false)
  })
  const clickScreen = () => {
    setOpenupdateMenu(false)
  }
  useEffect(() => {
    if (!reload) return
    initActualData()
  }, [reload])
  useEffect(() => {
    initData()
  }, [])
  useEffect(() => {
    return () => {
      setScreenMainValue({
        mainComInfo: null,
      })
    }
  }, [])
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LargeScreenContext.Provider
          value={{ quotaInfo: settingData, setQuotaInfo: setSettingData, setOpenupdateMenu, openupdateMenu }}
        >
          <div className="sx-screen" onClick={clickScreen}>
            <SxHeader openUpdateForm={openUpdateForm} />
            <div className="sx-screen-content">
              <div className="sx-screen-left">
                <div className="screen-lr50-box">
                  <SXElec />
                </div>
                <div className="screen-lr49-box">
                  <SXPredictPower />
                </div>
              </div>
              <div className="sx-screen-center">
                <SXCenterMap />
              </div>
              <div className="sx-screen-right">
                <div className="screen-lr40-box">
                  <SXOverview />
                </div>
                <div className="screen-lr60-box">
                  <SXRealtime />
                </div>
              </div>
            </div>
          </div>
          <CustomModal<IPerateMdlProps, IPerateRef>
            ref={modalRef}
            width="90%"
            title="修改属性"
            destroyOnClose
            open={openModal}
            footer={null}
            onCancel={() => {
              setOpenModal(false)
              setOpenupdateMenu(false)
            }}
            Component={UpdateSetting}
            componentProps={{ setOpenModal, btnClk: btnClk.current }}
          />
        </LargeScreenContext.Provider>
      </Suspense>
    </div>
  )
}
