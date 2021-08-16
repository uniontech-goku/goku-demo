const fs = require('fs-extra')

const demoPaths = fs.readdirSync('./demos/')
for (const demoPath of demoPaths) {
    const demo = fs.statSync('./demos/' + demoPath)
    if (demo.isDirectory()) {
        fs.removeSync('./sandboxs/' + demoPath)
        fs.ensureDirSync('./sandboxs/' + demoPath)
        fs.copySync('./template/', './sandboxs/' + demoPath)
        fs.copySync('./demos/' + demoPath + '/', './sandboxs/' + demoPath + '/src/app')
    }
}
