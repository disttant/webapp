function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function register(){
    location.href = "http://sign.dalher.net/process/?f=register";
}

function login(){

    $("#warning").hide();
    $("#spinner").show();
    $("#login").hide();
    $("#register").hide();
    $( "#warning" ).empty();
    
    var userSend = document.getElementById("userSend").value;

    if(userSend == '' || !userSend){
        var warning = document.createElement("p");
        var node = document.createTextNode("You must send a user! Try again, please.");

        warning.appendChild(node);

        var element = document.getElementById("warning");
        element.appendChild(warning);
        $("#spinner").hide();
        $("#login").show();
        $("#register").show();
        $("#warning").show();
    }

    var passSend = document.getElementById("passSend").value;

    if(passSend == '' || !passSend){
        var warning = document.createElement("p");
        var node = document.createTextNode("You must send a password! Try again, please.");

        warning.appendChild(node);

        var element = document.getElementById("warning");
        element.appendChild(warning);
        $("#spinner").hide();
        $("#login").show();
        $("#register").show();
        $("#warning").show();
    }

    if(userSend != '' && passSend !=''){

        var client_id = '8ea2ad8b-42b0-4551-8d34-2bb9128cbe7d';
        var client_secret = 'secret';

        $.ajax({
            url: 'http://oauth.dalher.net/v1/token?flow=password',
            type: 'post',
            headers: {
                "Authorization": "Basic "+ btoa(client_id + ":" + client_secret),
                "Content-Type": "application/json",
            },
            data: "{\"grant_type\":\"password\",\"redirect_uri\":\"http://dalher.net\",\"username\":\""+ userSend +"\",\"password\":\""+ passSend +"\",\"scope\":\"broker_w broker_r broker_d\"}",
            beforeSend: function(){
                console.log("Enviando petición de Autenticación...");
            },
            success: function(response){
                sessionStorage.setItem('refresh_token', response.refresh_token);
                sessionStorage.setItem('access_token', response.access_token);
                sessionStorage.setItem('expires_in', response.expires_in);

                var payload = parseJwt(sessionStorage.access_token);

                sessionStorage.setItem('exp', payload.exp);
                sessionStorage.setItem('sandbox', payload.data.sandbox);
                sessionStorage.setItem('user_id', payload.data.user_id);
                sessionStorage.setItem('scope', payload.data.scope);

                sessionStorage.setItem('user', userSend);
                sessionStorage.setItem('pass', passSend);

                location.href = "index.html";
            },
            error: function (response){
                var warning = document.createElement("p");
                var node = document.createTextNode("You must send a valid user and password! Try again, please.");

                warning.appendChild(node);

                var element = document.getElementById("warning");
                element.appendChild(warning);
                $("#spinner").hide();
                $("#login").show();
                $("#register").show();
                $("#warning").show();
            }

        });
        
    }

}

$(function () {
    $("#warning").hide();
    $("#spinner").hide();
    $("#login").show();
    $("#register").show();
});