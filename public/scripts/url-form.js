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
  }

  $(document).ready(function () {
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
          $('.created-url-container').append('<p>Success! Your new URL points from: ' + longUrl + ' to: <a href="' + shortUrl + '">' + shortUrl + '</a>');
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