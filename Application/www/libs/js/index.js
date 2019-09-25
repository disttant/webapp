function getUrlParameter(name, url) {
    
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        
};

function checkLogin(){
    if(sessionStorage.user == '' || !sessionStorage.user){
        location.href = "./login.html";
    }
    
    if(sessionStorage.pass == '' || !sessionStorage.pass){
        location.href = "./login.html";
    }

    if(sessionStorage.sandbox == '' || !sessionStorage.sandbox){
        location.href = "./login.html";
    }
    
    if(sessionStorage.access_token == '' || !sessionStorage.access_token){
        location.href = "./login.html";
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function requestToken(){

    var rtoken = sessionStorage.refresh_token;
    var scope = sessionStorage.scope;
    var client_id = '8ea2ad8b-42b0-4551-8d34-2bb9128cbe7d';
    var client_secret = 'secret';

    $.ajax({

        url: 'http://oauth.dalher.net/v2/token',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: "grant_type=refresh_token&refresh_token="+ rtoken +"&scope="+ scope,
        headers: {
            "Authorization": "Basic "+ btoa(client_id + ":" + client_secret)
        },
        beforeSend: function(){
            console.log("Enviando petición de nuevo TOKEN...");
        },
        success: function(response){
            sessionStorage.access_token = response.access_token;
            console.log(sessionStorage.access_token);
            var payload = parseJwt(sessionStorage.access_token);
            sessionStorage.exp = payload.exp;
        },
        error: function (){
            location.href = "login.html";
            console.log("Error obteniendo nuevo TOKEN.");
        }

    });

}

function checkToken () {

    var time = Math.round(Date.now()/1000);
    var secondsTillDie = sessionStorage.exp - time;

    if((secondsTillDie <= 60) && (secondsTillDie > 0)){
        requestToken();
    }

    if(secondsTillDie < 0){
        location.href = "./login.html";
    }

}

$(function () {	

    checkLogin();

    console.log("Documento cargado ...");
    console.log(sessionStorage.access_token);
    $("#content").load("main.mod.html");

    var checkLoginVar = setInterval(checkLogin, 1000);
    var checkTokenVar = setInterval(checkToken, 1000);

});
