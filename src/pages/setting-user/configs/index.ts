/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-30 17:20:55
 * @Description:
 */

import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { getTableActColumn } from "@/utils/table-funs"
import { getStorage } from "@/utils/util-funs"

import { IUserList, TUserTbActInfo } from "../types/index"

export const deviceTypesOfSt = getStorage(StorageStnDvsType)

export const ST_MANAGE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  { name: "add", label: "新增用户" },
  { name: "batchDel", label: "批量删除" },
]

const TABLE_ACTION = [
  { key: "edit", label: "编辑" },
  { key: "uploadImg", label: "照片上传" },
  { key: "updatePw", label: "修改密码" },
  { key: "deleted", label: "删除" },
]

export function DEVICE_ATT_COLUMNS(config: ITbColAction<TUserTbActInfo, IUserList>): ColumnsType<IUserList> {
  const { onClick } = config
  return [
    { dataIndex: "index", title: "序号", width: 60, align: "center" },
    { dataIndex: "loginName", title: "登录名" },
    { dataIndex: "realName", title: "姓名" },
    { dataIndex: "roleDescription", title: "角色" },
    ...getTableActColumn<IUserList, TUserTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
      }),
      null,
      { width: 500 },
    ),
  ]
}
