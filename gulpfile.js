var gulp = require("gulp");
var concat = require("gulp-concat");
var csso = require("gulp-csso");
var replace = require("gulp-replace");
var build = require("gulp-html-replace");
var time = new Date().valueOf();
var sftp = require('gulp-sftp');
var uglify = require('gulp-uglify');

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
                // 更换正式接口
                .pipe(replace('vht.cloudliving.net/index.php?m=Community&c=Index', 'weixin.cloudliving.net/community_service.php?c=Index'))
                .pipe(uglify())
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
        // 更换正式接口
        .pipe(replace('vht.cloudliving.net/index.php?m=Community&c=Index', 'weixin.cloudliving.net/community_service.php?c=Index'))
        .pipe(replace(/src=".+\.js/g, function(a){return a+'?v='+time}))
        .pipe(build({
            'css':'http://cloudliving-img.b0.upaiyun.com/static/Home/Community/css/community.min.css?v='+time
        }))
        .pipe(gulp.dest('./build/html/'));
});


// 上传到测试服务器
gulp.task('uploadtest', ['uploadtest-html','uploadtest-public'])

gulp.task('uploadtest-html', function(){
    gulp.src('./html/**')
        .pipe(sftp({
            host: '120.27.161.102',
            port: 22,
            user: 'root',
            pass: 'Ruan0810',
            remotePath: '/cloudliving/dingzhiqiang/sq/html'
        }))
})
gulp.task('uploadtest-public', function(){
    gulp.src('./public/**')
        .pipe(sftp({
            host: '120.27.161.102',
            port: 22,
            user: 'root',
            pass: 'Ruan0810',
            remotePath: '/cloudliving/dingzhiqiang/sq/public'
        }))
})



// 上传到正式服务器
gulp.task('upload', function(){
    gulp.src(['build/html/*.html', 'build/html/**/*.html'])
        .pipe(sftp({
            host: '114.55.43.3',
            port: 22,
            user: 'root',
            pass: 'Cloud2016',
            remotePath: '/usr/local/nginx/html/source/community'
        }))
})




gulp.task('default',['concatCss','moveJs','moveimg','replace','movelib', 'moveFont']);