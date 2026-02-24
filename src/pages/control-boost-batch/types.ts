export interface IDvsSubPartPointData {
  coefficient: number // 1 //测点系数
  id: number //2
  maximum: number //1
  minimum: number //0
  modelId: number //1 //型号id
  pointDesc: string // "风机累计自用有功电量" //测点描述
  pointName: string //"TotConsActiveEnergy" //测点编码
  //测点类型：1为遥测，2为遥信
  pointType: string // "1"
  systemId: number //101 //子系统id
  tags: string | null

}