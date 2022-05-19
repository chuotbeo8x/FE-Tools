const gulp = require("gulp");
const { parallel, series } = require("gulp");

const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const sass = require('gulp-sass')(require('sass'));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create(); //https://browsersync.io/docs/gulp#page-top
const nunjucksRender = require("gulp-nunjucks-render");
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
// /*
// TOP LEVEL FUNCTIONS
//     gulp.task = Define tasks
//     gulp.src = Point to files to use
//     gulp.dest = Points to the folder to output
//     gulp.watch = Watch files and folders for changes
// */

// Optimise Images
function imageMin(cb) {
    gulp.src("src/assets/media/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/media"));
    cb();
}

// Copy all HTML files to Dist
function copyHTML(cb) {
    gulp.src("src/*.html").pipe(gulp.dest("dist"));
    cb();
}

// Minify HTML
function minifyHTML(cb) {
    gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
        .pipe(
            htmlmin({
                collapseWhitespace: true
            })
        )
        .pipe(gulp.dest("dist"));
    cb();
}

// Scripts
function js(cb) {
    gulp.src("src/assets/js/public/*js")
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat("custom.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("dist/js"));
    cb();
}

// Compile Sass
function css(cb) {
    gulp.src("src/assets/sass/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer({
            browserlist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css"))
        // Stream changes to all browsers
        .pipe(browserSync.stream());
    cb();
}

function bootstrap(cb) {
    gulp.src("src/assets/sass/vendors/bootstrap/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer({
            browserlist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css/vendors/bootstrap"))
        // Stream changes to all browsers
        .pipe(browserSync.stream());
    cb();
}

// Copy all CSS files to Dist
function copyCSS(cb) {
    gulp.src("src/assets/vendors/**/*.css").pipe(gulp.dest("dist/css/vendors"));
    cb();
}
// Copy all JS files to Dist
function copyJS(cb) {
    gulp.src("src/assets/vendors/**/*.js").pipe(gulp.dest("dist/js/vendors"));
    cb();
}
// Copy all Image files to Dist
function copyImage(cb) {
    gulp.src("src/assets/media/**/*").pipe(gulp.dest("dist/media/"));
    cb();
}

// Process Nunjucks
function nunjucks(cb) {
    gulp.src("src/pages/**/*.html")
        .pipe(
            nunjucksRender({
                path: ["src/templates/","src/templates/header","src/templates/footer","src/templates/block","src/templates/modal","src/templates/dialog","src/templates/offcanvas"]  // String or Array
            })
        )
        .pipe(gulp.dest("dist/pages"));
    cb();
}

function nunjucksMinify(cb) {
    gulp.src("src/pages/**/*.html")
        .pipe(
            nunjucksRender({
                path: ["src/templates/","src/templates/header","src/templates/footer","src/templates/block","src/templates/modal","src/templates/dialog","src/templates/offcanvas"]  // String or Array
            })
        )
        .pipe(
            htmlmin({
                collapseWhitespace: true
            })
        )
        .pipe(gulp.dest("dist/pages"));
    cb();
}

//Clean Files
function remove_files(cb){
    gulp.src('dist').pipe(clean());
    cb();
}

//List file


// Watch Files
function watch_files() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("src/assets/sass/**/*.scss", css);
    gulp.watch("src/assets/sass/vendors/bootstrap/*.scss", bootstrap);
    gulp.watch("src/assets/js/dev/*.js", js).on("change", browserSync.reload);
    gulp.watch("src/pages/**/*.html", nunjucks).on("change", browserSync.reload);
    gulp.watch("src/templates/**/*.html", nunjucks).on(
        "change",
        browserSync.reload
    );
}

// Default 'gulp' command with start local server and watch files for changes.
exports.default = series(nunjucks, css, bootstrap, copyCSS, copyJS, js, copyImage, imageMin, watch_files);

// 'gulp build' will build all assets but not run on a local server.
exports.build = parallel(nunjucksMinify, css, bootstrap, copyCSS, copyJS, js, copyImage, imageMin);

exports.del = parallel(remove_files);

