(function() {
  var fieldToId = {
    shortUrl: 'short-url',
    longUrl: 'long-url'
  };

  function addError(field) {
    $('.form-group.' + field).addClass('has-error');
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
    $("#shortenURLButton").on("click", function () {
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
          var shortUrl = 'https://simple-url-shortener.herokuapp.com/' + response.shortUrl;
          var longUrl = response.longUrl;
          $('.created-url-container').append('<p>Success! Your new URL points from: ' + longUrl + ' to: <a href="' + shortUrl + '">' + shortUrl + '</a>');
        })
        .fail(function (response) {
          var responseJSON = response.responseJSON;
          if (responseJSON && responseJSON.error && responseJSON.error.field) {
            var fieldInError = fieldToId[responseJSON.error.field];
            addError(fieldInError);
          } else {
            forEachFieldId(addError);
          }
        });
    });

  });
})();