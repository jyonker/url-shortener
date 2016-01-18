/* Copyright 2016 Jonathan Yonker

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

(function() {
  var fieldToId = {
    shortUrl: 'short-url',
    longUrl: 'long-url'
  };

  function addError(field, reason) {
    $('.form-group.' + field).addClass('has-error');

    if (reason) {
      $('.' + field + ' .error-help').html(reason);
    }
  }

  function removeError(field) {
    $('.form-group.' + field).removeClass('has-error');
  }

  function forEachFieldId(fn) {
    Object.keys(fieldToId).forEach(function (key) {
      fn(fieldToId[key]);
    });
  }

  function clearUserFeedback() {
    forEachFieldId(removeError);

    $('.created-url-container').empty();
    $('.clipboard-button').hide();
  }

  $(document).ready(function () {
    var clipboard = new Clipboard('.clipboard-button');
    clearUserFeedback();

    $('.input-group-addon.page-location').append(location.href);

    $('#shortenURLButton').on('click', function () {
      var longUrlValue = $('#longURLInput').val();
      var shortUrlValue = $('#shortURLInput').val();
      var httpVerb = !!shortUrlValue ? 'PUT' : 'POST';

      clearUserFeedback();

      $.ajax({
        type: httpVerb,
        url: '/api/v1/url/' + shortUrlValue,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          longUrl: longUrlValue,
          shortUrl: shortUrlValue
        })
      })
        .done(function (response) {
          var shortUrl = location.href + response.shortUrl;
          var longUrl = response.longUrl;
          $('.created-url-container').append('Success! Link created: </br> <a class="generated-link" href="' + shortUrl + '">' + shortUrl + '</a>');
          $('.clipboard-button').show();
        })
        .fail(function (response) {
          var responseJSON = response.responseJSON;
          if (responseJSON && responseJSON.error && responseJSON.error.field) {
            var fieldInError = fieldToId[responseJSON.error.field];

            addError(fieldInError, responseJSON.error.reason);
          } else {
            forEachFieldId(addError);
          }
        });
    });

  });
})();