const gulp = require("gulp");
const del = require("del");
// Styles
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");
const header = require("gulp-header");
const browserSync = require("browser-sync");
// Scripts

const PATHS = {
  input: "src/",
  output: "dist/",
  scripts: {
    input: "src/js/*",
    polyfills: ".polyfill.js",
    output: "dist/js/"
  },
  styles: {
    input: "src/scss/**/*.{scss,sass}",
    output: "dist/css/"
  },
  svgs: {
    input: "src/svg/*.svg",
    output: "dist/svg/"
  },
  copy: {
    input: "src/copy/*",
    output: "dist/"
  },
  reload: "./dist/"
};

gulp.task("clean", function clean() {
  return del(["dist"]);
});

gulp.task("style", function style() {
  return gulp
    .src(PATHS.styles.input)
    .pipe(sass())
    .pipe(gulp.dest(PATHS.styles.output))
    .pipe(browserSync.stream());
});

gulp.task("style:prod", function style() {
  return gulp
    .src(PATHS.styles.input)
    .pipe(sass())
    .pipe(
      prefix({
        browsers: ["last 2 version", "> 0.25%"],
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
    .pipe(gulp.dest(PATHS.styles.output));
});

gulp.task("serve", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("*.html").on("change", browserSync.reload);
  gulp
    .watch(PATHS.styles.input)
    .on("change", gulp.series(["style"], browserSync.reload));
});

gulp.task("copyFiles", function() {
  return gulp.src(PATHS.copy.input).pipe(gulp.dest(PATHS.copy.output));
});

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
