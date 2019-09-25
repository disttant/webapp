window.sendCommand = function (command, reciever, data="none"){

    var checkCommand = false;

    if(command === ""){
        console.log("Falta un comando");
        return "nocommand";
    }

    command = command.toLowerCase();

    if(reciever === ""){
        console.log("Falta un receptor del comando");
        return "noreciever";
    }

    var url = "https://broker.dalher.net/v4/channels/message/"+ reciever;
    var msg = "";

    switch(command){

        case "subgroup":
            if(data === "none"){
                console.log("Especifica un nombre de grupo");
                break;
            }
            msg = "{\"message\" : \"b827eb02e726 subgroup "+ data +"\"}";
            break;

        case "ungroup":
            msg = "{\"message\" : \"b827eb02e726 ungroup\"}";
            break;

        case "getinfo":
            msg = "{\"message\" : \"b827eb02e726 getinfo\"}";
            break;

        case "newdesc":
            msg = "{\"message\" : \"b827eb02e726 newdesc\"}";
            break;

        case "getstate":
            msg = "{\"message\" : \"b827eb02e726 getstate\"}";
            break;

        case "getrels":
            msg = "{\"message\" : \"b827eb02e726 getrels\"}";
            break;

        case "changepinstate":
            if(data.length === 1){
                console.log("Faltan parámetros del comando");
                break;
            }
            if((data[0].indexOf("input") === -1) && (data[0].indexOf("output") === -1)){
                console.log("Especifica un pin válido");
                break;
            }
            if((data[1].indexOf("1") === -1) && (data[1].indexOf("0") === -1)){
                console.log("Especifica un estado digital del pin válido");
                break;
            }
            msg = "{\"message\" : \"b827eb02e726 changepinstate"+ data[0] +" "+ data[1] +"\"}";
            break;

        case "relpins":
            if(data.length === 1){
                console.log("Faltan parámetros del comando");
                break;
            }
            if(data[0] === ""){
                console.log("Especifica un dispositivo de entrada");
                break;
            }
            if(data[1] === ""){
                console.log("Especifica un dispositivo de salida");
                break;
            }
            if(data[2].indexOf("input") === -1){
                console.log("Especifica un pin de entrada válido");
                break;
            }
            if(data[3].indexOf("output") === -1){
                console.log("Especifica un pin de salida válido");
                break;
            }
            if((data[4].indexOf("1") === -1) && (data[4].indexOf("0") === -1)){
                console.log("Especifica un estado digital de la entrada válido");
                break;
            }
            if((data[5].indexOf("1") === -1) && (data[5].indexOf("0") === -1)){
                console.log("Especifica un estado digital de la salida válido");
                break;
            }
            msg = "{\"message\" : \"b827eb02e726 relpins"+ data[0] +" "+ data[1] +" "+ data[2] +" "+ data[3] +" "+ data[4] +" "+ data[5] +"\"}";
            break;

        case "unrelpins":
            if(data.length === 1){
                console.log("Faltan parámetros del comando");
                break;
            }
            if(data[0] === ""){
                console.log("Especifica un dispositivo de entrada");
                break;
            }
            if(data[1] === ""){
                console.log("Especifica un dispositivo de salida");
                break;
            }
            if(data[2].indexOf("input") === -1){
                console.log("Especifica un pin de entrada válido");
                break;
            }
            if(data[3].indexOf("output") === -1){
                console.log("Especifica un pin de salida válido");
                break;
            }
            msg = "{\"message\" : \"b827eb02e726 relpins"+ data[0] +" "+ data[1] +" "+ data[2] +" "+ data[3] +"\"}";
            break;

        default:
            console.log("Comando no encontrado");
            checkCommand = true;
            break;

    }

    if(checkCommand !== true){

        $.ajax({

            url: url,
            type: 'post',
            async: false,
            headers: {
                "Authorization": "Bearer "+ sessionStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            data: msg,
            success: function(response){
                console.log("Mensaje enviado");
                //console.log(response);

                url = "https://broker.dalher.net/v4/channels/messages/" + reciever + "/5";
                setTimeout(function(){

                    $.ajax({

                        url: url,
                        type: 'get',
                        headers: {
                            "Authorization": "Bearer "+ sessionStorage.access_token,
                            "Content-Type" : "application/json",
                            "Accept" : "application/json"
                        },
                        success: function(response){
                            console.log("Mensajes obtenidos");
                            //console.log(response);
                            
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
                
                                    return response[i].message;

                                    // if(message[0] == "info"){
                                    //     console.log("Modelo: " + message[2]);
                                    //     console.log("Número de entradas: " + message[3]);
                                    //     console.log("Número de salidas: " + message[4]);
                                    //     desc = message.slice(5);
                                    //     console.log("Descripción: " + desc);
                                    // }
                                    // if(message[0] == "states"){
                                    //     for(i = 2 ; i < message.length ; i+=2){
                                    //         console.log("Pin: " + message[i] + "/// Estado: " + message[i + 1]);
                                    //     }
                                    // }
                                    // if(message[0] == "rels"){
                                    //     console.log("Relaciones:");
                                    //     for(i = 2 ; i < message.length ; i++){
                                    //         console.log(message[i]);
                                    //     }
                                    // }
                                    // if(message[0] == "ok"){
                                    //     console.log("Completado con éxtio");
                                    // }
                                    // if(message[0] == "error"){
                                    //     console.log("Hubo un error: " + message[2]);
                                    // }
                
                                }
                                continue;
                
                            }
                            return "nomessages";
                        },
                        error: function (response){
                            console.log("Error");
                            console.log(response);
                            return "error";
                        }
                
                    });

                }, 3000);
            },
            error: function (response){
                console.log("Error");
                console.log(response);
                return "error";
            }

        });

    }
    else{
        return "nocommand";
    }

}