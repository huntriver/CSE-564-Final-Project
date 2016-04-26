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
            },
            dev: {
                options: {
                    script: 'app.js'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            express: {
                files: ['app.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },

            frontend: {
                files: ["app/styles/*.css", "app/scripts/*.js", "app/scripts/**/*.js"]
            }
        }


    });


    grunt.registerTask('dev', [
        'wiredep',
        'includeSource',
        'express:dev',
        'watch'
    ]);
}