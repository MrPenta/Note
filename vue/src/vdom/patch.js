export function patch(oldVnode, vnode) {
  console.log('oldVnode:', oldVnode, vnode)

  // 1.判断更新还是要渲染

  const isReadElement = oldVnode.nodeType
  // 第一次渲染肯定是真是的，只考虑这个
  if (isReadElement) {
    const oldElm = oldVnode
    const parentElm = oldVnode.parentNode // 要把新元素放到旧的后面  然后再删掉旧元素

    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)

    parentElm.removeChild(oldElm)
  }
  // 递归创建真实节点  替换掉老的节点
}

function createElm(vnode) {
  // 根据虚拟节点创建真实节点
  let { tag, data, key, children, text } = vnode
  // 是标签就创建标签
  // 是文本就创建文本
  // 暂不考虑组件
  if (typeof tag === 'string') {
	vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach((child) => {
      // vnode 为父节点
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    // 虚拟dom映射着真是dom 方便后续更新操作
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

// 更新添加属性
function updateProperties(vnode) {
  let newProps = vnode.data || {}
  let el = vnode.el
  // 只处理了样式问题
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
