'use strict';

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
    }
  });

  grunt.registerTask('integration', ['startRedis', 'mochaTest:integration', 'stopRedis']);
  grunt.registerTask('unit', ['mochaTest:unit']);

  grunt.registerTask('ci', ['unit', 'integration']);
};