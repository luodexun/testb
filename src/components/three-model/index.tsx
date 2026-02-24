/*
 * @Author: chenmeifeng
 * @Date: 2023-11-01 11:09:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-29 11:36:14
 * @Description:
 */

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import TWEEN from "three/examples/jsm/libs/tween.module"
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js"

import { TDeviceType } from "@/types/i-config.ts"

import {
  FLOW_LINE_XYZ,
  getPVPosition,
  getWTPosition,
  JZ_FLOW_LINE_XYZ,
  MODEL_MTL_LIST,
  PVINV_All_PART,
  PVINV_JZ_All_PART,
  ZC_FLOW_LINE_XYZ,
} from "./config.ts"

export default function ThreeModel(props: { chooseMeshName: string; deviceType: TDeviceType; type: string }) {
  const { chooseMeshName, deviceType, type } = props

  const isFirstIn = useRef(true)

  const scene = useRef(null) //创建场景
  const camera = useRef(null) //创建相机
  const renderer = useRef(null) //生成渲染实例
  const orbitControls = useRef(null) // 控制器
  const composer = useRef(null)

  const outlinePass = useRef(null) // 边缘物体发光
  const renderPass = useRef(null)

  const [modelList, setModelList] = useState(null) // 模型
  const [canShow, setCan] = useState(false)
  const modelRef = useRef(null)
  const animationFrameId = useRef(null)
  const tween = useRef(null)
  const lastPositionList = useRef({
    camera: { x: 0, y: 8, z: 4 },
    controls: { x: 0, y: 0, z: 0 },
  })
  const activeMesh = useRef([])

  const linesTexture = useRef([])
  const Clock = useRef(new THREE.Clock())
  useEffect(() => {
    if (canShow) {
      iniThree()
    }
    setCan(true)
    return () => {
      cancelAnimationFrame(animationFrameId.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canShow])

  useEffect(() => {
    if (chooseMeshName && modelList) {
      activeMesh.current = []
      const currentMeshName = chooseMeshName.split("，")
      currentMeshName.forEach((item) => {
        const mesh = modelList.children.find((i) => i.name === item)
        if (!mesh) return
        activeMesh.current.push(mesh)
      })
      const getPosition = deviceType === "WT" ? getWTPosition : getPVPosition
      const { cameraPosition, controlsPosition } = getPosition(currentMeshName[0])

      // 进入风机页面第一次显示风机头
      if (deviceType === "WT" && isFirstIn.current) {
        const cameraPt = { x: 12, y: 20, z: 0 }
        const controlsPt = { x: 0, y: 8.3, z: 0 }
        animateCamera(
          { x: 12, y: 20, z: 0 },
          { x: 0, y: 7, z: 0 },
          cameraPt,
          controlsPt,
          outlineObj(activeMesh.current),
        )
        lastPositionList.current = {
          controls: controlsPt,
          camera: cameraPt,
        }
        isFirstIn.current = false
        return
      }
      animateCamera(
        lastPositionList.current.camera,
        lastPositionList.current.controls,
        cameraPosition,
        controlsPosition,
        outlineObj(activeMesh.current),
      )
      lastPositionList.current = {
        controls: controlsPosition,
        camera: cameraPosition,
      }
    }
  }, [chooseMeshName, modelList])

  useEffect(() => {
    if (deviceType === "PVINV" && modelList) {
      const allMeshCenter = []
      PVINV_JZ_All_PART.forEach((item) => {
        const currentMesh = modelList?.children.find((i) => i.name === item)
        allMeshCenter.push(handlePosition(currentMesh))
      })
      initAllFlowLine()
    }
  }, [modelList])

  // 初始化所有流动线条（管道）
  const initAllFlowLine = () => {
    const xyzLine = type === "集中式" ? JZ_FLOW_LINE_XYZ : ZC_FLOW_LINE_XYZ
    const list = xyzLine.map((i) => {
      return i.map((j) => createVector3FromArray(j))
    })
    list.forEach((item) => {
      initFlowLine({
        points: item,
      })
    })
  }

  // 创建一个函数，接收一个数组作为参数
  const createVector3FromArray = (arr) => {
    // 使用数组的元素创建一个新的THREE.Vector3对象
    // 返回新创建的THREE.Vector3对象
    return new THREE.Vector3(arr[0], arr[1], arr[2])
  }

  const iniThree = () => {
    const { height, width } = modelRef.current.getBoundingClientRect()
    scene.current = new THREE.Scene() //创建场景

    camera.current = new THREE.PerspectiveCamera(4, width / height, 0.9, 2000) //创建相机
    // 设置摄像机位置
    camera.current.position.set(0, 0, 0)

    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    }) //生成渲染实例
    renderer.current.setSize(width, height) //设置宽高
    renderer.current.setClearColor("#010219", 0.5) //背景颜色
    modelRef.current.appendChild(renderer.current.domElement) //生成的渲染的实例, 这个要放到对应的dom容器里面

    // 根据设备类型加载模型和材质
    const modelObj = MODEL_MTL_LIST[type + deviceType]?.model
    const modelMtl = MODEL_MTL_LIST[type + deviceType]?.mtl

    const manager = new THREE.LoadingManager()
    manager.addHandler(/\.dds$/i, new DDSLoader())
    const mtlLoader = new MTLLoader(manager)
    const loader = new OBJLoader(manager)
    mtlLoader.load(modelMtl, (materials) => {
      loader.setMaterials(materials)
      materials.preload()
      loader.load(
        modelObj,
        (object) => {
          // console.log(object, "object")
          object.scale.set(0.09, 0.09, 0.09)
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.material instanceof Array) {
                for (const material of child.material) {
                  material.side = 2
                }
              } else {
                child.material.side = 2
              }
            }
          })
          scene.current.add(object)
          // 更新控制器以应用新的摄像机位置
          orbitControls.current.update()
          setModelList(object)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
        },
        (error) => {
          console.log("Error! ", error)
        },
      )
    })

    // const axisHelper = new THREE.AxesHelper(10)
    // scene.current.add(axisHelper) //插入辅助线长度为10的坐标系

    // 添加控制器
    orbitControls.current = new OrbitControls(camera.current, renderer.current.domElement)
    // orbitControls.current.target = new THREE.Vector3(0, 8.5, 0) //控制焦点
    orbitControls.current.enableDamping = true
    orbitControls.current.dampingFactor = 0.05
    orbitControls.current.update()
    // orbitControls.autoRotate = true;

    //添加光源
    //自然光
    const light = new THREE.AmbientLight("#fdfdfd", 5) // fdfdfd
    scene.current.add(light)
    const dirLight = new THREE.DirectionalLight("#3b3838", 3)
    dirLight.position.set(0, 10, 10)
    scene.current.add(dirLight)

    // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
    composer.current = new EffectComposer(renderer.current)
    // 新建一个场景通道  为了覆盖到原理来的场景上
    renderPass.current = new RenderPass(scene.current, camera.current)
    // 解决初始化环境颜色和选中模型后环境颜色不同
    const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
    composer.current.addPass(gammaCorrectionShader)

    animate()
  }

  const animate = function () {
    animationFrameId.current = requestAnimationFrame(animate)
    orbitControls.current.update()
    TWEEN.update()
    renderer.current.render(scene.current, camera.current)
    if (composer.current) {
      composer.current.render()
    }
    const deltaTime = Clock.current.getDelta()
    renderFlowLine(deltaTime, 3)
  }

  // 获取模型部位位置
  const handlePosition = (obj) => {
    const box3 = new THREE.Box3()
    box3.expandByObject(obj) // 计算模型包围盒
    const size = new THREE.Vector3()
    box3.getSize(size) // 计算包围盒尺寸
    const center = new THREE.Vector3()
    box3.getCenter(center) // 计算一个层级模型对应包围盒的几何体中心坐标
    return center
  }

  // oldP  相机原来的位置
  // oldT  target原来的位置
  // newP  相机新的位置
  // newT  target新的位置
  // callBack  动画结束时的回调函数
  // 实现动画平滑效果，实现
  function animateCamera(oldP, oldT, newP, newT, callBack) {
    tween.current = new TWEEN.Tween({
      x1: oldP.x, // 相机x
      y1: oldP.y, // 相机y
      z1: oldP.z, // 相机z
      x2: oldT.x, // 控制点的中心点x
      y2: oldT.y, // 控制点的中心点y
      z2: oldT.z, // 控制点的中心点z
    })
    tween.current.to(
      {
        x1: newP.x,
        y1: newP.y,
        z1: newP.z,
        x2: newT.x,
        y2: newT.y,
        z2: newT.z,
      },
      1500,
    )
    tween.current.onUpdate(function (object) {
      // 动态改变相机位置
      camera.current.position.set(object.x1, object.y1, object.z1)
      orbitControls.current.target.set(object.x2, object.y2, object.z2)
      orbitControls.current.update()
    })
    tween.current.onComplete(function () {
      orbitControls.current.enabled = true
      callBack && callBack()
    })
    tween.current.easing(TWEEN.Easing.Cubic.InOut)
    tween.current.start()
  }
  //高亮显示模型（呼吸灯）
  const outlineObj = (selectedObjects) => {
    const { height, width } = modelRef.current.getBoundingClientRect()
    composer.current.addPass(renderPass.current)

    // 解决高亮后环境变暗的问题
    const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
    composer.current.addPass(gammaCorrectionShader)
    // 物体边缘发光通道
    outlinePass.current = new OutlinePass(
      new THREE.Vector2(width, height),
      scene.current,
      camera.current,
      selectedObjects,
    )
    outlinePass.current.selectedObjects = selectedObjects
    outlinePass.current.edgeStrength = 10.0 // 边框的亮度
    outlinePass.current.edgeGlow = 0.2 // 光晕[0,1]
    outlinePass.current.usePatternTexture = false // 是否使用父级的材质
    outlinePass.current.edgeThickness = 1.0 // 边框宽度
    outlinePass.current.downSampleRatio = 1 // 边框弯曲度
    outlinePass.current.pulsePeriod = 5 // 呼吸闪烁的速度
    outlinePass.current.visibleEdgeColor.set(new THREE.Color(0xffffff)) // 可见边缘的颜色
    // outlinePass.current.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 不可见边缘的颜色 `
    outlinePass.current.clear = true
    composer.current.addPass(outlinePass.current)

    // 自定义的着色器通道 作为参数
    const effectFXAA = new ShaderPass(FXAAShader)
    effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height)
    // effectFXAA.renderToScreen = true
    composer.current.addPass(effectFXAA)
  }

  // 初始化流线
  const initFlowLine = async (options: any) => {
    const defaultOptions = {
      tension: 0.0,
      icon: "/images/siteIcon/turbine-t1.png",
      radius: 0.1,
    }
    options = Object.assign(defaultOptions, options)
    //1.创建曲线
    const lineCurve = new THREE.CatmullRomCurve3(options.points, false, "catmullrom", options.tension)

    //2.根据曲线生成管道几何体
    const geometry = new THREE.TubeGeometry(
      lineCurve, //一个由基类Curve继承而来的3D路径
      100, //组成这一管道的分段数，默认值为64
      options.radius, //管道的半径，默认值为1
      2, //管道横截面的分段数目，默认值为8
      false, //管道的两端是否闭合，默认值为false
    )

    const maxDistance = options.points.reduce(
      (pre: any, cur: any) => {
        if (!pre.point)
          return {
            distance: 0,
            point: cur,
          }
        const distance = cur.distanceTo(pre.point)
        return {
          distance: distance + pre.distance,
          point: cur,
        }
      },
      { distance: 0 },
    )
    const ratio = maxDistance.distance / options.radius / 3
    //3.创建一个纹理
    const texture = await createdFlowLineTexture(options.icon, ratio)

    //4.设置材质
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    })
    //4.创建Mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.current.add(mesh)
  }
  const createdFlowLineTexture = (imgPath: string, ratio: number) => {
    // 初始化一个加载器
    const loader = new THREE.TextureLoader()
    return new Promise<THREE.Texture>((resolve) => {
      loader.load(imgPath, (texture: THREE.Texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        const { height, width } = texture.image
        // 图片分辨率
        const _ratio = height / width
        // 路径长度分辨率 / 图片分辨率 = 计算Y重复值
        const repeatY = ratio / _ratio
        texture.repeat.set(2, repeatY)
        texture.rotation = Math.PI / 2
        linesTexture.current.push(texture)
        resolve(texture)
      })
    })
  }
  const renderFlowLine = (deltaTime: number, speed: number) => {
    linesTexture.current.forEach((texture) => {
      texture.offset.y -= speed * deltaTime
    })
  }
  return <div className="l-full" ref={modelRef}></div>
}
