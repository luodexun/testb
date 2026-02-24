/*
 * @Author: xiongman
 * @Date: 2022-12-23 18:17:49
 * @LastEditors: xiongman
 * @LastEditTime: 2022-12-23 18:17:49
 * @Description: 登录有关数据类型们
 */

export interface ILoginParams {
  name: string
  pwd: string
  code: string
  uuid: string
}
export interface IFaceLoginParam {
  image: string | File
}
export interface ILoginInfo {
  id: number // 9
  loginName: string // "test04"
  realName: string // "testName"
  roleId: number // 3
  role: string // "controller"
  roleDescription: string // "监控人员"
  permission: string[] // ["user.active_self_image", "control.active_control_module"]
  token: string //  "c2f6684b-f3a4-44d8-8da3-bdac2672b2f5"
  encrypt?: string
  pwTimeout?: boolean // 是否过期
}
