function parseJwt (token) {     // Esta función se usa para decodificar el payload del token recibido
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function register(){    // Esta función la llama el botón de registro
    // Redirección a la página de registro oficial
    location.href = "http://sign.dalher.net/process/?f=register";
}

function login(){       // Esta función la llama el botón de inicio de sesión

    // Esconder avisos
    $("#warning").hide();
    // Mostrar spinner
    $("#spinner").show();
    // Esconder botones de inicio de sesión y registro
    $("#login").hide();
    $("#register").hide();
    // Vaciamos el contenedor de avisos
    $( "#warning" ).empty();
    
    // Obtener el usuario introducido
    var userSend = document.getElementById("userSend").value;

    // Comprobación del usuario, si no existe o está vacío ...
    if(userSend == '' || !userSend){
        // Crear elemento para un aviso
        var warning = document.createElement("p");
        // Contenido del aviso
        var node = document.createTextNode("You must send a user! Try again, please.");
        // Meter contenido en el aviso
        warning.appendChild(node);

        // Coger contenedor de avisos
        var element = document.getElementById("warning");
        // Meter el nuevo aviso
        element.appendChild(warning);

        // Esconder spinner
        $("#spinner").hide();
        // Mostrar botones de inicio de sesión y registro
        $("#login").show();
        $("#register").show();
        // Mostrar aviso
        $("#warning").show();
    }

    // Obtener la contraseña introducida
    var passSend = document.getElementById("passSend").value;

    // Comprobación de la contraseña, si no existe o no está vacía ...
    if(passSend == '' || !passSend){
        // Crear elemento para un aviso
        var warning = document.createElement("p");
        // Contenido del aviso
        var node = document.createTextNode("You must send a password! Try again, please.");
        // Meter contenido en el aviso
        warning.appendChild(node);

        // Coger contenedor de avisos
        var element = document.getElementById("warning");
        // Meter el nuevo aviso
        element.appendChild(warning);

        // Esconder spinner
        $("#spinner").hide();
        // Mostrar los botones de inicio de sesión y registro
        $("#login").show();
        $("#register").show();
        // Mostrar aviso
        $("#warning").show();
    }

    // Disponemos de usuario y contraseña
    if(userSend != '' && passSend !=''){

        // Realizamos la petición de autorización
        var client_id = '8ea2ad8b-42b0-4551-8d34-2bb9128cbe7d';
        var client_secret = 'secret';

        $.ajax({
            url: URL_authorization,
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
                // Tenemos autorización, obtenemos información
                // Refresh Token
                sessionStorage.setItem('refresh_token', response.refresh_token);
                // Access Token
                sessionStorage.setItem('access_token', response.access_token);
                // Momento de expiración
                sessionStorage.setItem('expires_in', response.expires_in);

                // Decodificamos el token para obtener más información
                var payload = parseJwt(sessionStorage.access_token);

                // Tiempo hasta que expire
                sessionStorage.setItem('exp', payload.exp);
                // Sandbox
                sessionStorage.setItem('sandbox', payload.data.sandbox);
                // Usuario autorizado
                sessionStorage.setItem('user_id', payload.data.user_id);
                // Permisos
                sessionStorage.setItem('scope', payload.data.scope);

                // REVISAR ESTO
                sessionStorage.setItem('user', userSend);
                sessionStorage.setItem('pass', passSend);

                // Redirección a la página principal
                location.href = "index.html";
            },
            error: function (response){
                // No tenemos autorización, campos erróneos
                // Crear elemento para aviso
                var warning = document.createElement("p");
                // Crear contenido de aviso
                var node = document.createTextNode("You must send a valid user and password! Try again, please.");
                // Meter contenido en aviso
                warning.appendChild(node);

                // Coger contenedor de avisos
                var element = document.getElementById("warning");
                // Meter el nuevo aviso
                element.appendChild(warning);

                // Esconder spinner
                $("#spinner").hide();
                // Mostrar botones de inicio de sesión y registro
                $("#login").show();
                $("#register").show();
                // Mostrar aviso
                $("#warning").show();
            }

        });
        
    }

}

$(function () {

    let oauthConfig = {

        auth_uri: "http://accounts.dalher.net/oauth/authorize",
        client_id: "12",
        redirect_uri: "http://adaptative.dalher.net/gimme.html",
        scope: "broker_r broker_w broker_d"
    
    };

    var oauth = new oauthClient(oauthConfig);


    $("#login").on( 'click', function(){

        oauth.getAuthorization();

    });


});