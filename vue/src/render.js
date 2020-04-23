import { createElement, createTextNode } from './vdom/create-element'

export function renderMixin(Vue) {

  // _c 创建元素虚拟节点
  // _v 创建文本虚拟节点
  // _s JSON.stringify
  // 直接_c执行  相当于 this._c 那么就可以放到原型上了

  Vue.prototype._c = function () {
    console.log('arguments:', [...arguments])
    return createElement(...arguments)
  }

  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }
  // _s的参数可能取不到可能是个object或者array，需要JSON.stringify
  Vue.prototype._s = function (val) {
    return val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : val
  }
  Vue.prototype._render = function () {
    // 生成虚拟dom
    const vm = this
    const { render } = vm.$options
    // console.log('render123:', render)
	let vnode = render.call(vm)
	return vnode
  }
}
