// Requiring Gulp
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');


gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer()) // Passes it through gulp-autoprefixer
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
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
  .pipe(gulp.dest('app'))
});

//watch files for changes
//second parameter is array of tasks to be completed before Gulp runs watch
gulp.task('watch', ['browserSync','sass','nunjucks'], function() {
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('app/pages/*.+(html|nunjucks)', ['nunjucks']);
  gulp.watch('app/data.json',['nunjucks']);
  gulp.watch('app/index.html', browserSync.reload);
  // ... Other watchers
});

gulp.task('run', ['browserSync','sass','nunjucks'])

gulp.task('default', ['run', 'watch']);