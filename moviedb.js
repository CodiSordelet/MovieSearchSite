
/*onload functions*/
$(document).ready(function() {
    showPopularMovies();
});

var searchTerm;
var searchUrl;
var searchPageNumber;
var pageArray = [1, 2, 3, 4, 5];
var userId = "zdowning1@gmailcom";

function userSearch() {
    var method = document.getElementById("searchMethod").value;  
    searchTerm = document.getElementById("search-bar").value;
    if(method=="Actor Name")
        {
            searchUrl = "https://api.themoviedb.org/3/search/person?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
            masterResults("1", "person");
            setPagination(1);
        }
    else if(method=="Movie Title")
        {
            searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
            masterResults("1", "movies");
            setPagination(1);
        }
    else if(method=="TV Show Title")
        {
            searchUrl = "https://api.themoviedb.org/3/search/tv?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
            masterResults("1", "popularTV");
            setPagination(1);
        }    
}

function masterResults(page, decision){
    searchPageNumber = page;
    searchMethod = decision;
    id = "#" + decision;
    page = "&page=" + page;
    url = searchUrl + searchTerm + page;
    targetTemplate = "#template-" + decision;
    getResults(url,id,targetTemplate);
    displayChange(decision);
}

function displayChange(decision){
    if(decision=="movies"){
        document.getElementById("template-favorites").style.display = "none";
        document.getElementById("template-person").style.display = "none";
        document.getElementById("template-popularTV").style.display = "none";
        document.getElementById("template-movies").style.display = "block";
    }
    else if(decision=="person"){
        document.getElementById("template-popularTV").style.display = "none";
        document.getElementById("template-movies").style.display = "none";
        document.getElementById("template-favorites").style.display = "none";
        document.getElementById("template-person").style.display = "block";
    }
    else if(decision=="popularTV"){
        document.getElementById("template-person").style.display = "none";
        document.getElementById("template-movies").style.display = "none";
        document.getElementById("template-favorites").style.display = "none";
        document.getElementById("template-popularTV").style.display = "block";
    }
    else if(decision=="favorites"){
        document.getElementById("template-person").style.display = "none";
        document.getElementById("template-popularTV").style.display = "none";
        document.getElementById("template-movies").style.display = "none";
        document.getElementById("template-favorites").style.display = "block";
    }
}

function getFavorites(){
    displayChange("favorites");
    var dataRef = firebase.database().ref('users/' + userId + '/favorites/');
    var array;
    var textJSON = '{"favorites":[';
    
    dataRef.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var resultId = childSnapshot.val().id;
        var resultImg = childSnapshot.val().img;
        var resultTitle = childSnapshot.val().title;
        
        textJSON += '{"title":"' + resultTitle + '" , "img":"' + resultImg + '" , "id":"' + resultId + '"},';

        });
        textJSON = textJSON.substring(0, textJSON.length - 1);
        textJSON += ']}'
        var JSONobject = JSON.parse(textJSON);
        var template = $("#favorites").html();
        var html = Mustache.render(template, JSONobject);
        $("#template-favorites").html(html);
    });  
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
    setPagination(1);
    masterResults("1", "movies");
}

function showPopularPerson(){
    searchUrl = "https://api.themoviedb.org/3/person/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US";
    searchTerm = "";
    setPagination(1);
    masterResults("1", "person");

}

function showPopularTV(){
    searchUrl = "https://api.themoviedb.org/3/tv/popular?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&page=1",
    searchTerm = "";
    setPagination(1);
    masterResults("1", "popularTV");
}

function pageTabClick(number){
    searchPageNumber = String(number);
    masterResults(number, searchMethod);
    setPagination(number);
}

function nextPage(){
    var temp = parseInt(searchPageNumber);
    temp += 1;
    if(temp < 1){
        searchPageNumber = 1;
    }
    else if(temp > 5){
        searchPageNumber = 5;
    }
    else{
        setPagination(temp);
        searchPageNumber = String(temp);
        masterResults(searchPageNumber, searchMethod);
    }
}

function previousPage(){
    var temp = parseInt(searchPageNumber);
    temp = temp - 1;
    if(temp < 1){
        searchPageNumber = 1;
    }
    else if(temp > 5){
        searchPageNumber = 5;
    }
    else{
        setPagination(temp);
        searchPageNumber = String(temp);
        masterResults(searchPageNumber, searchMethod);
    }
}


function toggleFavorite(id, title, img){
    var temp = "favorite" + id;
    var element = document.getElementById(temp);
    if(element.className=="favoriteButtonN"){
        element.style.color = "red";
        element.classList.add("favoriteButtonY");
        element.classList.remove("favoriteButtonN");
        writeUserData(userId, id, title, img);
    }
    else if(element.className=="favoriteButtonY"){
        element.style.color = "#0d1c24";
        element.classList.add("favoriteButtonN");
        element.classList.remove("favoriteButtonY");
        removeUserData(userId, id);
    } 
}

function removeUserData(userId, id) {
    firebase.database().ref('users/' + userId + '/favorites/' + id).remove();
}

function writeUserData(userId, id, title, img) {
    var text = '{"title":"' + title + '" , "img":"' + img + '" , "id":"' + id + '"}';
    var object = JSON.parse(text);
    firebase.database().ref('users/' + userId + '/favorites/' + id).set(object);
}

function castMemberDetails(name){
    $( ".modalClose" ).click();
    searchTerm = name;
    searchUrl = "https://api.themoviedb.org/3/search/person?api_key=f0db803d9d2c162e59c5e507925d8caa&language=en-US&query=";
    masterResults("1", "person");
}

function smallGrid(){
    $('.col-xs-6').removeClass('col-lg-3').addClass('col-lg-2'); 
}

function largeGrid(){
    $('.col-xs-6').removeClass('col-lg-2').addClass('col-lg-3');
}

function setPagination(page){
    console.log("in");
    var temp;
    for(var i=0;i<pageArray.length;i++){
        if(pageArray[i]==page){
            temp = "pagination"+pageArray[i];
            document.getElementById(temp).style.color = "#f8f9fa";
            document.getElementById(temp).style.backgroundColor = "#0d1c24";
        }
        else{
            temp = "pagination"+pageArray[i];
            document.getElementById(temp).style.color = "#0d1c24";
            document.getElementById(temp).style.backgroundColor = "#f8f9fa";
        }
        console.log(temp);
    }
}