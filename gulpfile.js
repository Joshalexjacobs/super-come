var addStream     = require('add-stream');
var gulp          = require('gulp');
var nodemon       = require('gulp-nodemon');
var inject        = require('gulp-inject');
var concat        = require('gulp-concat');
var concatCss     = require('gulp-concat-css');
var cssNano       = require('gulp-cssnano');
var rename        = require('gulp-rename');
var sourceMaps    = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var ts            = require('gulp-typescript');
var tslint        = require('gulp-tslint');
var uglify        = require('gulp-uglify');
var sass          = require('gulp-sass');
var path          = require('path');
var wiredep       = require('wiredep').stream;
var _             = require('underscore');

// Lint to keep us in line
gulp.task('lint', function() {
	return gulp.src('public/src/app/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report('default'));
});

// Concatenate & minify JS
gulp.task('scripts', function() {

	return gulp.src('public/src/app/**/*.ts')
		.pipe(addStream.obj(prepareTemplates()))
		.pipe(sourceMaps.init())
		.pipe(ts({
			noImplicitAny: true,
			suppressImplicitAnyIndexErrors: true,
			out: 'app.js'
		}))
		.pipe(gulp.dest('public/dist'))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest('public/dist'));
});

// Compile, concat & minify sass
// gulp.task('sass', function () {
// 	return gulp.src('public/src/**/*.scss')
// 		.pipe(sass().on('error', sass.logError))
// 		.pipe(gulp.dest('public/dist/css'));
// });

// gulp.task('concatCss', ['sass'], function () {
// 	return gulp.src('public/dist/css/**/*.css')
// 		.pipe(concatCss("app.css"))
// 		.pipe(gulp.dest('public/dist'))
// });

// gulp.task('cssNano', ['sass', 'concatCss'], function() {
// 	return gulp.src('public/dist/app.css')
// 		.pipe(cssNano())
// 		.pipe(rename({suffix: '.min'}))
// 		.pipe(gulp.dest('public/dist'));
// });

gulp.task('sass', function () {
	return gulp.src('public/src/app/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('public/dist/css'));
});

gulp.task('concatCss', ['sass'], function () {
	return gulp.src('public/src/app/styles/*.css')
		.pipe(concatCss("app.css"))
		.pipe(gulp.dest('public/dist'))
});

gulp.task('cssNano', ['sass', 'concatCss'], function() {
	return gulp.src('public/src/app/styles/main.css')
		.pipe(cssNano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dist'));
});

// Grab and move all image files to dist
gulp.task('build-images', function() {
	return gulp.src('./public/img/**/*.{gif,jpg,png,svg}')
		.pipe(gulp.dest('public/dist/img'));
});

// grab index.html and move it into dist
gulp.task('index', function() {
	return gulp.src('./public/src/app/index.html')
		.pipe(gulp.dest('public/dist/'));
});

// Inject dist + bower lib files
gulp.task('inject', ['scripts', 'cssNano'], function(){

	// inject our dist files
	var injectSrc = gulp.src([
		'./public/dist/app.css',
		'./public/dist/app.js'
	], { read: false });

	var injectOptions = {
		ignorePath: '/public'
	};

	// inject bower deps
	var options = {
		bowerJson: require('./bower.json'),
		directory: './public/lib',
		ignorePath: '../../public'
	};

	return gulp.src('./public/*.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./public'));

});

gulp.task('serve', ['scripts', 'cssNano', 'build-images', 'index', 'inject'], function(){

	var options = {
		restartable: "rs",
		verbose: true,
		ext: "ts html scss",
		script: 'server.js',
		delayTime: 1,
		watch: ['public/src/app/**/*(*.ts|*.html)', 'public/src/**/*.scss', 'public/img/**/*.{gif,jpg,png,svg}', 'public/src/app/index.html'],
		env: {
			'PORT': 3000
		},
		ignore: ["public/dist/*", "public/dist/**/**"],
		// bit faster if we only do what we need to
		tasks: function (changedFiles) {
			var tasks = [];
			changedFiles.forEach(function (file) {
				var ext = path.extname(file);
				if (ext === '.ts' || ext === '.html'){
					tasks.push('lint');
					tasks.push('scripts');
				}
				else if (ext === '.scss'){
					tasks.push('sass');
					tasks.push('concatCss');
					tasks.push('cssNano');
				}
			});
			return tasks
		}
	};

	return nodemon(options)
		.on('restart', function(ev){
			console.log('restarting..');
		});
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'sass', 'concatCss', 'cssNano', 'build-images', 'inject', 'serve']);

gulp.task('build', ['index', 'default']);

function prepareTemplates() {

	// we get a conflict with the < % = var % > syntax for $templateCache
	// template header, so we'll just encode values to keep yo happy
	var encodedHeader = "angular.module(&quot;&lt;%= module %&gt;&quot;&lt;%= standalone %&gt;).run([&quot;$templateCache&quot;, function($templateCache:any) {";
	return gulp.src('public/src/app/**/*.html')
		.pipe(templateCache('templates.ts', {
			root: "app-templates",
			module: "app.templates",
			standalone : true,
			templateHeader: _.unescape(encodedHeader)
		}));
}