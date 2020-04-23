import Watcher from './observer/watcher'
import { patch } from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    // 通过虚拟节点 渲染真实dom
    vm.$el = patch(vm.$el, vnode) // vm.$el是旧的dom  需要用虚拟节点创建出真实节点  替换掉真实的$el
    console.log('vnode:', vnode)
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el // $el 真实的dom元素
  //   console.log(options, vm.$el)

  // 渲染页面

  // 更新页面，渲染更新都要调用此方法
  let updateComponent = () => {
    // vm._render(); 返回虚拟dom
    // 虚拟dom还需要变成真实dom 就调用 vm._update方法 vm._update拿到虚拟dom生成真实dom
    // Watcher 用来渲染页面
    vm._update(vm._render())
  }

  // 渲染watcher 每个组件都有一个watcher 我们需要new Watcher
  new Watcher(vm, updateComponent, () => {}, true) // true 表示他是一个渲染watcher   不需要回调
}
