const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  // 处理属性，拼接成字符串
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      // style="color: #333;background: #999;" => {style: {color: #333, background: #999}, id: app, a: 1}
      let obj = {}
      attr.value
        .split(';')
        .filter((i) => !!i)
        .forEach((item) => {
          let [key, value] = item.split(':')
          obj[key.trim()] = value
        })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
    // str += `${attr.name}:${attr.value},`
    console.log('str123:', str)
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  let children = el.children
  if (children && children.length) {
    return `${children.map((c) => gen(c)).join(',')}`
  } else {
    return false
  }
}

function gen(node) {
  if (node.type == 1) {
    // 元素类型
    return generate(node)
  } else {
    let text = node.text // hello {{ name }} world {{age}} hahaha
    let tokens = []
    let match, index
    // 每次的偏移量
    // exec 正则的lastIndex的问题  需要重置lastIndex
    let lastIndex = (defaultTagRE.lastIndex = 0)
    // console.log( defaultTagRE.exec('123'), '---')
    while ((match = defaultTagRE.exec(text))) {
      console.log('match:', match)
      index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    // hello + _s(name) + world + _s(age) + hahaha
    // _v(hello + _s(name) + word + _s(age) + hahaha)

    // let reg = /a/g
    // reg.test('abc')

    return `_v(${tokens.join('+')})`
  }
}

export function generate(el) {
  let children = genChildren(el)
  console.log(el, el.attrs, '---')
  // attrs: [{name: 'id', value: 'app}, {name: 'a', value: '1'}] => {id: app, a: 1}
  let code = `_c("${el.tag}", ${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `,${children}` : ''})`
  return code
}
