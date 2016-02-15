/*
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
*/
!function(){function a(a,b){$(".form-group."+a).addClass("has-error"),b&&$("."+a+" .error-help").html(b)}function b(a){$(".form-group."+a).removeClass("has-error")}function c(a){Object.keys(e).forEach(function(b){a(e[b])})}function d(){c(b),$(".created-url-container").empty(),$(".clipboard-button").hide()}var e={shortUrl:"short-url",longUrl:"long-url"};$(document).ready(function(){new Clipboard(".clipboard-button");d(),$(".input-group-addon.page-location").append(location.href),$("#shortenURLButton").on("click",function(){var b=$("#longURLInput").val(),f=$("#shortURLInput").val(),g=f?"PUT":"POST";d(),$.ajax({type:g,url:"/api/v1/url/"+f,dataType:"json",contentType:"application/json",data:JSON.stringify({longUrl:b,shortUrl:f})}).done(function(a){var b=location.href+a.shortUrl;a.longUrl;$(".created-url-container").append('Success! Link created: </br> <a class="generated-link" href="'+b+'">'+b+"</a>"),$(".clipboard-button").show()}).fail(function(b){var d=b.responseJSON;if(d&&d.error&&d.error.field){var f=e[d.error.field];a(f,d.error.reason)}else c(a)})})})}();