/*
 * @Author: xiongman
 * @Date: 2023-11-03 13:35:02
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-03 13:35:02
 * @Description: 验证码生成工具类
 */

interface IVerifyCodeOptions {
  id?: string
  container?: HTMLDivElement
  width?: number
  height?: number
  type?: "blend" | "number"
  code?: string
}
const DEF_OPTIONS: IVerifyCodeOptions = {
  // 默认options参数值
  width: 100, // 默认canvas宽度
  height: 32, // 默认canvas高度
  type: "blend", // 图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
  code: "",
}
export class VerifyCode {
  constructor(options: IVerifyCodeOptions | string) {
    if (typeof options === "string") {
      this.options.id = options
    } else {
      Object.entries(options).forEach(([key, value]) => {
        // 根据传入的参数，修改默认参数值
        this.options[key] = value
      })
    }
    this.init()
  }

  options = DEF_OPTIONS
  canvasDom: HTMLCanvasElement

  /** 初始化方法* */
  init() {
    const { width, height, container, id } = this.options
    let cvsBox = container
    if (!cvsBox && id) {
      cvsBox = document.getElementById(id) as HTMLDivElement
    }
    if (!cvsBox) {
      throw new Error("未获取到容器节点，请传入容器节点对象或id！")
    }
    const { offsetWidth, offsetHeight } = cvsBox || { offsetWidth: width, offsetHeight: height }

    this.canvasDom = document.createElement("canvas")
    this.canvasDom.id = `verify-code${id ? `-${id}` : ""}`
    this.canvasDom.width = this.options.width = offsetWidth > 0 ? offsetWidth : width
    this.canvasDom.height = this.options.height = offsetHeight > 0 ? offsetHeight : height
    this.canvasDom.style.cursor = "pointer"
    this.canvasDom.innerHTML = "您的浏览器版本不支持canvas"
    this.canvasDom.onclick = () => {
      this.refresh()
    }
    cvsBox.appendChild(this.canvasDom)
  }

  // 生成验证码
  refresh() {
    this.options.code = ""
    const ctx = this.canvasDom?.getContext?.("2d")
    if (!ctx) return

    const { width, height, type } = this.options
    ctx.textBaseline = "middle"
    ctx.fillStyle = this.__randomColor(180, 240)
    ctx.fillRect(0, 0, width, height)

    let txtArr = this.__getAllLetter()
    if (type == "blend") {
      // 判断验证码类型, 混合
      txtArr = this.__getAllNumArr().concat(txtArr)
    } else if (type == "number") {
      txtArr = this.__getAllNumArr()
    }

    this
      // 绘制干扰线
      .__drawDisturbanceLine(ctx)
      // 绘制干扰点
      .__drawDisturbancePoint(ctx)
      // 绘制验证码
      .__createCodeData(ctx, txtArr)

    return this
  }

  /** 验证验证码* */
  validate(code: string) {
    if (!code) return false
    code = code.toLowerCase()
    const v_code = this.options.code.toLowerCase()
    return code == v_code
  }

  __getAllNumArr() {
    return "0,1,2,3,4,5,6,7,8,9".split(",")
  }
  __getAllLetter() {
    const letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    return `${letterStr},${letterStr.toLocaleUpperCase()}`.split(",")
  }

  /** 生成一个随机数* */
  __randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  /** 生成一个随机色* */
  __randomColor(min: number, max: number, a = 1) {
    const r = this.__randomNum(min, max)
    const g = this.__randomNum(min, max)
    const b = this.__randomNum(min, max)
    return `rgb(${[r, g, b, a].join(",")})`
  }

  // 绘制验证码
  __createCodeData(ctx: CanvasRenderingContext2D, txtArr: string[]) {
    const { width, height } = this.options
    for (let i = 1; i <= 4; i++) {
      const txt = txtArr[this.__randomNum(0, txtArr.length)]
      this.options.code += txt
      ctx.font = this.__randomNum((height * 3) / 4, height) + "px SimHei" // 随机生成字体大小
      ctx.fillStyle = this.__randomColor(50, 160) // 随机生成字体颜色
      // ctx.shadowOffsetX = this.__randomNum(-3, 3)
      // ctx.shadowOffsetY = this.__randomNum(-3, 3)
      ctx.shadowBlur = this.__randomNum(-3, 3)
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      const x = (width / 5) * i
      const y = height / 2
      const deg = this.__randomNum(-30, 30)
      /** 设置旋转角度和坐标原点* */
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(txt, 0, 0)
      /** 恢复旋转角度和坐标原点* */
      ctx.rotate((-deg * Math.PI) / 180)
      ctx.translate(-x, -y)
    }
    return this
  }

  // 绘制干扰线
  __drawDisturbanceLine(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.options
    /** 绘制干扰线* */
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = this.__randomColor(40, 180, 0.6)
      ctx.beginPath()
      ctx.moveTo(this.__randomNum(0, width), this.__randomNum(0, height))
      ctx.lineTo(this.__randomNum(0, width), this.__randomNum(0, height))
      ctx.stroke()
    }
    return this
  }

  // 绘制干扰点
  __drawDisturbancePoint(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.options
    for (let i = 0; i < width / 4; i++) {
      ctx.fillStyle = this.__randomColor(0, 255, 0.5)
      ctx.beginPath()
      ctx.arc(this.__randomNum(0, width), this.__randomNum(0, height), 1, 0, 2 * Math.PI)
      ctx.fill()
    }
    return this
  }
}
