/*
 * @Author: chenmeifeng
 * @Date: 2023-10-13 11:30:39
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-27 14:41:41
 * @Description:
 */
import "./index.less"

// import { toMonitorPage } from "@pages/alarm-history/methods"
import { Button, Dropdown, MenuProps, Pagination, Space } from "antd"
import { useAtomValue, useSetAtom } from "jotai"
import { cloneDeep } from "lodash"
import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { doBaseServer } from "@/api/serve-funs"
import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import { StorageOtherMsg } from "@/configs/storage-cfg"
import useTableSelection from "@/hooks/use-table-selection"
import { AlarmListData, TAlarmHistoryTbActInfo } from "@/pages/alarm-history/types"
import { alarmCountInfoSetAtom, alarmInfoAtom } from "@/store/atom-alarm"
import { dealDownload4Response } from "@/utils/file-funs"
import { getStorage, showMsg } from "@/utils/util-funs"

import CommonCard from "./components/common-search"
import {
  ALARM_HISTORY_COLUMNS,
  ALARM_HISTORY_DETAIL_COLUMNS,
  REAL_CHECKBOX_OPTS,
  alarmLevelIdListSearchList,
  allDeviceTypeSearchList,
  confirmFlagSearchList,
} from "./config/index"
import { CardParams, TableParams } from "./config/types"
import { IQueryAlarmParams } from "./config/types"
import { doExportRealtime, getAlarmLevelByDvsTypes, getRealAlarmCounts, serialNumber } from "./methods"
import { bacthPass } from "@/utils/device-funs"
import { useRefresh } from "@/hooks/use-refresh"
import { EXPORT_LIST1 } from "@/configs/option-const"
import PropertyBox from "@/components/property-checkbox"

const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: AlarmListData) => ({
    disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15, // Column configuration not to be checked
    name: record.alarmDesc,
  }),
}
export default function AlarmCenter() {
  const [data, setData] = useState([])
  const containerRef = useRef(null)

  const navigate = useNavigate()

  // 表格分页数据
  const [pagination, setPagination] = useState<TableParams>({
    current: 1,
    pageSize: 50,
    total: 0,
  })

  // 全部设备类型数据
  const [deviceTypeList, setAllDeviceTypeSearchList] = useState<CardParams[]>(allDeviceTypeSearchList)
  // 确认
  const [ConfirmSeaL, setConfirmFlagSearchList] = useState<CardParams[]>(confirmFlagSearchList)
  // 告警等级
  const [alarmListSearchList, setAlarmLevelIdListSearchList] = useState<CardParams[]>(alarmLevelIdListSearchList)

  const childRef: MutableRefObject<any> = useRef(null)
  // 搜索数据
  const [, setParamsData] = useState<any>({})
  // 选择框
  const [selectionType] = useState<"checkbox" | "radio">("checkbox")
  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)
  const [tableLoading, setTableLoading] = useState(false)

  const [callbackRefresh, setCallbackRefresh] = useState(false)
  const canSearch = useRef(true) // 判断是否可以请求查询接口，防止接口响应速度慢重复请求问题
  const isFirst = useRef(false)
  const [canRefresh, setCanRefresh] = useState(0)

  const [reload, setReload] = useRefresh(15 * 1000)
  const [chooseDeviceTypes, setChooseDeviceTypes] = useState([])
  const alarmCounts = useRef(null)
  const setGlobalValue = useSetAtom(alarmCountInfoSetAtom)
  const tableRowSlt = useMemo<any>(() => {
    return {
      type: "checkbox",
      ...rowSelection,
    }
  }, [rowSelection])

  const formLsOptions = useMemo(() => {
    return [
      { key: "deviceType", title: "设备类型", list: deviceTypeList },
      { key: "confirm", title: "确认", list: ConfirmSeaL },
      { key: "level", title: "告警等级", list: alarmListSearchList },
    ]
  }, [deviceTypeList, ConfirmSeaL, alarmListSearchList])

  const [property, setProperty] = useState(null)
  const [openProperty, setOpenProperty] = useState(false)

  const searchOrExportForm = () => {
    const actualData = childRef?.current?.actualData

    const confirmFlag = setActualData("confirm", actualData)

    return {
      deviceTypeList: setActualData("deviceType", actualData),
      alarmLevelIdList: setActualData("level", actualData).length ? setActualData("level", actualData) : [], // 告警等级id列表， 没有信息这个
      confirmFlag: confirmFlag.length
        ? confirmFlag.length > 1
          ? null
          : confirmFlag.includes("1")
            ? true
            : false
        : null,
    }
  }

  const onSearch = useCallback(
    async (flag = false, noLoading = false) => {
      canSearch.current = false
      if (!noLoading) {
        // 防止定时刷新时页面出现加载圈圈
        setTableLoading(true)
      }
      if (flag) {
        setPagination({
          ...pagination,
          current: 1,
        })
      }
      const param = searchOrExportForm()
      setParamsData(param)
      const res = await doBaseServer<IQueryAlarmParams>("getfilterRealTimeMsgData", {
        data: param,
        params: { pageNum: flag ? 1 : pagination.current, pageSize: pagination.pageSize },
      })
      setReload(false)
      if (res && res.list) {
        setData([
          ...res.list.map((i, idx) => {
            return {
              ...i,
              id: `${i.alarmId}_${i.stationCode}_${i.startTime}_${i.deviceId}_${i.alarmLevelId}`,
              index: serialNumber(pagination.current, pagination.pageSize, idx + 1),
            }
          }),
        ])
        setPagination({
          ...pagination,
          current: flag ? 1 : pagination.current,
          total: res.total,
        })
      }
      setTableLoading(false)
      setCallbackRefresh(true)
      canSearch.current = true
    },
    [pagination],
  )

  const value = useAtomValue(alarmInfoAtom)

  // 渲染搜索栏各数据数量
  const renderSFormTotal = (data) => {
    setAllDeviceTypeSearchList([
      ...allDeviceTypeSearchList.map((i) => {
        return {
          ...i,
          num: data?.deviceTypeCount?.[i.dataIndex] || 0,
        }
      }),
    ])
    setConfirmFlagSearchList([
      ...confirmFlagSearchList.map((i) => {
        return {
          ...i,
          num: data?.confirmFlagCount?.[i.dataIndex] || 0,
        }
      }),
    ])
    setAlarmLevelIdListSearchList([
      ...alarmListSearchList.map((i) => {
        return {
          ...i,
          num: data?.alarmLevelCount?.[i.dataIndex] || 0,
        }
      }),
    ])
  }

  // 处理
  const setActualData = (key, list) => {
    return list.find((i) => i.key === key)?.choose.map((j) => j.code) || []
  }

  const clickBoxItem = useCallback(() => {
    if (callbackRefresh) {
      const dvsTypeChoose = childRef.current?.actualData.find((i) => i.key === "deviceType")?.choose
      const dvsTypeChooseKeys = dvsTypeChoose?.map((i) => i.dataIndex) || []
      setChooseDeviceTypes(dvsTypeChooseKeys)
      onSearch(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackRefresh])

  useEffect(() => {
    const dvsTypes = getAlarmLevelByDvsTypes(chooseDeviceTypes)
    const arr = dvsTypes.map((i) => {
      return {
        ...i,
        num: alarmCounts.current?.[i.dataIndex] || 0,
      }
    })
    setAlarmLevelIdListSearchList(arr)
  }, [chooseDeviceTypes])

  const getAlarmCounts = async () => {
    const res = await getRealAlarmCounts()
    alarmCounts.current = res.alarmLevelCount
    renderSFormTotal(res)
  }
  //分页器事件调用
  const onChangePage = (current, pageSize) => {
    setPagination((prevPagination) => {
      const updatedPagination = cloneDeep(prevPagination)
      updatedPagination.current = current
      updatedPagination.pageSize = pageSize
      return updatedPagination
    })
    setCanRefresh(canRefresh + 1)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modeRef = useRef(null)
  // 判断是否点击了列表中的确认操作
  const [isOperateCell, setOperateState] = useState(false)
  // 设置选中的一条数据
  const [operateOneAlarmData, setOperateOneAlarmData] = useState([])

  const onTbAction = (record: AlarmListData, { key }: TAlarmHistoryTbActInfo) => {
    if (key === "ensure") {
      setIsModalOpen(true)
      setOperateState(true)
      setOperateOneAlarmData([record])
    } else if (key === "toMonitor") {
      navigate(
        `/alarm/history?stationId=${record.stationId}&deviceType=${record.deviceType}&deviceIds=${[record.deviceId]}`,
      )
      // toMonitorPage(record, navigate)
    }
  }

  const btnClkRef = async (type: "ok" | "close", data: string) => {
    // 执行
    if (type === "ok") {
      const res = await bacthPass(isOperateCell ? operateOneAlarmData : selectedRows, data)
      if (!res) return
      onSearch()
      setIsModalOpen(false)
      setOperateState(false)
      setSelectedRowKeys([])
      setSelectedRows([])
      await getAlarmCounts()
      // 更新系统右上角实时告警条数
      setGlobalValue({
        // alarmInfo: {},
        call: (isErr: boolean) => {
          if (!isErr) return
        },
        // showMqttCount: false,
      })
    }
    if (type === "close") return setIsModalOpen(false)
  }

  const batchConfirm = () => {
    if (!selectedRows.length) {
      return showMsg("请至少选择一条！")
    }
    setIsModalOpen(true)
  }

  // 动态变化表头
  const [columnList, setColumnList] = useState(true)
  const changeColumn = () => {
    setColumnList(!columnList)
  }
  const actColumn = useMemo(() => {
    if (!columnList) return ALARM_HISTORY_COLUMNS({ onClick: onTbAction }, property)
    return ALARM_HISTORY_DETAIL_COLUMNS({ onClick: onTbAction }, property)
  }, [columnList, property])

  // 导出
  const exportFile: MenuProps["onClick"] = ({ key }) => {
    const params = { ...searchOrExportForm() }
    params["fileType"] = parseInt(key)
    doExportRealtime(params)
  }

  const propertyClk = useRef((type, propertyInfo) => {
    if (type === "comfirm") {
      setProperty(propertyInfo)
    } else {
      setOpenProperty(false)
    }
  })

  useEffect(() => {
    if (value?.alarmCounts) {
      alarmCounts.current = value.alarmCounts
      renderSFormTotal(value.alarmCounts)
      if (canSearch.current) {
        onSearch(false, true)
      }
    }
  }, [value])

  useEffect(() => {
    if (canRefresh && callbackRefresh) {
      onSearch(false, true)
    }
  }, [canRefresh])
  useEffect(() => {
    if (!reload) return
    getAlarmCounts()
    if (!isFirst.current) {
      isFirst.current = true
      // 是否是告警弹框跳过来
      const getJumpInfo = getStorage(StorageOtherMsg)
      if (getJumpInfo?.length) {
        setTimeout(() => {
          onSearch(true)
        }, 500)
        return
      }
      if (canSearch.current) {
        onSearch()
      }
      return
    }
    onSearch(false, true)
  }, [reload])
  return (
    <div className="alarm-real" ref={containerRef}>
      {/* {contextHolder} */}
      <div className="alarm-real-header">
        <div className="alarm-real-header--search">
          <CommonCard ref={childRef} onclickItem={clickBoxItem} options={formLsOptions} />
        </div>
        <div className="alarm-real-header--btn">
          <Space>
            <Button htmlType="submit" type="primary" onClick={batchConfirm}>
              批量确认
            </Button>
            <Dropdown
              menu={{ items: EXPORT_LIST1, onClick: exportFile }}
              placement="bottomLeft"
              getPopupContainer={() => containerRef.current}
            >
              <Button>导出</Button>
            </Dropdown>
            <Button htmlType="submit" type="primary" onClick={setOpenProperty.bind(null, !openProperty)}>
              列配置
            </Button>
          </Space>
        </div>
      </div>
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: btnClkRef }}
      />
      <div className="alarm-table">
        <CustomTable
          rowSelection={tableRowSlt}
          columns={actColumn}
          loading={tableLoading}
          dataSource={data}
          rowKey="id"
          limitHeight
          pagination={false}
        />
      </div>
      <Pagination
        total={pagination.total}
        current={pagination.current}
        pageSize={pagination.pageSize}
        pageSizeOptions={[20, 50, 100, 500, 1000]}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `总数 ${total} 条`}
        onChange={onChangePage}
      />
      {openProperty ? (
        <PropertyBox options={REAL_CHECKBOX_OPTS} property={property} btnClick={propertyClk.current} />
      ) : (
        ""
      )}
    </div>
  )
}
