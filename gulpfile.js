'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('default', function(){
	return  gulp.src('./www/static/js/theme_basic.js')
		.pipe(browserify({
			
		}))
		.pipe(gulp.dest('./www/static/js/compiled/'));
});
