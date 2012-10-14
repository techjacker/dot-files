/*global module:false*/

module.exports = function(grunt) {

	var SRC_DIR = 'src/';
	var SRC_CSS = SRC_DIR + 'css/';
	var SRC_JS  = SRC_DIR + 'js/';
	var SRC_IMG = SRC_DIR + 'images/';

	var BUILD_DIR = 'public/';
	var BUILD_CSS = BUILD_DIR + 'css/';
	var BUILD_JS  = BUILD_DIR + 'js/';

	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-imagine');

	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner:
				'/*!\n' +
				' * <%= pkg.name %> v<%= pkg.version %>\n' +
				' * <%= pkg.repository %>\n' +
				' *\n' +
				' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author %>\n' +
				' * Released under a <%= pkg.license %> license\n' +
				' *\n' +
				' * Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' */'
		},
		qunit: {
			// files: ['test/**/*.html']
			all: ['src/test/qunit/index.html']
		},
		jpgmin: {
			src: [SRC_IMG + '*.jpg', SRC_IMG + '*.jpeg'],
			dest: BUILD_DIR
		},
		pngmin: {
			src: [SRC_IMG + '*.png'],
			dest: BUILD_DIR
		},
		gifmin: {
			src: [SRC_IMG + '*.gif'],
			dest: BUILD_DIR
		},

		concat: {
			css: {
				src: [ '<banner:meta.banner>', SRC_CSS + '**/*.css', '!' + SRC_CSS + '**/not-added-yet/**'],
				dest: BUILD_CSS + 'all.css'
			},
			jsclient: {
				src: [ '<banner:meta.banner>', BUILD_JS + 'app.client.js'],
				dest: BUILD_JS + 'app.client.js'
			},
			jsserver: {
				src: [ '<banner:meta.banner>', BUILD_JS + 'app.server.js'],
				dest: BUILD_JS + 'app.server.js'
			}
		},
		cssmin: {
			css: {
				src: '<config:concat.css.dest>',
				dest: BUILD_CSS + 'all-min.css'
			}
		},
		lint: {
			files: ['src/js/**/*.js', '!src/js/**/vendor/**', '!src/js/**/00-example-rjs-config/**', '!src/js/**/flickr.carousel.view.js', '!src/js/require.js' ]
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				nomen: false,
				curly: true,
				plusplus: false,
				expr: true,
				unused:false,
				undef: true,
				newcap: true,
				latedef: true,
				camelcase: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {}
	});

	grunt.registerTask('andyrjs', 'Run the require.js optimiser', function() {

		var myTerminal = require("child_process").exec,
			rjs = require("requirejs"),
			commandToBeExecuted = "mkdir -p public/js/vendor/requirejs/ && ";

		commandToBeExecuted += "cd src/js && node app.build.js && ";
		commandToBeExecuted += "cp vendor/requirejs/require.js ../../public/js/vendor/requirejs/";

    	myTerminal(commandToBeExecuted, function(error, stdout, stderr) {
		    if (!error) {
		         console.log(error);
		    }
		    console.log('stdout', stdout);
		    console.log('stdoutstderr', stderr);
		});
	});


	// Default task.
	// concat must be run after rjs in order to add licence comments to js files
	// cssmin must be run after concat
	grunt.registerTask('default', 'qunit lint andyrjs jpgmin gifmin pngmin concat cssmin');
};