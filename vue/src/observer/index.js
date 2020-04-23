import { isObject, def } from '../util/index'
import { arrayMethods } from './array.js'

class Observer {
  constructor(value) {
    // 如果数据层次过多，需要递归解析数据对象中的属性
    // proxy
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods

      def(value, '__ob__', this)
      // 如果是数组，不要对索引进行操作
      // 重写push pop shift unshift reverse splice sort等方法
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(data) {
    let keys = Object.keys(data)
    keys.forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }

  observerArray(data) {
    for (let i = 0; i < data.length; i++) {
      observer(data[i])
    }
  }
}

function defineReactive(data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      console.log('值发生变化')
      if (newValue === value) return
      observer(newValue) // 继续劫持用户设置的为对象的值
      value = newValue
    },
  })
}

// 把data中的数据 都是用Object.defineProperty
export function observer(data) {
  if (!isObject(data)) return

  new Observer(data) // 用来观测数据
}
