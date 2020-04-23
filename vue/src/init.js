import { initState } from './state'
import { compileToFunction } from "./compliler/index";
import { mountComponent } from "./lifecycle";

// 在原型上添加一个init方法
export function initMixin(Vue) {
  // 初始化流程
  Vue.prototype._init = function (options) {
    // 数据劫持
    const vm = this // vue中$options就是用户传递的属性
    vm.$options = options

    initState(vm)

    // 如果用户传入了el属性 需要将页面渲染出来
    // 如果用户传入了el 就要实现挂载流程

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    // 默认先回查找有没有render  没有render会才用temlate 如果template没有就要用el内容
    if (!options.render) {
      // 对模板进行编译
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
	  }
	  const render = compileToFunction(template)
	  options.render = render
	  console.log("options.render:", options.render, vm)
	  // 我们需要将template转化成render方法

	  // 渲染当前组件  挂载这个组件
	  mountComponent(vm, el);
    }
  }
}
