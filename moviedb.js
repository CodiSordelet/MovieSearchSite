
/*onload functions*/
$(document).ready(function() {
    showPopularMovies();
});

var searchTerm;
var searchUrl;
var searchPageNumber;

function userSearch() {
    var method = document.getElementById("searchMethod").value;  
    searchTerm = document.getElementById("search-bar").value;
    if(method=="Actor Name")
        {
            searchUrl = "https://api.themoviedb.org/3/search/person?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
            masterResults("1", "person");
        }
    else if(method=="Movie Title")
        {
            searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
            masterResults("1", "movies");
        }
    else if(method=="TV Show Title")
        {
            searchUrl = "https://api.themoviedb.org/3/search/tv?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
            masterResults("1", "popularTV");
        }    
}

function masterResults(page, decision){
    searchPageNumber = page;
    searchMethod = decision;
    id = "#" + decision;
    page = "&page=" + page;
    url = searchUrl + searchTerm + page;
    targetTemplate = "#template-" + decision;
    console.log(url,id,targetTemplate);
    getResults(url,id,targetTemplate);
    displayChange(decision);
}

function displayChange(decision){
    if(decision=="movies"){
    document.getElementById("template-person").style.display = "none";
    document.getElementById("template-popularTV").style.display = "none";
    document.getElementById("template-movies").style.display = "block";
    }
    else if(decision=="person"){
    document.getElementById("template-person").style.display = "block";
    document.getElementById("template-popularTV").style.display = "none";
    document.getElementById("template-movies").style.display = "none";
    }
    else if(decision=="popularTV"){
    document.getElementById("template-person").style.display = "none";
    document.getElementById("template-popularTV").style.display = "block";
    document.getElementById("template-movies").style.display = "none";
    }
}

function getMovieDetails(id){
    var url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US";
    var target = "#movieModal" + id;
    getResults(url, "#movieDetails",target);
    var url = "http://api.themoviedb.org/3/movie/" + id + "/credits?api_key=f0db803d9d2c162e59c5e507925d8caa";
    var target = "#movieModalCast" + id;
    getResults(url, "#castTemplate",target);
}

function getPersonDetails(id){
    var url = "https://api.themoviedb.org/3/person/" + id + "?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US";
    var target = "#personModal" + id;
    getResults(url, "#personDetails",target);
}

function getTvDetails(id){
    var url = "https://api.themoviedb.org/3/tv/" + id + "?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US";
    var target = "#tvModal" + id;
    getResults(url, "#tvDetails",target);
    var url = "http://api.themoviedb.org/3/tv/" + id + "/credits?api_key=f0db803d9d2c162e59c5e507925d8caa";
    var target = "#tvModalCast" + id;
    getResults(url, "#castTemplate",target);
}

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

function showPopularMovies(){
    searchUrl = "https://api.themoviedb.org/3/movie/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US"
    searchTerm = "";
    masterResults("1", "movies");
}

function showPopularPerson(){
    searchUrl = "https://api.themoviedb.org/3/person/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US";
    searchTerm = "";
    masterResults("1", "person");

}

function showPopularTV(){
    searchUrl = "https://api.themoviedb.org/3/tv/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&page=1",
    searchTerm = "";
    masterResults("1", "popularTV");
}

function pageTabClick(number){
    searchPageNumber = String(number);
    masterResults(number, searchMethod);
}

function nextPage(){
    var temp = parseInt(searchPageNumber);
    temp += 1;
    if(temp < 1){
        searchPageNumber = "1";
        console.log("less, now " + searchPageNumber);
    }
    else if(temp > 3){
        searchPageNumber = "3";
        console.log("more, now " + searchPageNumber);
    }
    else{
        searchPageNumber = String(temp);
        masterResults(searchPageNumber, searchMethod);
        console.log(searchPageNumber);
    }
}

function previousPage(){
    var temp = parseInt(searchPageNumber);
    temp = temp - 1;
    if(temp < 1){
        searchPageNumber = 1;
        console.log("less, now " + searchPageNumber);
    }
    else if(temp > 3){
        searchPageNumber = 3;
        console.log("more, now " + searchPageNumber);
    }
    else{
        searchPageNumber = String(temp);
        masterResults(searchPageNumber, searchMethod);
        console.log(searchPageNumber);
    }
}

function toggleFavorite(id){
    var temp = "favorite"+id;
    var element = document.getElementById(temp);
    if(element.className=="favoriteButtonN"){
        element.style.color = "red";
        element.classList.add("favoriteButtonY");
        element.classList.remove("favoriteButtonN");

    }
    else if(element.className=="favoriteButtonY"){
        element.style.color = "#0d1c24";
        element.classList.add("favoriteButtonN");
        element.classList.remove("favoriteButtonY");
    }
}

function castMemberDetails(name){
    $( ".modalClose" ).click();
    searchTerm = name;
    searchUrl = "https://api.themoviedb.org/3/search/person?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
    masterResults("1", "person");
}

