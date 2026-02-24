/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:15:51
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-18 11:15:51
 * @Description:
 */

import { ISearchFormProps } from "./types.ts"

export const SCH_BTN: ISearchFormProps["buttons"][0] = {
  name: "submit",
  label: "查询",
  props: { htmlType: "submit" },
}
