// ast语法树 用对象描述js/html语法
// 虚拟dom 用对象来描述dom节点的

import { parseHtml } from './parse-html'
import { generate } from './generate'

export function compileToFunction(template) {
  //  1) 解析html字符串 将html字符串 => ast语法树
  let root = parseHtml(template)

  // 2）需要将ast语法树生成render函数 就是字符串拼接（字符串模板引擎
  let code = generate(root)
  // 核心思路就是将模板转化成这段字符串 将ast再次转化成js的语法
  // _c 创建标签元素的方法 _v 创建文本 _s 转字符串的方法
  // _c("div", {id: app}, _c("p", indefined, _v('hello' + _s(name)), _v('hello)))
  console.log(code)

  // 所有的模板引擎实现都要借助new Function + with(定义变量作用域)

  //   const a = {
  // 	  b: 1
  //   }

  //   console.log(a.b, '----')
  //   with(a) {console.log(b, '=====') }
  let renderFn = new Function(`with(this){ return ${code} }`)

  // with(this) {
  // 	return _c("div", {id: app}, _c("p", indefined, _v('hello' + _s(name)), _v('hello')))
  // }
  console.log('renderFn:', renderFn)
  // vue的render方法 返回的是虚拟dom
  return renderFn
}
