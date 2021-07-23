const fs = require('fs-extra')

const needCopyDirs = fs.readdirSync('./dist').filter((path) => fs.statSync('./dist/' + path).isDirectory())

const paths = fs.readdirSync('./sandboxs')
for (let path of paths) {
    const info = fs.statSync('./sandboxs/' + path)
    if (info.isDirectory()) {
        for (let needCopyDir of needCopyDirs) {
            fs.removeSync('./sandboxs/' + path + '/' + needCopyDir)
        }
        fs.copySync('./dist/', './sandboxs/' + path)
    }
}
