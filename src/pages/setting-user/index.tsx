/*
 * @Author: chenmeifeng
 * @Date: 2023-10-17 17:01:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-12 14:40:08
 * @Description:
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import RemoveContent from "@/components/custom-modal/components/remove-content"
import CustomTable from "@/components/custom-table"
import useTableSelection from "@/hooks/use-table-selection"
import { showMsg } from "@/utils/util-funs"

import AddUser, { IOperateProps, IPerateRef } from "./components/add-user"
import UdPassword, { IPOperateProps } from "./components/ud-password"
import UploadImg, { IImgOperateProps } from "./components/upload-img"
import { DEVICE_ATT_COLUMNS, ST_MANAGE_SCH_FORM_BTNS } from "./configs/index"
import { addUserMethods, delUserMethods, getSettingUserSchData, udPwMethods } from "./methods/index"
import { IUserList, IUserListParam, TModelFrAndTbInfo, TUserTbActInfo } from "./types/index"

const rowSelectProps = { needInfo: true }

export default function DeviceManage() {
  const formRef = useRef<IFormInst | null>(null)
  const modeRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState("")
  const [isEditOrAdd, setIsEditOrAdd] = useState("add")
  // 设置选中的一条数据
  const [selectRowInfo, setSelectRowInfo] = useState<IUserList>()

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRowKeys, setSelectedRows } = useTableSelection(rowSelectProps)

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.submit()
  }, [])

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<IUserListParam, IUserList>(
    { serveFun: getSettingUserSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: "add" | "batchDel") {
    if (type === "add") {
      setIsModalOpen("add")
      setIsEditOrAdd("add")
    } else if (type === "batchDel") {
      if (!selectedRowKeys.length) {
        return showMsg("请至少选择一条！")
      }
      setIsModalOpen("deleted")
    }
  }

  const onTbAction = async (record: IUserList, { key, label }: TUserTbActInfo) => {
    setIsModalOpen(key)
    setSelectRowInfo(record)
    if (key === "edit") {
      setIsEditOrAdd(key)
    }
    console.log(record, key, label)
  }

  // 新增和编辑用户信息
  const btnClkRef = async (type: "ok" | "close", data?: TModelFrAndTbInfo) => {
    setSelectRowInfo(null)
    // 执行
    if (type === "ok") {
      const res = await addUserMethods(data, isEditOrAdd)
      if (!res) return
      setIsModalOpen("")
      return onSearch()
    }
    if (type === "close") return setIsModalOpen("")
  }

  // 修改密码
  const pwBtnClkRef = async (type: "ok" | "close", data?: TModelFrAndTbInfo) => {
    // 执行
    if (type === "ok") {
      // const res = await udPwMethods(data)
      // if (!res) return
      setIsModalOpen("")
      setSelectRowInfo(null)
      return onSearch()
    }
    setSelectRowInfo(null)
    if (type === "close") return setIsModalOpen("")
  }

  const uiBtnClkRef = async (type: "ok" | "close") => {
    // 执行
    if (type === "ok") {
      setIsModalOpen("")
      setSelectRowInfo(null)
      return onSearch()
    }
    setSelectRowInfo(null)
    if (type === "close") return setIsModalOpen("")
  }

  const delBtnClkRef = async (type: "ok" | "close" | "delete_ok") => {
    // 执行
    if (type === "delete_ok") {
      const res = await delUserMethods({ ids: selectRowInfo ? [selectRowInfo.id] : selectedRowKeys })
      if (!res) return
      setSelectRowInfo(null)
      setIsModalOpen("")
      setSelectedRowKeys([])
      setSelectedRows([])
      return onSearch()
    }
    setSelectRowInfo(null)
    if (type === "close") return setIsModalOpen("")
  }

  return (
    <div className="page-wrap setting-user">
      <CustomForm
        ref={formRef}
        loading={loading}
        buttons={ST_MANAGE_SCH_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        limitHeight
        columns={DEVICE_ATT_COLUMNS({ onClick: onTbAction })}
        dataSource={dataSource}
        pagination={pagination}
      />
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        title={isEditOrAdd === "add" ? "新增" : "修改"}
        destroyOnClose
        open={isModalOpen === "add" || isModalOpen === "edit"}
        footer={null}
        onCancel={() => setIsModalOpen("")}
        Component={AddUser}
        componentProps={{ buttonClick: btnClkRef, editType: isEditOrAdd, selectRowInfo }}
      />
      <CustomModal<IPOperateProps>
        getContainer={false}
        title="修改密码"
        destroyOnClose
        open={isModalOpen === "updatePw"}
        footer={null}
        onCancel={() => setIsModalOpen("")}
        Component={UdPassword}
        componentProps={{ buttonClick: pwBtnClkRef, selectRowInfo }}
      />
      <CustomModal<IImgOperateProps>
        title="上传图片"
        destroyOnClose
        open={isModalOpen === "uploadImg"}
        footer={null}
        onCancel={() => setIsModalOpen("")}
        Component={UploadImg}
        componentProps={{ buttonClick: uiBtnClkRef, selectRowInfo }}
      />
      <CustomModal<IImgOperateProps>
        title="删除"
        destroyOnClose
        open={isModalOpen === "deleted"}
        footer={null}
        onCancel={() => setIsModalOpen("")}
        Component={RemoveContent}
        componentProps={{ buttonClick: delBtnClkRef, selectRowInfo }}
      />
    </div>
  )
}
