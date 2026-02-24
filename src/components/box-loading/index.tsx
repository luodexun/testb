/*
 * @Author: xiongman
 * @Date: 2023-10-19 12:07:25
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-19 12:07:25
 * @Description: 页面等待
 */

import "./index.less"

export function BoxLoading() {
  return (
    <div className="page-wrap box-loading-wrap">
      <div className="box-loading" />
      <div className="text" children="Loading..." />
    </div>
  )
}
