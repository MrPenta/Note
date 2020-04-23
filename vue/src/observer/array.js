// 重写数组方法 push pop shift unshift reverse splice sort 会导致原数组发生变化的方法

const oldArrayMethods = Array.prototype
export const arrayMethods = Object.create(oldArrayMethods)

const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'splice', 'sort']

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    console.log('用户调用了push')
    const result = oldArrayMethods[method].apply(this, args)
    // push unshift添加的元素可能还是个对象

    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
      default:
        break
    }
    if (inserted) this.__ob__.observerArray(inserted) // 将新增属性继续观测
    return result
  }
})
