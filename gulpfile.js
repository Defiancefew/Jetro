var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var sass = require('gulp-ruby-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var watch = require('gulp-watch');
var spritesmith = require('gulp.spritesmith');
var reload = browserSync.reload;
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var cmq = require('gulp-combine-media-queries');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var size = require('gulp-filesize');
var copy = require('gulp-copy');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('concat', function() {
  return gulp.src('src/lib/**/*.js')
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
    .pipe(size())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('browsersync',['sass'],function() {

    browserSync.init({
        server: "src",
        notify: false,
        browser: "Firefox"
        });

    gulp.watch("src/sass/*.sass", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/*.js").on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return sass('src/sass/style.sass', {sourcemap: true})
        .pipe(plumber())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css/'))
        .pipe(reload({stream: true}));
});

gulp.task('jade', function() {
  return gulp.src('src/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('src'))
    .pipe(browserSync.reload({stream: true}))
    .on('end', browserSync.reload);
});

gulp.task('imagemin', function () {
    return gulp.src('src/img/*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('dist/img'));
});


gulp.task('minify-css', function() {
  return gulp.src('src/css/style.css')
    .pipe(plumber())
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename('style.min.css'))
    .pipe(size())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/sprites/*.png')
  .pipe(plumber())
  .pipe(spritesmith({
    imgName: 'spritesheet.png',
    imgPath: '../img/spritesheet.png',
    cssName: '../sass/sprites.css',
    algorithm: 'top-down',
    padding: 1
  }));
  return spriteData.pipe(gulp.dest('src/img'));
});

gulp.task('rename', function(){
  gulp.src('src/sass/sprites.css').pipe(plumber()).pipe(rename("sprites.scss")).pipe(gulp.dest('src/sass'));
});

gulp.task('clean', function() {
  return gulp.src('dist',{ read: false })
    .pipe(plumber())
    .pipe(rimraf({ force: true }));
});

gulp.task('cmq', function () {
  gulp.src('src/css/*.css')
    .pipe(plumber())
    .pipe(cmq({
      log: true
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('prefix', function () {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css/'));
});

gulp.task('copy', function() {
    gulp.src('src/robots.txt')
      .pipe(gulp.dest('dist'));
    gulp.src('src/humans.txt')
      .pipe(gulp.dest('dist'));
    gulp.src('src/.htaccess')
      .pipe(gulp.dest('dist'));
    gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));
    gulp.src('src/404.html')
      .pipe(gulp.dest('dist'));
    gulp.src('src/fonts/*.*')
      .pipe(gulp.dest('dist/fonts/'));
  });

gulp.task('default', ['jade','browsersync'], function () {
    gulp.watch("src/**/*.jade", ['jade']);
    gulp.watch("src/sass/*.sass", ['sass']);
    gulp.watch("src/sass/sprites.css", ['rename']);
  });

gulp.task('dist', ['clean'], function() {
  gulp.run(['copy','concat','prefix','cmq','minify-css','imagemin']);
});