/*
 * @Author: xiongman
 * @Date: 2023-10-18 13:47:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 15:10:04
 * @Description:
 */

import { IApiMapItem } from "@/types/i-api.ts"

const SERVE_NAME = "/sso"

export const ssoApiMap: IApiMapItem = {
  userLogin: {
    url: `${SERVE_NAME}/login`,
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    desc: "用户登录-用户名密码登录",
  },
  userFaceLogin: {
    url: `${SERVE_NAME}/faceLogin`,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    desc: "用户登录-用户名密码登录",
  },
  isUserLogin: {
    url: `${SERVE_NAME}/isLogin`,
    method: "get",
    desc: "用户登录-用户名密码登录",
  },
  signOut: {
    url: `${SERVE_NAME}/signout`,
    method: "post",
    desc: "用户登录-用户退出",
  },
  dualPsdSafeLogin: {
    url: `${SERVE_NAME}/dualPasswordSafeLogin`,
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    desc: "用户验证-双人密码验证",
  },
  singlePasswordSafeLogin: {
    url: `${SERVE_NAME}/singlePasswordSafeLogin`,
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    desc: "用户验证-单人密码验证",
  },
  getCaptcha: {
    url: `${SERVE_NAME}/captcha`,
    method: "get",
    desc: "用户登录-获取验证码",
  },
  getLoginUser: {
    url: `${SERVE_NAME}/getLoginUser`,
    method: "get",
    desc: "用户信息",
  },
}
