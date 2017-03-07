var // Config = require('./gulpfile.config'),
    gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    // tsProject = tsc.createProject('tsconfig.json'),
    // tsProjectTest = tsc.createProject('tsconfig.json', { declaration: false }), // for testing
    mocha = require('gulp-mocha'),
    // jasmine = require('gulp-jasmine'),
    path = require('path'),
    rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    print = require('gulp-print'),
    tslint = require("gulp-tslint"),
    merge = require('merge2'),
    shell = require('gulp-shell'),
    sequence = require('gulp-sequence');
env = require('gulp-env');
config = require('./gulpfile.config');

var destDir = config.dist,
    rootDir = config.root,
    srcDir = config.source,
    cfgDir = config.config,
    srcFiles = srcDir + '/**/*',
    testDir = config.test,
    tsForDist = ['**/*.ts', '!**/*.spec.ts', '!./test-fixtures/**/*.ts'],
    tsForTest = ['**/*.ts'],
    jsForTest = ['**/*.spec.js'],
    cfgOnly = ['config/_app/*'],
    mopt = config.mochaOptions;

console.log("Gulp running on: " + JSON.stringify(config) + '\n');
console.log("rootDir: " + rootDir + "\n");
console.log("destDir: " + destDir + "\n");
console.log("testDir: " + testDir + "\n");
console.log("srcFiles: " + srcFiles + "\n");

gulp.task('list', function () {
    return gulp.src(srcFiles)
        //.pipe(filter(tsForDist))
        .pipe(print());
});

gulp.task('ts-lint', ['clean-ts-src'], function () {
    return gulp.src(srcFiles)
        .pipe(filter(tsForDist))
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report());
});

gulp.task('compile-ts', ['compile-ts-src', 'compile-ts-test']);
/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts-src', ['ts-lint'], function () {
    var tsProject = tsc.createProject('tsconfig.json', { declaration: false })
    var tsResult = gulp.src(srcFiles)
        .pipe(filter(tsForDist))
        .pipe(sourcemaps.init())
        .pipe(tsProject(tsc.reporter.defaultReporter()))
        .js.pipe(sourcemaps.write({
            includeContent: true,
            sourceRoot: function (file) {
                var sourceFile = path.join(file.cwd, file.sourceMap.file);
                return "../" + path.relative(path.dirname(sourceFile), __dirname);
            }
        }))
        .pipe(gulp.dest(destDir));
    /*   
       return merge(
               tsResult.dts,
   
               tsResult.js.pipe(sourcemaps.write('.', {
                   // Return relative source map root directories per file.
                   includeContent: false,
                   sourceRoot: function (file) {
                       var sourceFile = path.join(file.cwd, file.sourceMap.file);
                       return "../" + path.relative(path.dirname(sourceFile), __dirname);
                   }
               }))
   
               tsResult.js.pipe(sourcemaps.write())
               
       ).pipe(gulp.dest(destDir)); 
   */
});

/**
 * Compile TypeScript test files.
 */
gulp.task('compile-ts-test', ['clean-ts-test'], function () {
    var tsProjectTest = tsc.createProject('tsconfig.json', { declaration: false })
    return gulp.src(srcFiles)
        .pipe(filter(tsForTest))
        .pipe(tsProjectTest(tsc.reporter.defaultReporter()))
        .pipe(gulp.dest(testDir));
});

gulp.task('copy-files', function () {
    return gulp.src(cfgDir + '/**')
        .pipe(filter(cfgOnly))
        //.pipe(print())
        .pipe(gulp.dest(destDir + '/config'));
});

gulp.task('copy-files-test', function () {
    return gulp.src(cfgDir + '/**')
        .pipe(filter(cfgOnly))
        //.pipe(print())
        .pipe(gulp.dest(testDir + '/config'));
});

gulp.task('clean-ts', function (done) {
    sequence(['clean-ts-src', 'clean-ts-test'], done);
});

gulp.task('clean-ts-src', function () {
    var typeScriptGenFiles = [destDir + '/**/*'];
    // delete the files
    return del(typeScriptGenFiles);
});

gulp.task('clean-ts-test', function () {
    var typeScriptGenFiles = [testDir + '/**/*'];
    // delete the files
    return del(typeScriptGenFiles);
});

gulp.task('test', sequence('compile-ts-test', 'dotest'));

gulp.task('dotest', ['copy-files-test'], function () {
    const envs = env.set({
        NODE_ENV: 'test',
        throwOnExpectationFailure: 'true'
    });
    return gulp.src(testDir + '/**')
        .pipe(filter(jsForTest))
        .pipe(print())
        .pipe(mocha(mopt))
        .pipe(envs.reset);
});

gulp.task('pack', ['default'], shell.task([
    'npm pack'
])
);

gulp.task('build', sequence('compile-ts', 'copy-files'));

gulp.task('default', sequence('compile-ts', 'copy-files', 'test'));
