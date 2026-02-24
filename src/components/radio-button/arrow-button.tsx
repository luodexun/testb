/*
 * @Author: xiongman
 * @Date: 2023-12-08 13:56:01
 * @LastEditors: xiongman
 * @LastEditTime: 2023-12-08 13:56:01
 * @Description:
 */

import "./arrow-button.less"

import { Button, ButtonProps } from "antd"
import classnames from "classnames"

interface IProps extends ButtonProps {}
export default function ArrowButton(props: IProps) {
  const { className, ...btnProps } = props
  return <Button type="text" className={classnames("arrow-button", className)} {...btnProps} />
}
