var lessSourceFiles = '../../static/less/*.less'
var cssOutPath = '../../static/css'

var countryTemplate = {
    base: '../../templates',
    outPath: '../../share',
    flagsDir: '../../flags'
}

var sprites = {
    chunksPath: '../../static/img/sprites/**/*.png',
    chunksRetinaPath: '../../static/img/sprites/**/*2x.png',
    cssBuiltPath: '../../static/less/parts/sprites.less',
    imgBuiltPath: '../../static/img/sprites', // eg: sprites.png && sprites-2x.png
    imgBuiltCssPath: '../img/sprites' // eg: sprites.png && sprites-2x.png
}

var jsBuildConfigFile = '../../static/js/app/build-config.js'

var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less-sourcemap');
var path = require('path');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
//var imagemin = require('gulp-imagemin');
//var pngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');
var twig = require('gulp-twig');

var Twig = require('twig'), // Twig module
    twigSa = Twig.twig;

var fs = require('fs')

//var spritesmith = require('gulp.spritesmith')

lessSourceFiles = path.resolve(lessSourceFiles)

gulp.task('less', function () {
    var cssDestination = cssOutPath

    return gulp
        .src(lessSourceFiles)
        .pipe(
        less({
            ieCompat: true,
            sourceMap: {
                sourceMapRootpath: '../less'
            }
        })
    )
        .on('error', function (error) {
            gutil.log(gutil.colors.red(error.message))
            notifier.notify({title: 'Less compilation error', message: error.message})
            this.emit('end');
        })
        .pipe(gulp.dest(path.join(cssDestination)))
});

gulp.task('autoprefixer', function () {
    return gulp.src(path.join(cssOutPath, '*.css'))
        .pipe(sourcemaps.init())
        .pipe(
        postcss([
            autoprefixer({browsers: ['last 2 version', '> 1%', 'ie >= 8', 'Firefox > 15', 'iOS >= 5', 'Android >= 2.3']})
        ])
            .on('error', function (error) {
                notifier.notify({title: 'Autoprefixer compilation error', message: error.message.replace(/"+/, "'")})
                gutil.log(gutil.colors.red(error.message))
                this.emit('end');
            })
    )
        .pipe(sourcemaps.write('.'))

        .pipe(gulp.dest(cssOutPath));
});

gulp.task('sprites', function() {
    var replaceDotRegexp = new RegExp('@+')

    var imgName = path.basename(sprites.imgBuiltPath, '.png') + '.png',
        retinaImgName = path.basename(sprites.imgBuiltPath, '.png') + '-2x.png'

    var spriteData =
        gulp.src(sprites.chunksPath)
            .pipe(spritesmith({
                retinaSpriteSizeIgnore: true,
                retinaSrcFilter: sprites.chunksRetinaPath,
                padding: 4,
                imgPath: sprites.imgBuiltCssPath + '.png',
                retinaImgPath: sprites.imgBuiltCssPath + '-2x.png',
                cssName: path.basename(sprites.cssBuiltPath),
                imgName: imgName,
                algorithmOpts: {algorithmOpts: {sort: false}},
                retinaImgName: retinaImgName,
                cssVarMap: function (sprite) {
                    sprite.name = sprite.name.replace(replaceDotRegexp, '-');
                }
            }))

    spriteData.css.pipe(gulp.dest(path.dirname(sprites.cssBuiltPath)))

    spriteData.img
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.dirname(sprites.imgBuiltPath)))

    return spriteData
});

gulp.task('sprites-optimizer', function () {
    return gulp.src(path.join(path.dirname(sprites.imgBuiltPath), '*.png'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.dirname(sprites.imgBuiltPath)));
});

gulp.task('rjs', function (callback) {
    var requirejs = require('requirejs');

    try {
        var buildConfig = eval(
            String(fs.readFileSync(jsBuildConfigFile))
        )
    }
    catch (e) {
        console.info('Read build config error.', jsBuildConfigFile)
        console.error(e)
    }

    if (!(buildConfig instanceof Object)) {
        throw new Error('Build config is not object. ' + jsBuildConfigFile)
    }

    buildConfig.baseUrl = path.resolve(path.dirname(jsBuildConfigFile), buildConfig.baseUrl || '.')

    if (buildConfig.mainConfigFile) {
        buildConfig.mainConfigFile = path.resolve(buildConfig.baseUrl, buildConfig.mainConfigFile)
    }

    if (buildConfig.out) {
        buildConfig.out = path.resolve(buildConfig.baseUrl, buildConfig.out)
    }
    else {
        buildConfig.out = path.join(buildConfig.baseUrl, path.basename(buildConfig.name, '.js'))
    }

    //    buildConfig.out = 'stdout'

    requirejs.optimize(buildConfig, function() {
        callback()
    }, callback)
})

gulp.task('begin-watching', function () {
    watch(path.join(path.dirname(lessSourceFiles), '**', '*.less'), function (file) {
        runSequence(
            'less',
            'autoprefixer'
        )
    })

    watch(path.join(path.dirname(countryTemplate.sourcePath), '**', '*.twig'), function (file) {
        runSequence('twig')
    })
})

gulp.task('shares', function (callback) {
    var template = twigSa({
        data: fs.readFileSync(path.join(countryTemplate.base, 'country-share.twig')).toString()
    });

    var countries = {}

    fs.readdirSync(countryTemplate.flagsDir).forEach(function (file) {
        var country = path.basename(file, '.jpg').replace(/_+/g, ' ')
        countries[country] = file
    })

    Object.keys(countries).forEach(function (country) {
        var countryImage = countries[country]

        var niceName = countries[share]


        var html = template.render({
            siteUrl: '/',
            sharePart: niceName
        })

        var filename = country.toLowerCase().replace(/\s+/g, '-')

        fs.writeFileSync(path.join(countryTemplate.outPath, filename + '.html'), html)
    })

    callback()
});

gulp.task('watch', function (callback) {
    runSequence(
        'shares'
    )

    /*
     runSequence(
     //['twig'],
     //'less',
     //'autoprefixer',
     //'begin-watching',
     callback
     )*/
});

gulp.task('default', ['watch']);