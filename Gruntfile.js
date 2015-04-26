module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// leave the .git folder to keep vcs using Github pages
		clean: {
			dist: {
				src: ['dist/*', '!dist/.git', '.tmp/']
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: './_site',
					src: ['*', '**/**', '!js/**', '!css/*', '!bower_components/**'],
					dest: 'dist/'
				}]
			}
		},
		useminPrepare: {
			html: ['./_site/index.html'],
			options: {
				dest: 'dist'
			}
		},

		usemin: {
			html: ['dist/**/*.html', '!./bower_components/**'],
			css: ['dist/css/**/*.css'],
			options: {
				dirs: ['dist']
			}
		},
		wiredep: {
			target: {
				src: [
					'./_includes/*.html'
				],
				exclude: [
					'modernizr',
					'jquery-placeholder',
					'jquery.cookie',
					'foundation'
				]
			}
		},
		shell: {
			startServer: {
				command: 'jekyll serve',
				options: {
					stderr: false,
					execOptions: {
						cwd: '.'
					}
				}
			},
			buildSite: {
				command: 'jekyll build',
				options: {
					stderr: false,
					execOptions: {
						cwd: '.'
					}
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-shell');
	// Default task(s).
	grunt.registerTask('default', ['shell:startServer']);
	grunt.registerTask('build', ['shell:buildSite']);
	grunt.registerTask('clear', ['clean']);
	grunt.registerTask('dist', ['clean:dist', 'useminPrepare', 'copy:dist', 'concat', 'cssmin', 'uglify', 'usemin']);
	grunt.registerTask('bower', ['wiredep', 'shell:buildSite']);

};
