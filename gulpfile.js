const {src, dest, series, watch} = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    htmlmin = require('gulp-htmlmin'),
    serve = require('browser-sync').create(),
    concat = require('gulp-concat'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');

function clear() {
  return del('dist')
}

function css() {
  return src(['node_modules/normalize.css/normalize.css'])
    .pipe(concat('libs.scss'))
    .pipe(dest('src/scss'))
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}

function html() {
  return src('src/**.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function dev() {
  serve.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', serve.reload)
  watch('src/scss/**.scss', series(scss)).on('change', serve.reload)
}

function copy() {
  // let buildHtml = gulp.src('app/**/*.html')
  //   .pipe(gulp.dest('dist'));
  // let BuildCss = gulp.src('app/css/**/*.css')
  //   .pipe(gulp.dest('dist/css'));
  // let BuildJs = gulp.src('app/js/**/*.js')
  //   .pipe(gulp.dest('dist/js'));
  // let BuildFonts = gulp.src('app/fonts/**/*.*')
  //   .pipe(gulp.dest('dist/fonts'));

  return src('src/img/**/*.*')
    .pipe(dest('dist/img'));   
};

exports.build = series(clear, copy, css, scss, html)
exports.dev = series(clear, copy, css, scss, html, dev)
exports.clear = clear
