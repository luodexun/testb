/*
 * @Author: chenmeifeng
 * @Date: 2025-02-24 10:29:40
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-08 17:33:57
 * @Description:
 */
import HbScreenContext from "@/contexts/hubei-screen-context"
import { useContext, useEffect, useMemo, useState } from "react"
import { getStorage, judgeNull, parseNum } from "@/utils/util-funs"
import "./right.less"
import { CENTER_QUOTA } from "../../configs"
import LnCommonQuotaBox from "../common-quota"
import { AtomStation } from "@/store/atom-station"
import { useAtomValue } from "jotai"
import { StorageCompanyData } from "@/configs/storage-cfg"
import { Select } from "antd"
import { commonDealInfo, getScreenPointData, getTypeList } from "@/utils/screen-funs"
import { useRefresh } from "@/hooks/use-refresh"
import { mainComAtom } from "@/store/atom-screen-data"
const opts = [
  { label: "区域", key: "REGION_COM_ID" },
  { label: "基地", key: "MAINTENANCE_COM_ID" },
  // { label: "项目", key: "PROJECT_COM_ID" },
  { label: "场站", key: "STATION_CODE" },
]
export default function LNCenterRight() {
  const [currentKey, setCurrentKey] = useState<
    "REGION_COM_ID" | "MAINTENANCE_COM_ID" | "STATION_CODE" | "PROJECT_COM_ID"
  >("REGION_COM_ID")
  const [currentChoose, setCurrentChoose] = useState("")
  const [allInfo, setAllInfo] = useState([])
  const [curQuotaInfo, setCurQuotaInfo] = useState(null)
  const [reload, setReload] = useRefresh(3000)
  const { stationList } = useAtomValue(AtomStation)
  const mainCpnInfo = useAtomValue(mainComAtom)

  const selectOpts = useMemo(() => {
    let result = []
    if (currentKey === "STATION_CODE") {
      result = stationList?.map((i) => {
        return {
          value: i.stationCode,
          label: i.shortName,
        }
      })
    } else {
      const companys = getStorage(StorageCompanyData)
      const type = currentKey === "MAINTENANCE_COM_ID" ? "MAINTENANCE" : "PROJECT"
      result = companys
        ?.filter((j) => j.type === type)
        ?.map((i) => {
          return {
            value: i.id,
            label: i.shortName,
          }
        })
    }
    return result || []
  }, [currentKey, stationList])
  const changeType = (key) => {
    setCurrentKey(key)
  }
  const getCurrentKey = (e) => {
    setCurrentChoose(e)
    setReload(true)
  }
  const getMainInfo = async () => {
    const mainInfo = await getTypeList(currentKey)
    if (!mainInfo) return
    setReload(false)
    setAllInfo(mainInfo)
  }
  useEffect(() => {
    if (!reload || currentKey === "REGION_COM_ID") return
    getMainInfo()
  }, [currentKey, reload])
  useEffect(() => {
    const firstInfo = selectOpts?.[0]
    setCurrentChoose(firstInfo?.value || "")
  }, [currentKey])
  useEffect(() => {
    const key =
      currentKey === "STATION_CODE"
        ? "stationCode"
        : currentKey === "MAINTENANCE_COM_ID"
          ? "maintenanceComId"
          : "projectComId"
    if (currentKey === "REGION_COM_ID") setCurQuotaInfo(mainCpnInfo)
    if (!currentChoose || currentKey === "REGION_COM_ID") return
    const res = allInfo?.find((i) => i[key] === currentChoose)
    setCurQuotaInfo(commonDealInfo(Object.assign({}, res)))
    // setCurQuotaInfo(allInfo)
  }, [currentChoose, allInfo, currentKey, mainCpnInfo])
  return (
    <div className="ln-cright">
      <div className="cright-top">
        {opts?.map((i) => {
          return (
            <span
              key={i.key}
              onClick={() => changeType(i.key)}
              className={`cright-top-item ${currentKey === i.key ? "active" : ""}`}
            >
              {i.label}
            </span>
          )
        })}
      </div>
      <div className="cright-cnt">
        {currentKey !== "REGION_COM_ID" ? (
          <Select
            popupClassName="ln-screen-select"
            value={currentChoose}
            options={selectOpts}
            onChange={getCurrentKey}
            allowClear={false}
            style={{ width: "140px" }}
          ></Select>
        ) : (
          ""
        )}
        {CENTER_QUOTA?.map((i) => {
          return (
            <LnCommonQuotaBox
              key={i.key}
              name={i.name}
              unit={i.unit}
              value={judgeNull(curQuotaInfo?.[i.key], i.needUnitTrans || 1, 2, "-")}
            />
          )
        })}
      </div>
    </div>
  )
}
