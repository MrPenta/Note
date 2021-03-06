// 判断当前数据是不是对象
export function isObject(data) {
  return typeof data === 'object' && data !== null
}

// 定义不可枚举不可更改属性
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value,
  })
}

export function proxy(vm, source, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[source][key]
		},
		set(newValue) {
			vm[source][key] = newValue
		}
	})
}