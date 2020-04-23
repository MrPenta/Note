const compiler = require('vue-template-compiler');
const r = compiler.compile('<div style="color: red" id="app">hello{{name}}</div>')
console.log(r.render)