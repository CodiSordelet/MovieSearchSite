function getSearchResultsFromMultipleModels(page) {
  var urlStart = "https://api.themoviedb.org/3/search/multi?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=",
  input = document.getElementById("search-bar").value,
  urlEnd1 = "&page=",
  urlEnd2 = page || 1,
  urlEnd3= "&include_adult=false;"
  var completeURL = urlStart + input +  urlEnd1 + urlEnd2.toString() + urlEnd3;
  $.getJSON(completeURL, function(data) {
     console.log(data);
     console.log("I was called!")
  });
}

$(document).ready(function() {

    //call this method to get results
    function getResults(url,templateSelector,targetTemplate) {
        $.getJSON(url, function(data) {
            var templateName = templateSelector;
            var templateInsert = $(templateName).html();
            Mustache.parse(templateInsert);
            var html = Mustache.render(templateInsert, data);
            $(targetTemplate).html(html);
        });
    }

    //
    //popular movies row
    var url1 = "https://api.themoviedb.org/3/movie/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&page=1"
     template1 = "#homepage-template",
     targetTemplate = "#template-target";
    getResults(url1,template1,targetTemplate);

    //popular tv shows row
    var url2 = "https://api.themoviedb.org/3/tv/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&page=1",
    template2 = "#popularTV";
    getResults(url2,template2,"#template-two");

    //popular actors row
    var url3 = "https://api.themoviedb.org/3/person/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&page=1",
    template3 = "#popularPeople";
    getResults(url3,template3,"#template-three");

    //getSearchResultsFromMultipleModels


});
