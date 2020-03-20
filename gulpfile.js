var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create();
    notify = require("gulp-notify");
    babel = require("gulp-babel");
    browserify = require('browserify');
    htmlmin = require('gulp-htmlmin');



var paths = {
    styles: {
        src: "dev/styles/**/*.scss",
        dest: "public/styles/"
    },
    html: {
        src: "dev/*.html",
        dest: "./public/"
    },
    js: {
        src: "dev/scripts/*.js",
        dest: "public/scripts/"
    }
};

function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in CSS 💩'
        }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(paths.html.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function js() {
    browserify(paths.js.src, { debug: true })
    return gulp
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💩'
        }))
        .src(paths.js.src) 
        .pipe(babel({
            presets: ['@babel/env']
        }))
        
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
        
}


// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
 
        server: {
            baseDir: "public"
        }

    });
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.js.src, js);

    gulp.watch("public/index.html").on('change', browserSync.reload);
    gulp.watch("public/*.js").on('change', browserSync.reload);
}

// We don't have to expose the reload function
// It's currently only useful in other functions


// Don't forget to expose the task!
exports.watch = watch

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;
exports.html = html;
exports.js = js;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, html, watch);

gulp.task('build', html, style, js);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);