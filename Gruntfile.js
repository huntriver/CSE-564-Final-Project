module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt); //加载所有的任务

    grunt.initConfig({
        wiredep: {
            app: {
                src: ['app/index.html'],
                ignorePath: /^(\.\.\/)*\.\./
            }
        },

        includeSource: {
            options: {
                basePath: 'app',
                baseUrl: '/'
            },
            main: {
                files: {
                    'app/index.html': 'app/index.html'
                }
            }
        },
        express: {
            options: {
                // Override defaults here
                port:9000,
                livereload: true
            },
            dev: {
                options: {
                    script: 'app.js',
                    base: [
                        'app'  //主目录
                    ],
                }
            }
        },
        open: {
          dev: {
            // Gets the port from the connect configuration
            path: 'http://localhost:<%= express.options.port%>'
          }
        },


        connect: {
            options: {
                port: 9000,
                hostname: 'localhost', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: true  //声明给 watch 监听的端口
            },

            dev: {
                options: {

                    open: true, //自动打开网页 http://
                    base: [
                        'app'  //主目录
                    ],
                    middleware: function (connect) {
                        return [
                            connect().use(
                                '/bower_components',
                                require('serve-static')('./bower_components')
                            ),
                            connect().use(
                                '/app/styles',
                                require('serve-static')('./app/styles')
                            ),
                            require('serve-static')('app')
                        ];
                    }
                }
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['app/scripts/**/*.js','app/scripts/*.js'],
                tasks: ['includeSource']
            },
            html: {
                files: ['app/**/*.html','app/*.html']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            server:{
                files: ['app.js'],
                tasks:['express:dev']
            }
        },



    });


    grunt.registerTask('backend', [
        'express:dev',
        'open',
        'watch'
    ]);

    grunt.registerTask('frontend',[
        'wiredep',
        'includeSource',
        'connect:dev',
        'watch'

    ]);
}