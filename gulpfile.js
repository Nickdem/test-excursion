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

function copyImg() {
  return src('src/img/**/*.*')
    .pipe(dest('dist/img'));   
};

function copyJs() {
  return src('src/js/*.js')
    .pipe(dest("dist/js"));
}

exports.build = series(clear, copyImg, css, scss, html, copyJs)
exports.dev = series(clear, copyImg, css, scss, html, copyJs, dev)
exports.clear = clear
