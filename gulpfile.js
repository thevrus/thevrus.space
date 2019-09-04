const gulp = require("gulp");
const del = require("del");
const plumber = require('gulp-plumber');
const browserSync = require("browser-sync");

// Styles
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");
const cleanCss = require('gulp-clean-css');

// Scripts
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// HTML
const header = require("gulp-header");
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const package = require("./package.json");
const BANNER = {
  full:
    "/*!\n" +
    " * <%= package.name %> v<%= package.version %>\n" +
    " * <%= package.description %>\n" +
    " * (c) " +
    new Date().getFullYear() +
    " <%= package.author.name %>\n" +
    " * <%= package.license %> License\n" +
    " * <%= package.repository.url %>\n" +
    " */\n\n",
  min:
    "/*!" +
    " <%= package.name %> v<%= package.version %>" +
    " | (c) " +
    new Date().getFullYear() +
    " <%= package.author.name %>" +
    " | <%= package.license %> License" +
    " | <%= package.repository.url %>" +
    " */\n"
};

const PATHS = {
  input: "src/",
  output: "./dist/",
  scripts: {
    input: "src/js/*",
  },
  styles: {
    input: "./src/scss/**/*.scss",
  },
  html: {
    input: "src/pages/*.html",
    watch: "./src/pages/**/*.html"
  },
  images: {
    input: "src/images/**/*",
  },
  reload: "./dist/"
};


gulp.task("clean", function () {
  return del([ "dist" ]);
});

gulp.task("fileinclude", function (cb) {
  gulp.src(PATHS.html.input)
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '#',
      basepath: './src/pages'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'));
  cb();
});

gulp.task("css:dev", function () {
  return gulp
    .src(PATHS.styles.input)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(PATHS.output))
    .pipe(browserSync.stream());
});

gulp.task("css:prod", function () {
  return gulp
    .src(PATHS.styles.input)
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(
      prefix({
        browsers: [ "last 2 version", "> 0.25%" ],
        cascade: true,
        remove: true
      })
    )
    .pipe(
      minify({
        discardComments: {
          removeAll: true
        }
      })
    )
    .pipe(header(BANNER.full, { package: package }))
    .pipe(gulp.dest(PATHS.output));
});

gulp.task("js:prod", function () {
  return gulp
    .src(PATHS.scripts.input)
    .pipe(babel({
      presets: [ '@babel/env' ]
    }))
    .pipe(uglify())
    .pipe(header(BANNER.full, { package: package }))
    .pipe(gulp.dest(PATHS.output))
})

gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });

  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch(PATHS.styles.input).on("change", gulp.series([ "css:dev" ], browserSync.reload));
  gulp.watch(PATHS.scripts.input).on("change", gulp.series([ "js:prod" ], browserSync.reload));
  gulp.watch(PATHS.images.input).on("change", gulp.series([ "copyImages" ], browserSync.reload));
  gulp.watch(PATHS.html.watch).on('change', gulp.series([ "fileinclude" ], browserSync.reload));
});

gulp.task("copyImages", function () {
  return gulp.src(PATHS.images.input).pipe(gulp.dest(PATHS.output + '/images/'));
});

gulp.task("build", function (cb) {
  gulp.series("css:prod");
  cb();
});