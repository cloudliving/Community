var gulp = require("gulp");
var concat = require("gulp-concat");
var csso = require("gulp-csso");
var replace = require("gulp-replace");
var build = require("gulp-html-replace");


// 合并css
gulp.task("concatCss", function() {
	return gulp.src(["./public/css/*.css", "./public/css/**/*.css"])
                .pipe(replace(/(\.\.\/){0,4}public/g,'http://cloudliving-img.b0.upaiyun.com/static/Home/Community'))
		        .pipe(concat("community.min.css"))
		        .pipe(csso())
		        .pipe(gulp.dest("./build/public/css"));
});

// 转移script文件夹
gulp.task("moveJs", function() {
	return gulp.src(["./public/js/*.js"])
                .pipe(replace(/(\.\.\/){0,4}public/g,'http://cloudliving-img.b0.upaiyun.com/static/Home/Community'))
	            .pipe(gulp.dest("./build/public/js"));
});

// 转移font文件夹
gulp.task("moveFont", function() {
	return gulp.src(["./public/fonts/*"])
	            .pipe(gulp.dest("./build/public/fonts"));
});


// 转移lib文件夹
gulp.task('movelib',function(){
    return gulp.src('./public/lib/*')
            .pipe(gulp.dest('./build/public/lib'));
})

//转移img文件夹
gulp.task('moveimg', function() {
    gulp.src(['./public/images/*','./public/images/**/*'])
        .pipe(gulp.dest('./build/public/images/'));
});

// 替换HTML文件中的线下地址
gulp.task('replace', function() {
    gulp.src(['./html/*.html', './html/**/*.html', './html/**/**/*.html'])
        .pipe(replace(/(\.\.\/){0,4}public/g, 'http://cloudliving-img.b0.upaiyun.com/static/Home/Community'))
        .pipe(build({
            'css':'http://cloudliving-img.b0.upaiyun.com/static/Home/Community/css/community.min.css'
        }))
        .pipe(gulp.dest('./build/html/'));
});






gulp.task('default',['concatCss','moveJs','moveimg','replace','movelib', 'moveFont']);