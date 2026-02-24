/*
 * @Author: chenmeifeng
 * @Date: 2023-10-27 17:40:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-30 16:18:51
 * @Description:
 */

import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/user"

export const userMngApi: IApiMapItem = {
  getAllUser: {
    url: `${SERVE_NAME}/get`,
    method: "post",
    desc: "配置管理-用户管理-查询所有用户",
  },
  getRoleUser: {
    url: `${SERVE_NAME}/getRole`,
    method: "get",
    desc: "配置管理-用户管理-用户角色",
  },
  addUser: {
    url: `${SERVE_NAME}/add`,
    method: "post",
    desc: "配置管理-用户管理-新增用户",
  },
  updateUser: {
    url: `${SERVE_NAME}/update`,
    method: "post",
    desc: "配置管理-用户管理-编辑用户",
  },
  deleteUser: {
    url: `${SERVE_NAME}/delete`,
    method: "post",
    desc: "配置管理-用户管理-删除用户",
  },
  uploadImgUser: {
    url: `${SERVE_NAME}/uploadImg`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8",
    },
    desc: "配置管理-用户管理-照片上传",
  },
  updatePwdUser: {
    url: `${SERVE_NAME}/updatePwd`,
    method: "post",
    desc: "配置管理-用户管理-修改密码",
  },
}
