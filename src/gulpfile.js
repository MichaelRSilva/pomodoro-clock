/**
 * Created by michaeldfti on 14/01/17.
 */

var gulp                    = require('gulp');
var livereload              = require("gulp-livereload");
var sass                    = require("gulp-sass");
var sourcemaps              = require("gulp-sourcemaps");
var plumber                 = require("gulp-plumber");
var uglify                  = require("gulp-uglify");
var concat                  = require("gulp-concat");
var imagemin                = require('gulp-imagemin');
var imageminPngquant        = require('imagemin-pngquant');
var imageminJpegRecompress  = require('imagemin-jpeg-recompress');
var zip                     = require('gulp-zip');


//Filespaths
var DIST_PATH       = 'public/dist';
var SCSS_PATH       = 'public/assets/scss/**/*.scss';
var SCRIPTS_PATH    = 'public/assets/scripts/**/*.js';
var IMAGES_PATH     = 'public/assets/img/**/*.{png,jpeg,jpg,svg,gif}';
var HTML_PATH       = 'public/**/*.html';
var ANGULAR_PATH    = 'public/app/**/*.js';


//Styles For SCSS
gulp.task("styles", function(){
    console.log("starting styles task");
    return gulp.src([SCSS_PATH])
        .pipe(plumber(function (err) {
            console.log("Styles task Error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH + '/css'))
        .pipe(livereload());
});

//Scripts
gulp.task("scripts", function(){
    console.log("starting scripts task");
    return gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-route/angular-route.min.js',
        SCRIPTS_PATH])
        .pipe(plumber(function (err) {
            console.log("Scripts task Error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH + '/scripts'))
        .pipe(livereload());
});

//Images
gulp.task("images", function(){
    console.log("starting images task");
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + '/img'))
        .pipe(livereload());
});

//Fonts
gulp.task('fonts', function() {
    console.log("starting fonts task");
    return gulp.src([])
        .pipe(gulp.dest(DIST_PATH + '/fonts/'));
});

//HTML
gulp.task('html', function() {
    console.log("starting html task");
    return gulp.src([HTML_PATH])
        .pipe(livereload());
});

//AngularJS
gulp.task('angular', function() {
    console.log("starting angular task");
    return gulp.src([ANGULAR_PATH])
        .pipe(livereload());
});


//Default
gulp.task('default', ['images', 'styles', 'scripts', 'fonts', 'html', 'angular'], function () {
    console.log("starting default task");
});


//Deploy-Production
gulp.task('deploy-production', ['default'], function () {

    console.log("starting deploy-production task");
    return gulp.src([
            'public/dist/**',
            'public/app/**',
            'public/*.html'],
        { base : "public/" })
        .pipe(zip('deploy-production.zip'))
        .pipe(gulp.dest('public/'));
});


gulp.task('watch', ['default'], function () {
    console.log("starting watch task");
    require("./server.js");
    livereload.listen();
    gulp.watch(IMAGES_PATH, ['images']);
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);
    gulp.watch(HTML_PATH, ['html']);
    gulp.watch(ANGULAR_PATH, ['angular']);

});