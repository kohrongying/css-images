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
    ghPages = require('gulp-gh-pages'), //unused
    sitemap = require('gulp-sitemap'),
    fs = require('fs');
 
gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
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


/*
To create sitemap
*/
gulp.task('sitemap', () =>
  gulp.src('docs/**/*.html', {
    read: false
  })
    .pipe(sitemap({
      siteUrl: 'https://kohrongying.github.io/css-images'
    }))
    .pipe(gulp.dest('docs')));

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

gethtml = (name) => {
  return '\
{% extends "layout.nunjucks" %}\n\
{% block title %}\n\
  {}\n\
{% endblock %}\n\
{% block scripts %}\n\
  <link rel="stylesheet" href="css/{}.css">\n\
{% endblock %}\n\
{% block content %}\n\
  <div class="box">\n\
  </div>\n\
{% endblock %}'.format(name,name)
}

const getcss = "body{ background-color: white!important;}"

gulp.task('new', (callback) => {
  let index = process.argv.indexOf('--name');
  let name = process.argv[index+1];
  fs.writeFile("app/scss/"+name+".scss", getcss);
  fs.writeFile("app/pages/"+name+".html", gethtml(name), callback);
});




//watch files for changes
//second parameter is array of tasks to be completed before Gulp runs watch
gulp.task('watch', ['browserSync','sass','nunjucks'], function() {
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('app/pages/*.+(html|nunjucks)', ['nunjucks']);
  gulp.watch('app/data.json',['nunjucks']);
  gulp.watch('docs/*.html', browserSync.reload);
  // ... Other watchers
});

gulp.task('run', ['browserSync','sass','nunjucks', 'crop'])

gulp.task('default', ['run', 'watch']);

// gulp.task('default', function() {
//     return gulp.src('src/images/*')
//         .pipe(imagemin({
//             progressive: true,
//             use: [pngquant()]
//         }))
//         .pipe(gulp.dest('dist/images'));
// });