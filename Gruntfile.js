module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }        
      }
    },
    express: {
      options: {
        port:1717
      },
      dev: {
        options: {
          script: 'app.js'
        }
      }
    },
    jslint: {
      server: {
        src: [
          'public/javascripts/*.js',
          'routes/**/*.js' 
        ]
      }
    },
    watch: {
      grunt: { files: ['Gruntfile.js'] },
      express: {
        files: ['routes/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['routes/*.js', 'public/javascripts/*.js'],
        tasks: ['jslint'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.registerTask('build', ['sass', 'express']);
  grunt.registerTask('test', ['jslint']);
  grunt.registerTask('default', ['build','watch']);
}
