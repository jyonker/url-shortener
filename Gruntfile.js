'use strict';
var redis = require('redis');

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      integration: {
        options: {
          reporter: 'spec'
        },
        src: ['app.js', 'routes/**/*(!spec).js', 'services/**/*(!spec).js', 'integration.spec.js']
      },
      unit: {
        options: {
          reporter: 'spec'
        },
        src: ['app.js', 'routes/**/*.js', 'services/**/*.js']
      }
    },
    shell: {
      herokuLocal: {
        command: 'heroku local'
      },
      failBuildOnGitDiff: {
        command: 'git diff-index --quiet HEAD --'
      }
    },
    filerev: {
      js: {
        src: 'dist/**/*.js'
      },
      css :{
        src: 'dist/**/*.css'
      }
    },
    copy: {
      index: {
        src: 'public/index.html',
        dest: 'dist/index.html'
      }
    },
    useminPrepare: {
      html: 'public/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: 'dist/index.html',
      options: {
        assetsDirs: ['dist']
      }
    },
    clean: {
      dist: ['dist/**/*.*']
    }
  });

  grunt.registerTask('clearData', function() {
    var done = this.async();

    //TODO: grunt-services doesn't wait for redis to start completely, so 100ms delay
    //good opportunity to PR grunt-services to add better wait logic
    setTimeout(function () {
      var redisClient = redis.createClient(process.env.REDIS_URL);

      redisClient.on("ready", function () {
        redisClient.flushall(function () {
          done();
        });
      });
    }, 100);
  });

  //TODO: set a different server port for integration testing to allow testing while serving
  grunt.registerTask('integration', ['startRedis', 'clearData', 'force:mochaTest:integration', 'stopRedis']);
  grunt.registerTask('unit', ['mochaTest:unit']);

  grunt.registerTask('serve', ['startRedis', 'shell:herokuLocal', 'stopRedis']);

  grunt.registerTask('ci', ['build', 'failBuildOnGitDiff', 'clearData', 'mochaTest']);

  grunt.registerTask('build', ['clean', 'copy:index', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'filerev', 'usemin']);

};