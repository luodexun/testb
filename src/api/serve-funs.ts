/*
 * @Author: xiongman
 * @Date: 2022-12-01 10:17:46
 * @LastEditors: xiongman
 * @LastEditTime: 2022-12-01 10:17:46
 * @Description: 模块接口执行方法们
 */

import { customRequest } from "@utils/custom-request.ts"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import qs from "qs"

import { IApiListen, IRecordResponse } from "@/types/i-api"

import API_MAP from "./api-map"
import { addHeaders, addPending, getPendingKey, removePending } from "./axios-fun"

function dealUrlParam(config: Omit<IApiItem, "desc">, params: any) {
  if (!params) return
  const urlReg = /\{(\w+)}/g
  if (!urlReg.test(config.url!)) return
  let key: string, urlParam: string
  config.url = config.url?.replace(urlReg, (field) => {
    key = `${field}`.replace(/[{}]/g, "")
    urlParam = `${params[key]}`
    delete params[key] // 去除传入参数中的 url 参数，保留 get 类型参数
    return urlParam
  })
}

// 处理通用参数
function dealNormalParams(config: AxiosRequestConfig & Pick<IApiItem, "param_field">, params?: any) {
  if (!params) return config
  const tempParams = params || {} // 用于过滤url中的参数
  // 应对 url参数 + get + post， /api/{id}?code="" 且带post请求体
  if (config.param_field === "hybrid") {
    dealUrlParam(config, tempParams.url) // url参数
    config["params"] = tempParams.params // get 带参数
    config["data"] = tempParams.data // post 请求体
    return config
  }
  // 应对 url参数 + get（获取post）情况
  dealUrlParam(config, tempParams)
  if (Object.keys(tempParams).length > 0) {
    const paramField: "params" | "data" =
      config.param_field || "get;delete".includes(<string>config.method) ? "params" : "data"
    if (paramField) config[paramField] = tempParams // 保留的 get 或 post 类型参数
  }
  return config
}

// 处理 FormData 参数
function dealFormDataParams(config: AxiosRequestConfig, params?: FormData) {
  config["data"] = params
  return config
}

function baseServe<TData = any>(
  api: IApiItem,
  params?: any,
  listenFun?: IApiListen,
): Promise<AxiosResponse<IRecordResponse<TData>> | null> {
  const { repeat_request, arrayFormat, ...config } = api
  config.method = config.method ?? "get"
  const paramsFun = params instanceof FormData ? dealFormDataParams : dealNormalParams
  const apiConfig = paramsFun(config, params)
  if (config.params) {
    apiConfig.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: arrayFormat || "repeat" })
  }
  // 上传时添加进度监听
  if (listenFun) Object.assign(apiConfig, listenFun)

  // 允许短时间重复发送请求，则不做去除重复请求处理
  if (!repeat_request) {
    const urlKey = getPendingKey(apiConfig)
    removePending(apiConfig, urlKey)
    addPending(apiConfig, urlKey)
  }
  addHeaders(apiConfig)

  return customRequest(apiConfig)
}

async function dealServer<TParam = Record<string, any>, TData = any>(
  urlKey: string,
  params?: TParam,
  listenFun?: IApiListen,
  catchErr?: boolean,
) {
  const api = API_MAP[urlKey]
  if (!api) return Promise.reject(`接口索引出错！urlKey: ${urlKey}`)
  return await baseServe<TData>(api, params, listenFun).catch((errData) => (catchErr ? errData : null))
}

export async function doRecordServer<TParam = Record<string, any>, TData = any>(
  urlKey: string,
  params?: TParam,
): Promise<IRecordResponse<TData> | null> {
  return await dealServer<TParam, TData>(urlKey, params)
}

export async function doBaseServer<TParam = Record<string, any>, TData = any>(
  urlKey: string,
  params?: TParam,
  listenFun?: IApiListen,
  catchErr?: boolean,
): Promise<TData | null> {
  return await dealServer<TParam, TData>(urlKey, params, listenFun, catchErr)
}

export async function doNoParamServer<TData>(urlKey: string): Promise<TData | null> {
  return await doBaseServer<undefined, TData>(urlKey)
}
