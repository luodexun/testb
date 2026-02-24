export interface ITemplateData {
  id: number
  name: string
  data: string
  type: string
  createBy: string
  createTime: string
  updateBy: null
  updateTime: null
  sharedFlag: number
  deleteFlag: number
}

export interface ITemplateForm {
  id?: number
  name: string
  data: string
  type?: string
  sharedFlag: string
}

export type TTpltTbActInfo = {
  key: "edit" | "delete" | "choose"
  label: string
}
