module.exports = function(grunt) {
	require('time-grunt')(grunt);
// 1. Вся настройка находится здесь
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	// concat: {
	// 	css: {
	// 		src: 'src/css/*.css',
	// 		dest: 'dist/css/style.css'
	// 	},
	// 	js: {
	// 		src: 'src/js/*.js',
	// 		dest: 'dist/js/common.js'
	// 	}
	// },
	cssmin: {
		target: {
			files: [{
				expand: true,
				cwd: 'src/css',
				src: ['*.css', '!*.min.css'],
				dest: 'dist/css',
				ext: '.min.css'
			}]
		}
	},
	uglify: {
		my_target: {
			files: {
				'dist/js/common.min.js': ['src/js/common.js']
			}
		}
	},
	watch: {
		css: {
			files: ['src/**/*.sass','src/**/*.scss'],
			tasks: ['sass','autoprefixer'],
			options: {
				spawn: false,
			}
		},
		jade: {
			files: ['src/**/*.jade'],
			tasks: ['jade'],
			options: {
				spawn: false,
			},
		}
		},
		imagemin: {
			options: {
				optimizationLevel: 3,
				progressive: true,
				interlaced: true,
				pngquant: true
			},
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/'
				}]
			}
		},
		sass: {
			dist: {
				options: {
				},
				files: {
					'src/css/style.css': 'src/sass/style.sass',
				}
			}
		},
		browserSync: {
			default_options: {
				bsFiles: {
					src: [
					"src/css/*.css",
					"src/*.html",
					"src/js/*.js"
					]
				},
				options: {
					browser: "Firefox",
					watchTask: true,
					notify: false,
					server: {
						baseDir: "src/"
					}
				} 
			}
		},
		copy: {
			main: {
				files: [
				{expand:true, cwd:'src',  src:"index.html", dest:"dist/" },
				{expand:true, cwd:'src',  src:"favicon.png", dest:"dist/" },
				{expand:true, cwd:'src',  src:"mail.php", dest:"dist/" },
				{expand:true, cwd:'src',  src:".htaccess", dest:"dist/" },
				{expand:true, cwd:'src',  src:"fonts/**", dest:"dist/" },
				{expand:true, cwd:'src', src:"lib/**", dest:"dist/" },
				{expand:true, cwd:'src', src:"css/**", dest:"dist/" },
				{expand:true, cwd:'src', src:"js/**", dest:"dist/" }
				]
			}
		},
		clean: {
			dist: {
				src: ["dist/"],
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9']
			},
			your_target: {
				src: ['src/css/*.css', 'src/css/*.css']
			},
		},
		cmq: {
			target: {
				files: [{
					expand: true,
					cwd: 'dist/css',
					src: '*.css',
					dest: 'dist/css',
				}]
			}
		},
		sprite:{
			all: {
				src: 'src/img/sprites/*.png',
				dest: 'src/img/spritesheet.png',
				destCss: 'src/sass/sprites.css',
				algorithm: 'top-down',
				padding: 1
			}
		},
		jade: {
			compile: {
				options: {
					data: {
						debug: false
					},
					pretty: true,
				},
				files: {
					"src/index.html": ["src/index.jade"]
				}
			}
		}
	});

// 3. Тут мы указываем Grunt, что хотим использовать этот плагин
require('load-grunt-tasks')(grunt);

// 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
grunt.registerTask('default', ['browserSync','watch']);
grunt.registerTask('dist', ['clean','uglify','cmq','autoprefixer','cssmin','imagemin','copy']);

};