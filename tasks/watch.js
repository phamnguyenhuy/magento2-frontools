module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local vars
  var themeName = plugins.util.env.theme || false,
      themes    = themeName ? [themeName] : Object.keys(configs.themes);

  themes.forEach(name => {
    var theme = configs.themes[name];
    theme.locale.forEach(locale => {
      var themePath = theme.default ? theme.dest + '/' + locale : theme.src,
          files = plugins.globby.sync(
            [
              themePath + '/**/*.' + theme.lang,
              '!' + themePath + '/**/_*.' + theme.lang
            ]
          );
      if (theme.lang === 'less') {
        files.forEach(file => {
          var dependencyTree = require('../helpers/dependency-tree-builder')(theme, file),
              compiler       = require('../helpers/' + theme.lang)(gulp, plugins, configs, name, locale, file);

          gulp.watch(dependencyTree, () => {
            compiler();
          });
        });
      }
      else {
        var compiler = require('../helpers/' + theme.lang)(gulp, plugins, configs, name, locale, themePath + '/**/*.' + theme.lang);
        gulp.watch([themePath + '/**/*.' + theme.lang, '!' + themePath + '/node_modules/**'], () => {
          compiler();
        });
      }
    });
  });
};
