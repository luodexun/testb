/*
 * @Author: xiongman
 * @Date: 2022-11-25 12:48:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-12 17:23:49
 * @Description: 登录及权限相关 atom 数据
 */
import { sm3 } from "sm-crypto"
import { StorageAlarmVoice, StorageUserInfo } from "@configs/storage-cfg"
import { AtomUserOfMenuMap } from "@store/atom-menu.ts"
import {
  getStorage,
  removeProperties,
  removeStorage,
  setStorage,
  showMsg,
  toLoginSystem,
  validResErr,
  validServe,
} from "@utils/util-funs"
import { atom } from "jotai"

import { doBaseServer } from "@/api/serve-funs"
import { IBaseResponse } from "@/types/i-api.ts"
import { IFaceLoginParam, ILoginInfo, ILoginParams } from "@/types/i-auth"

export const LOGIN_INFO_FOR_FUNS: { loginInfo: ILoginInfo } = {
  loginInfo: <ILoginInfo>getStorage<ILoginInfo | null>(StorageUserInfo),
}

// 登录的用户信息，从本地存储获取，赋值给userInfoAtom
export const userInfoAtom = atom<ILoginInfo>(LOGIN_INFO_FOR_FUNS.loginInfo)

export const loginLoadingAtom = atom<boolean>(false)

async function doUserLogin<TF = ILoginParams>(
  loginForm: TF,
  urlKey: "userLogin" | "userFaceLogin",
): Promise<ILoginInfo | null> {
  const userInfo = await doBaseServer<TF, ILoginInfo>(urlKey, loginForm).then(validServe)
  const hasErr = validResErr(userInfo)
  // 对接口返回的数据进行sm3加密，判断加密后的密文是否和encrypt相等
  const newObj = removeProperties(Object.assign({}, userInfo), ["encrypt"])
  const encryptInfo = sm3(JSON.stringify(newObj))
  const isNeedEncrypt =
    process.env[urlKey === "userLogin" ? "VITE_COUNT_NEED_ENCRYPR_PW" : "VITE_COUNT_FACE_NEED_ENCRYPR_PW"] === "1"
  if (userInfo?.code === 409 && userInfo?.pwTimeout) {
    return userInfo
  }
  if (isNeedEncrypt && encryptInfo !== userInfo?.encrypt) {
    showMsg("登录失败", "error")
    return null
  }
  if (hasErr) return null
  showMsg("登录成功", "success")
  return userInfo
}

export const loginAsyncAtom = atom(
  null,
  async (
    _,
    set,
    data: {
      loginForm: ILoginParams | IFaceLoginParam
      urlKey?: "userLogin" | "userFaceLogin"
      call: (isErr: boolean, pwTimeoutInfo) => void
    },
  ) => {
    const { loginForm, call, urlKey } = data
    let hasErr = true
    let pwTimeoutInfo
    try {
      set(loginLoadingAtom, true)
      const userInfo = await doUserLogin(loginForm, urlKey || "userLogin")
      hasErr = validResErr(userInfo)
      // 登录过期
      if (userInfo?.pwTimeout) {
        pwTimeoutInfo = userInfo
      }
      if (!userInfo || userInfo?.pwTimeout) return
      // const userInfo = {
      //   id: 9,
      //   loginName: "test04",
      //   realName: "testName",
      //   roleId: 3,
      //   role: "controller",
      //   roleDescription: "监控人员",
      //   permission: ["user.active_self_image", "control.active_control_module"],
      //   token: "c2f6684b-f3a4-44d8-8da3-bdac2672b2f5",
      // }
      setStorage(userInfo, StorageUserInfo)
      setStorage(true, StorageAlarmVoice)
      LOGIN_INFO_FOR_FUNS.loginInfo = userInfo

      // 触发用户菜单处理方法
      await set(AtomUserOfMenuMap)

      // 登录后延迟触发 userInfoAtom 修改，以使路由处理完成后再跳转页面
      set(userInfoAtom, userInfo)
    } catch (err: any) {
      showMsg(err.data || "登录失败", "error")
    } finally {
      set(loginLoadingAtom, false)
      call(hasErr, pwTimeoutInfo)
    }
  },
)

// 退出
export const loginOutAtom = atom(null, () => {
  doBaseServer("signOut").then((data) => {
    if (data && `${data.code}` !== "200") {
      showMsg(data?.msg || "接口出错", "error").then(() => null)
    }
    removeStorage()
    LOGIN_INFO_FOR_FUNS.loginInfo = null // 登录信息初始值
    window.location.reload() // 刷新页面，layout-user 中验证登录信息时转到登录页面
  })
})

let refreshLock = false
export const AtomCheckToken = atom(null, async (_, set) => {
  if (refreshLock || !LOGIN_INFO_FOR_FUNS.loginInfo) return
  refreshLock = true

  const resData = await doBaseServer<undefined, IBaseResponse<boolean>>("isUserLogin")
  refreshLock = false
  if (typeof resData === "boolean" && resData) return
  set(userInfoAtom, null)
  toLoginSystem("登录过期，请重新登录!")
})
