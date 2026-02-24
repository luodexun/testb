const ResponseListener = {
  listenerMap: new Map(),
  addListener(id: string, callback: (params: unknown) => void) {
    if (typeof callback !== "function") {
      throw new Error(`callback 需传入方法`)
    }
    if (!this.listenerMap.has(id)) {
      this.listenerMap.set(id, [])
    }
    const theList = this.listenerMap.get(id)
    if (theList.includes(callback)) return
    theList.push(callback)
  },
  removeListener(id: string, callback: (params: unknown) => void) {
    if (!this.listenerMap.has(id)) return
    let theList = this.listenerMap.get(id)
    theList = theList.filter((item: typeof callback) => item === callback)
    this.listenerMap.set(id, theList)
  },
  handleListener(id: string, ...set: unknown[]) {
    if (!this.listenerMap.has(id)) return
    const theList = this.listenerMap.get(id)
    if (!theList.length) return
    theList.forEach((callbackFun) => {
      if (typeof callbackFun !== "function") return
      callbackFun(...set)
    })
  },
}
export default ResponseListener
