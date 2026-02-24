/*
 * @Author: xiongman
 * @Date: 2023-06-29 14:35:24
 * @LastEditors: xiongman
 * @LastEditTime: 2023-06-29 14:35:24
 * @Description: 表格自动滚动方法类
 */

interface ITbScrollConfigs {
  step?: number
  haltMode?: { haltTime?: number; scrollRowClass?: string; rowHeight?: number }
  initScroll?: boolean
  listener?: boolean
  listenerDom?: Element
}
export class TableScroll {
  constructor(scrollBoxDom: Element | null, configs?: ITbScrollConfigs) {
    this.setDom(scrollBoxDom, configs)
  }

  scrollBoxDom = null
  listenerDom = null
  prevScrollTop = 0
  haltRowHeight = 0
  animationTimer = 0
  isStop = true
  configs: ITbScrollConfigs = {
    step: 1,
  }

  init() {
    if (!this.scrollBoxDom) return
    const { initScroll, listenerDom, haltMode, listener = true } = this.configs
    this.listenerDom = listenerDom || this.scrollBoxDom
    if (haltMode) {
      // 需要滚动一行停顿的情况
      const { scrollRowClass, rowHeight } = haltMode
      const tabTrWrap = scrollRowClass ? this.scrollBoxDom.querySelector(scrollRowClass) : null
      this.haltRowHeight = tabTrWrap ? tabTrWrap.getBoundingClientRect().height : rowHeight
    }
    if (initScroll) this.startAnimation()
    if (listener) this.addListener()
  }

  setDom(scrollBoxDom: Element | null, configs?: ITbScrollConfigs) {
    this.scrollBoxDom = scrollBoxDom
    this.configs = { ...this.configs, ...(configs || {}) }
    this.init()
  }

  addListener() {
    if (!this.listenerDom) return
    this.removeListener()
    this.listenerDom.addEventListener("mouseover", this.stopAnimation.bind(this))
    this.listenerDom.addEventListener("mouseout", this.startAnimation.bind(this))
  }

  removeListener() {
    if (!this.listenerDom) return
    this.listenerDom.removeEventListener("mouseover", this.stopAnimation.bind(this))
    this.listenerDom.removeEventListener("mouseout", this.startAnimation.bind(this))
  }

  destory() {
    this.stopAnimation()
    this.removeListener()
    this.resetFields()
  }

  resetFields() {
    this.scrollBoxDom = this.listenerDom = null
    this.prevScrollTop = this.animationTimer = this.haltRowHeight = 0
    this.isStop = true
  }

  startAnimation() {
    if (this.haltRowHeight > 0) {
      // 滚动了几行，行数乘以滚动高度就是应该滚动的高度
      this.prevScrollTop = Math.floor(this.scrollBoxDom.scrollTop / this.haltRowHeight) * this.haltRowHeight
    }
    this.stopAnimation()
    this.isStop = false
    this.animationTimer = requestAnimationFrame(this.autoScroll.bind(this))
  }

  stopAnimation() {
    cancelAnimationFrame(this.animationTimer)
    this.isStop = true
    this.animationTimer = 0
  }

  autoScroll() {
    // 停止
    if (this.isStop || !this.scrollBoxDom) return
    // 判断是否有滚动条
    if (this.scrollBoxDom.scrollHeight <= this.scrollBoxDom.clientHeight) return
    //判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
    const cHeight = Math.ceil(this.scrollBoxDom.scrollTop + this.scrollBoxDom.clientHeight)
    if (cHeight >= this.scrollBoxDom.scrollHeight) {
      this.prevScrollTop = this.scrollBoxDom.scrollTop = 0
    } else {
      this.scrollBoxDom.scrollTop += this.configs.step // 元素自增距离顶部
    }

    if (!this.configs.haltMode) {
      return this.startAnimation()
    }
    const { haltTime = 800 } = this.configs.haltMode
    const notHalt =
      this.scrollBoxDom.scrollTop > 0 && this.scrollBoxDom.scrollTop - this.prevScrollTop < this.haltRowHeight
    if (notHalt) {
      this.startAnimation()
    } else {
      this.prevScrollTop = this.scrollBoxDom.scrollTop
      window.setTimeout(this.startAnimation.bind(this), haltTime)
    }
  }
}
