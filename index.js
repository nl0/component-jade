var debug = require('debug')('component:jade')
  , fs = require('fs')
  , jade = require('jade')
  , path = require('path')


module.exports = function(builder) {
  builder.hook('before scripts', function(pkg, callback) {
    ;(pkg.config.scripts || []).slice().forEach(function(file) {
      if (path.extname(file) !== '.jade') return

      debug('compiling "%s"', file)

      var fullName = pkg.path(file)
        , src = fs.readFileSync(fullName, 'utf8')
        , compiled = jade.compile(src,
          { client: true
          , compileDebug: false
          , filename: fullName
          })
        , runtimeRequire = 'var jade = require("jade");\n'
        , contents = runtimeRequire + 'module.exports = ' + compiled
        , jsFile = file.replace(/\.jade$/, '.js')

      pkg.addFile('scripts', jsFile, contents)
      pkg.removeFile('scripts', file)
      debug('compiled "%s" -> "%s"', file, jsFile)
    })

    callback()
  })
}
