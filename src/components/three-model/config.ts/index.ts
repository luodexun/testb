/*
 * @Author: chenmeifeng
 * @Date: 2023-12-06 17:12:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-29 15:12:12
 * @Description:
 */
// 各模块模型的位置
export const getWTPosition = (partName) => {
  let cameraPosition = null
  let controlsPosition = null
  switch (partName) {
    case "中控柜系统":
      cameraPosition = { x: -2, y: 3, z: 1 }
      controlsPosition = { x: 0, y: 0.2, z: 0 }
      break
    case "变桨系统":
      cameraPosition = { x: 10, y: 10, z: 2 }
      controlsPosition = { x: 0.2, y: 8.3, z: 0 }
      break
    case "齿轮箱":
      cameraPosition = { x: 7, y: 10, z: 2 }
      controlsPosition = { x: 0, y: 8.15, z: 0 }
      break
    case "发电机":
      cameraPosition = { x: 10, y: 10, z: 1 }
      controlsPosition = { x: -1, y: 8.2, z: -0.6 }
      break
    case "传动系统":
      cameraPosition = { x: 5, y: 10, z: -1 }
      controlsPosition = { x: 0, y: 8.15, z: 0 }
      break
    case "变流器":
      cameraPosition = { x: 0, y: 4, z: 2 }
      controlsPosition = { x: 0, y: 0.2, z: 0 }
      break
    case "箱变":
      cameraPosition = { x: 12, y: 1, z: 0 }
      controlsPosition = { x: 0, y: 8.9, z: 0 }
      break
    case "偏航装置":
      cameraPosition = { x: 5, y: 10, z: 0 }
      controlsPosition = { x: 0, y: 8.15, z: 0 }
      break
    case "液压系统":
      cameraPosition = { x: 5, y: 10, z: -2 }
      controlsPosition = { x: 0, y: 8.15, z: 0 }
      break
    case "消防系统":
      cameraPosition = { x: 12, y: 20, z: 0 }
      controlsPosition = { x: 0, y: 8.3, z: 0 }
      break
    case "pcs_4405_01.001_pcs_4405_01.005":
      cameraPosition = { x: 1.1, y: 1, z: 10 }
      controlsPosition = { x: 1.1, y: 0, z: 0 }
      break
    default:
      cameraPosition = { x: 12, y: 20, z: 0 }
      controlsPosition = { x: 0, y: 8.3, z: 0 }
  }
  return {
    cameraPosition,
    controlsPosition,
  }
}

export const getPVPosition = (partName) => {
  let cameraPosition = null
  let controlsPosition = null
  switch (partName) {
    case "pcs_4405_01.001_pcs_4405_01.005":
      cameraPosition = { x: 8, y: 20, z: 50 }
      controlsPosition = { x: 8, y: 3, z: 4 }
      break
    case "Plane.001":
      cameraPosition = { x: 8, y: 20, z: 50 }
      controlsPosition = { x: 8, y: 3, z: 4 }
      break
    case "pcs_4405_01.002":
    case "pcs_4405_01.004":
      cameraPosition = { x: 4, y: 20, z: 70 }
      controlsPosition = { x: 4, y: 4, z: 10 }
      break
    case "pcs_4405_01.006":
      cameraPosition = { x: 4, y: 20, z: 70 }
      controlsPosition = { x: 4, y: 4, z: 10 }
      break
    case "跟踪系统":
      cameraPosition = { x: 0, y: 20, z: 100 }
      controlsPosition = { x: 0, y: 4, z: 10 }
      break
    default:
      cameraPosition = { x: 0, y: 20, z: 70 }
      controlsPosition = { x: 0, y: 4, z: 10 }
  }
  return {
    cameraPosition,
    controlsPosition,
  }
}

export const MODEL_MTL_LIST = {
  WT: {
    model: "/model/fengjiModel/fengji-all.obj",
    mtl: "/model/fengjiModel/fengji-all.mtl",
  },
  PVINV: {
    model: "/model/guangfuModel/pv.obj",
    mtl: "/model/guangfuModel/pv.mtl",
  },
  集中式PVINV: {
    model: "/model/guangfuModel/jz.obj",
    mtl: "/model/guangfuModel/jz.mtl",
  },
  组串式PVINV: {
    model: "/model/guangfuModel/zc.obj",
    mtl: "/model/guangfuModel/zc.mtl",
  },
}

// 需要画线的模型部件名称
export const PVINV_All_PART = [
  "pcs_4405_01.001_pcs_4405_01.005",
  "Plane.001",
  "Plane.003",
  "Plane.004",
  "pcs_4405_01.006",
  "pcs_4405_01.004",
  "pcs_4405_01.009",
]
export const PVINV_JZ_All_PART = [
  "pcs_4405_01.001_pcs_4405_01.005",
  "Plane.001",
  "Plane.003",
  "Plane.004",
  "pcs_4405_01.002",
  "pcs_4405_01.004",
  "pcs_4405_01.005",
  "pcs_4405_01.006",
]
export const PVINV_ZC_All_PART = [
  "pcs_4405_01.001_pcs_4405_01.005",
  "Plane.001",
  "Plane.003",
  "Plane.004",
  "pcs_4405_01.002",
  "pcs_4405_01.004",
  "pcs_4405_01.005",
  "pcs_4405_01.006",
]
// 需要画线的模型部件名称
export const PART_MESH_NAME = {
  1: ["pcs_4405_01.001_pcs_4405_01.005"],
  2: ["Plane.001", "Plane.003", "Plane.004"],
  3: ["pcs_4405_01.006", "pcs_4405_01.004", "pcs_4405_01.009"],
}

export const FLOW_LINE_XYZ = [
  [
    [3, 0, 0],
    [-1.3, 0, 0],
  ],
  [
    [3, 0, -4],
    [-1.3, 0, -4],
  ],
  [
    [3, 0, -8],
    [-1.3, 0, -8],
  ],
  [
    [5, 0, 0],
    [3, 0, 0],
  ],
  [
    [5, 0, -4],
    [3, 0, -4],
  ],
  [
    [5, 0, -8],
    [3, 0, -8],
  ],
  [
    [5, 0, -4],
    [5, 0, 0],
  ],
  [
    [5, 0, -4],
    [5, 0, -8],
  ],
  [
    [7, 0, -4],
    [5, 0, -4],
  ],
]
export const JZ_FLOW_LINE_XYZ = [
  [
    [3, 0, 0],
    [-1.3, 0, 0],
  ],
  [
    [3, 0, -4],
    [-1.3, 0, -4],
  ],
  [
    [3, 0, -8],
    [-1.3, 0, -8],
  ],
  [
    [3.6, 0, 0],
    [3, 0, 0],
  ],
  [
    [3.6, 0, -4],
    [3, 0, -4],
  ],
  [
    [3.6, 0, -8],
    [3, 0, -8],
  ],
  [
    [3.6, 0, -4],
    [3.6, 0, 0],
  ],
  [
    [3.6, 0, -4],
    [3.6, 0, -8],
  ],
  [
    [7, 0, -4],
    [3.6, 0, -4],
  ],
]
export const ZC_FLOW_LINE_XYZ = [
  [
    [3, 0, 0],
    [-1.3, 0, 0],
  ],
  [
    [3, 0, -4],
    [-1.3, 0, -4],
  ],
  [
    [3, 0, -8],
    [-1.3, 0, -8],
  ],
  [
    [3.6, 0, 0],
    [3, 0, 0],
  ],
  [
    [3.6, 0, -4],
    [3, 0, -4],
  ],
  [
    [3.6, 0, -8],
    [3, 0, -8],
  ],
  [
    [3.6, 0, -4],
    [3.6, 0, 0],
  ],
  [
    [3.6, 0, -4],
    [3.6, 0, -8],
  ],
  [
    [7, 0, -4],
    [3.6, 0, -4],
  ],
]
