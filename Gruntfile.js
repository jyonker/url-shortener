'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        //TODO: move these files to an app dir and use 'app/**/*.js' or similar
        src: ['index.js', 'index.spec.js']
      }
    }
  });

  grunt.registerTask('test', ['mochaTest']);
};