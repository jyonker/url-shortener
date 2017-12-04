'use strict';

//using multiline comments so scss preserves them in the css
var copyrightBanner =
`/*!
@license
Copyright 2016 Jonathan Yonker

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`;

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
      failBuildOnGitDiff: {
        command: 'git status --porcelain',
        options: {
          stdout: false,
          stderr: false,
          stdin: false,
          callback: function (err, stdout, stderr, cb) {
            var changesDetected = !!stdout.length;
            if (changesDetected) {
              grunt.warn('Git changes detected. Did you forget to build and commit dist?');
            } else {
              cb();
            }
          }
        }
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
    },
    sass: {
      dist: {
        src: 'public/styles/*.scss',
        dest: 'public/generated/compiled.css'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      }
    },
    usebanner: {
      copyright: {
        options: {
          position: 'top',
          banner: copyrightBanner,
          replace: true
        },
        files: {
          src: [
            'public/scripts/**/*.js',
            'public/styles/**/*.scss',
            'routes/**/*.js',
            'services/**/!(url-validation-regex).js',
            'app.js',
            'integration.spec.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('ci', ['build', 'shell:failBuildOnGitDiff', 'mochaTest']);

  grunt.registerTask('build', ['clean', 'usebanner', 'copy:index', 'useminPrepare', 'sass', 'concat', 'cssmin', 'uglify', 'filerev', 'usemin']);
};