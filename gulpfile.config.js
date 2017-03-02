'use strict';
var GulpConfig = {
        root: '.',
        source: './src',
        config: './config',
        dist: './dist',
        test: './test',
        allJavaScript: [this.dist + '/**/*.js'],
        allTypeScript: [this.source + '/**/*.ts'],
        allTypeScriptNoSpecs: [this.source + '/**/*.ts', '!' + this.source + '/**/*.spec.ts']
};
    
module.exports = GulpConfig;