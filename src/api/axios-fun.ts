/*
 * @Author: xiongman
 * @Date: 2023-01-03 11:26:52
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-16 14:41:39
 * @Description: 处理重复请求的方法们
 */

import { StorageUserInfo } from "@configs/storage-cfg"
import { LOGIN_INFO_FOR_FUNS } from "@store/atom-auth"
import { getStorage } from "@utils/util-funs"
import axios, { AxiosRequestConfig } from "axios"

import { ILoginInfo } from "@/types/i-auth"

const pendingMap = new Map()

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
export function getPendingKey(config: AxiosRequestConfig) {
  const { url, method, params, data } = config
  let dataStr = data,
    paramStr = params
  if (data && typeof data !== "string") dataStr = JSON.stringify(data)
  if (params && typeof params !== "string") paramStr = JSON.stringify(params)
  const keyArr = [url, method]
  if (dataStr) keyArr.push(dataStr)
  if (paramStr) keyArr.push(paramStr)
  return keyArr.join("&")
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config axios请求配置数据
 * @param pendingKey 请求标记
 */
export function addPending(config: AxiosRequestConfig, pendingKey: string) {
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

/**
 * 删除重复的请求
 * @param {*} _config axios请求配置数据
 * @param pendingKey 请求标记
 */
export function removePending(_config: AxiosRequestConfig, pendingKey: string) {
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

/**
 * 添加请求token信息
 * @param {*} config axios请求配置数据
 */
export function addHeaders(config: AxiosRequestConfig) {
  let loginInfo = LOGIN_INFO_FOR_FUNS.loginInfo
  if (!loginInfo) LOGIN_INFO_FOR_FUNS.loginInfo = loginInfo = getStorage<ILoginInfo | null>(StorageUserInfo)
  const { token } = loginInfo || {}
  if (!config.headers) config.headers = {}
  // isToken 有 "false" 字符串标记，不赋值默认添加 token 请求头
  if (!config.headers.isToken && token) config.headers.satoken = token
  if (config.headers.isToken) {
    delete config.headers.isToken
  }
  if (!config.headers["Content-Type"]) config.headers["Content-Type"] = "application/json"
}
