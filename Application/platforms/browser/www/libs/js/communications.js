function sendMessage(message, reciever){

    var url = "https://broker.dalher.net/v4/channels/message/" + reciever;

    $.ajax({

        url: url,
        type: 'post',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        data: message,
        // beforeSend: function(){
        //     console.log("Enviando mensaje");
        // },
        success: function(response){
            console.log("Mensaje enviado");
            //console.log(response);
            setTimeout(function(){
                getResponse(reciever);
            }, 3000);
        },
        error: function (response){
            console.log("Error");
            console.log(response);
        }

    });

}

function getResponse(reciever){

    var url = "https://broker.dalher.net/v4/channels/messages/" + reciever + "/5";

    $.ajax({

        url: url,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        // beforeSend: function(){
        //     console.log("Pidiendo mensajes");
        // },
        success: function(response){
            //console.log("Mensajes obtenidos");
            console.log(response);
            
            var time = new Date();
            var now = time.getTime();

            for(i = 0 ; i < response.length ; i++){
                if((now - response[i].time * 1000) > 3000)
                    continue;

                var message = response[i].message.split(" ");

                if(typeof message[0] == undefined)
                    continue;
                if(typeof message[1] == undefined)
                    continue;

                if(message[1] == reciever){

                    if(message[0] == "info"){
                        console.log("Modelo: " + message[2]);
                        console.log("Número de entradas: " + message[3]);
                        console.log("Número de salidas: " + message[4]);
                        desc = message.slice(5);
                        console.log("Descripción: " + desc);
                    }
                    if(message[0] == "states"){
                        for(i = 2 ; i < message.length ; i+=2){
                            console.log("Pin: " + message[i] + "/// Estado: " + message[i + 1]);
                        }
                    }
                    if(message[0] == "rels"){
                        console.log("Relaciones:");
                        for(i = 2 ; i < message.length ; i++){
                            console.log(message[i]);
                        }
                    }
                    if(message[0] == "ok"){
                        console.log("Completado con éxtio");
                    }
                    if(message[0] == "error"){
                        console.log("Hubo un error: " + message[2]);
                    }

                }
                continue;

            }
        },
        error: function (response){
            console.log("Error");
            console.log(response);
        }

    });

}

$(function () {	

    $('#user').append(sessionStorage.user_id);

    $('#logout').on('click', function(){
        sessionStorage.removeItem("expires_in");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("scope");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("pass");
        sessionStorage.removeItem("exp");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("sandbox");
        sessionStorage.removeItem("user_id");
    });

    $('#subgroup').on('click', function(){  // [MAC] SUBGROUP [GRUPO]
        var message = "{\"message\" : \"b827eb02e726 subgroup cocina\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#ungroup').on('click', function(){   // [MAC] UNGROUP
        var message = "{\"message\" : \"b827eb02e726 ungroup\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#getinfo').on('click', function(){   // [MAC] GETINFO
        var message = "{\"message\" : \"b827eb02e726 getinfo\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#newdesc').on('click', function(){   // [MAC] NEWDESC
        var message = "{\"message\" : \"b827eb02e726 newdesc "+ Math.random() +"\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#getstate').on('click', function(){  // [MAC] GETSTATE
        var message = "{\"message\" : \"b827eb02e726 getstate\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#getrels').on('click', function(){   // [MAC] GETRELS
        var message = "{\"message\" : \"b827eb02e726 getrels\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#changepinstate').on('click', function(){    // [MAC] CHANGEPINSTATE [PIN] [STATE]
        var message = "{\"message\" : \"b827eb02e726 changepinstate output1 1\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#relpins').on('click', function(){   // [MAC] RELPINS [INPUTMAC] [OUTPUTMAC] [INPUTPIN] [OUTPUTPIN] [INPUTSTATE] [OUTPUTSTATE]
        var message = "{\"message\" : \"b827eb02e726 relpins abcd1234 b827eb02e726 input1 output1 1 1\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

    $('#unrelpins').on('click', function(){ // [MAC] UNRELPINS [INPUTMAC] [OUTPUTMAC] [INPUTPIN] [OUTPUTPIN]
        var message = "{\"message\" : \"b827eb02e726 unrelpins abcd1234 b827eb02e726 input1 output1\"}";
        var reciever = "b827eb02e726";
        console.log("--> Envío:" + message + " a " + reciever);
        sendMessage(message, reciever);
    });

});