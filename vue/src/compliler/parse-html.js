// ?:匹配  不捕获

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >  <div>

export function parseHtml(html) {
  let root = null // ast语法树树根
  let currentParent // 标识当前父亲是谁
  let stack = [] // 栈结构去判断dom合法性的
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    }
  }

  // [div, p, span] 用栈结构去判断dom合法性
  //<div><p><span></span></p></div>

  function start(tagName, attrs) {
    console.log('开始标签：', tagName, '属性时：', attrs)
    // 遇到开始标签，创建ast元素
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element // 把当前元素标记成父ast树
    stack.push(element)
  }

  function chars(text) {
    console.log('文本是：', text)
    text = text.replace(/\s/g, '') // 用空替换了空字符
    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE,
      })
    }
  }

  function end(tagName) {
    console.log('结束标签', tagName)
    const element = stack.pop()
    // 标识当前这个标签属于前面一个父亲的，父亲是栈中最后一个
    // 判断是不是最后一个  如果栈中只有一个div，你pop完后就空了，说明没有父级，我们也不用处理这种情况，有说明有父级
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
  // 不停地去解析html
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      // 如果索引为0，肯定是一个标签  开始标签或者结束标签
      let startTagMatch = parseStartTag() // 通过这个方法获取到匹配结果 tagName，attrs等等
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs) // 1.解析开始标签
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1]) // 2.解析结束标签
        continue
      }
    }
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text) // 3.解析文本
    }
  }
  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
      }
      if (end) {
        // 去掉开始标签的 <
        advance(end[0].length)
        return match
      }
    }
  }
  return root
}
