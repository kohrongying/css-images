// Requiring Gulp
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    imageResize = require('gulp-image-resize'),
    minifyCSS = require('gulp-clean-css'),
    minifyHTML = require('gulp-htmlmin'),
    copy = require('gulp-copy'),
    ghPages = require('gulp-gh-pages');
 
gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer()) // Passes it through gulp-autoprefixer
    .pipe(minifyCSS())
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'docs'
    }
  })
});

gulp.task('nunjucks', function() {
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  	.pipe(data(function(){
  		return require('./app/data.json')
  	}))
  	.pipe(nunjucksRender({
      	path: ['app/templates']
    }))
    .pipe(minifyHTML({collapseWhitespace: true}))
  .pipe(gulp.dest('docs'))
});

/*
To Crop Images
*/
gulp.task('crop', () => 
  gulp.src('app/img/*.png')
    .pipe(imageResize({
      width: 800,
      height: 800,
      crop: true
    }))
    .pipe(gulp.dest('docs/img')));

/*
To Copy Index.html from docs to root folder
*/
gulp.task('copyIndex', () => 
  gulp.src('docs/index.html')
    .pipe(gulp.dest('./')));

//watch files for changes
//second parameter is array of tasks to be completed before Gulp runs watch
gulp.task('watch', ['browserSync','sass','nunjucks','crop'], function() {
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('app/pages/*.+(html|nunjucks)', ['nunjucks','copyIndex']);
  gulp.watch('app/data.json',['nunjucks']);
  gulp.watch('app/img/src/*.png', ['crop']);
  gulp.watch('app/index.html', browserSync.reload);
  // ... Other watchers
});

gulp.task('run', ['browserSync','sass','nunjucks', 'crop'])

gulp.task('default', ['run', 'watch']);