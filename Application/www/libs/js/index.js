function checkLogin(){      // Esta función comprueba la sesión actual (REVISAR)
    // Comprobación del usuario
    if(sessionStorage.user == '' || !sessionStorage.user){
        location.href = "./login.html";
    }
    // Comprobación de la contraseña
    if(sessionStorage.pass == '' || !sessionStorage.pass){
        location.href = "./login.html";
    }
    // Comprobación del sandbox
    if(sessionStorage.sandbox == '' || !sessionStorage.sandbox){
        location.href = "./login.html";
    }
    // Comprobación del token
    if(sessionStorage.access_token == '' || !sessionStorage.access_token){
        location.href = "./login.html";
    }
}

function parseJwt (token) {     // Esta función se usa para decodificar el payload del token recibido
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function requestToken(){        // Esta función renueva el token actual

    // Obtener variables necesarias para la petición
    var rtoken = sessionStorage.refresh_token;
    var scope = sessionStorage.scope;
    var client_id = '8ea2ad8b-42b0-4551-8d34-2bb9128cbe7d';
    var client_secret = 'secret';

    // Petición renovación token
    $.ajax({

        url: URL_refreshToken,
        type: 'post',
        headers: {
            "Authorization": "Basic "+ btoa(client_id + ":" + client_secret),
            "Content-Type": "application/json"
        },
        data: "{\"grant_type\":\"refresh_token\",\"refresh_token\":\""+ rtoken +"\"}",
        beforeSend: function(){
            console.log("Enviando petición de nuevo TOKEN...");
        },
        success: function(response){
            // Guardar nuevos datos
            sessionStorage.access_token = response.access_token;
            //console.log(sessionStorage.access_token);
            var payload = parseJwt(sessionStorage.access_token);
            sessionStorage.exp = payload.exp;
        },
        error: function (response){
            // Redirección a la página de login
            location.href = "login.html";
            console.log("Error obteniendo nuevo TOKEN.");
            //console.log(response);
        }

    });

}

function checkToken () {        // Esta función comprueba la vida del token

    // Coger el momento actual
    var time = Math.round(Date.now()/1000);
    // Coger la cantidad de tiempo hasta que el token caduque
    var secondsTillDie = sessionStorage.exp - time;

    // Comprobar la cantidad de tiempo hasta caducidad
    if((secondsTillDie <= 60) && (secondsTillDie > 0)){
        // Si está cerca de caducar, refrescar token
        requestToken();
    }

    // Comprobar error en la cantidad de tiempo hasta caducidad
    if(secondsTillDie < 0){
        location.href = "./login.html";
    }

}

$(function () {	

    // Comprobar la sesión
    checkLogin();

    // Cargamos la página principal
    console.log("Documento cargado ...");
    //console.log(sessionStorage.access_token);
    $("#content").load("main.mod.html");

    // Comprobar la sesión periódicamente
    var checkLoginVar = setInterval(checkLogin, 1000);
    // Comprobar el token de manera periódica
    var checkTokenVar = setInterval(checkToken, 1000);

});