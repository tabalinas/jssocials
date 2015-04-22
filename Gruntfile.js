"use strict";
module.exports = function(grunt) {
    // Load all grunt tasks
    require("load-grunt-tasks")(grunt);
    // Show elapsed time at the end
    require("time-grunt")(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON("package.json"),
        banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
        "<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
        "* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
        " Licensed MIT */\n",
        // Task configuration.
        clean: {
            files: ["dist"]
        },
        concat: {
            options: {
                banner: "<%= banner %>",
                stripBanners: true
            },
            dist: {
                src: ["src/<%= pkg.name %>.js", "src/<%= pkg.name %>.shares.js"],
                dest: "dist/<%= pkg.name %>.js"
            }
        },
        sass: {
            dist: {
                files:[{
                    expand: true,
                    cwd: "styles",
                    src: ["*.scss"],
                    dest: "dist",
                    ext: ".css"
                }]
            }
        },
        autoprefixer:{
            dist: {
                files: [{
                    expand: true,
                    src: "dist/*.css"
                }]
            }
        },
        uglify: {
            options: {
                banner: "<%= banner %>"
            },
            dist: {
                src: "<%= concat.dist.dest %>",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        },
        qunit: {
            files: ["test/<%= pkg.name %>.html"]
        },
        jshint: {
            options: {
                reporter: require("jshint-stylish")
            },
            gruntfile: {
                options: {
                    jshintrc: ".jshintrc"
                },
                src: "Gruntfile.js"
            },
            src: {
                options: {
                    jshintrc: "src/.jshintrc"
                },
                src: ["src/**/*.js"]
            },
            test: {
                options: {
                    jshintrc: "test/.jshintrc"
                },
                src: ["test/**/*.js"]
            }
        }
    });

    grunt.registerTask("default", ["jshint", "qunit", "clean", "sass", "autoprefixer", "concat", "uglify"]);
    grunt.registerTask("test", ["qunit"]);
};
