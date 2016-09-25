var gulp = require('gulp'),
	jsdoc = require('gulp-jsdoc3');

gulp.task('docs', function(cb){
	let config = require('./jsdoc.json');
	
	gulp.src(['./**/*.js'])
		.pipe(jsdoc(config, cb))
});

gulp.task('default', []);