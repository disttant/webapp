function change(channel, pin){      // Esta función cambia el estado de un pin de un canal

    // Variables necesarias
    var result;             // Guarda respuesta del cliente
    var turnOff = false;    // Guarda cambio de encendido a apagado
    var turnOn = false;     // Guarda cambio de apagado a encendido

    // Comprobación del estado al que cambiar el pin del canal

    if(sessionStorage.getItem(channel +'state') == "off"){
        // Envío de cambio a apagado
        result = sendCommand("changepinstate", channel);
        // Guardar cambio
        turnOn = true;
        turnOff = false;
    }

    if(sessionStorage.getItem(channel +'state') == "on"){
        // Envío de cambio a encendido
        result = sendCommand("changepinstate", channel);
        // Guardar cambio
        turnOff = true;
        turnOn = false;
    }

    // Comprobación respuesta del canal
    if(result.indexOf(channel) !== -1){
        if(result.indexOf("ok") !== -1){
            // Mostrar mensaje de éxito
            showToast("Modificado con éxito :)");
            // Vaciar espacio del icono de encendido o apagado
            $('#'+ channel +'icon'+ pin).empty();

            // Para cambios de encendido a apagado
            if(turnOff == true){
                // Guardar cambio
                sessionStorage.setItem(channel +'state', "off");
                // Meter icono nuevo
                $('#'+ channel +'icon'+ pin).append("toggle_off");
            }

            // Para cambios de apagado a encendido
            if(turnOn == true){
                // Guardar cambio
                sessionStorage.setItem(channel +'state', "on");
                // Meter icono nuevo
                $('#'+ channel +'icon'+ pin).append("toggle_on");
            }

        }
    }
    // En caso de fracaso
    else{
        // Mostrar mensaje de error
        showToast("No se pudo modificar :(");
    }

}

function constRead(channel){    // Esta función establece una lectura constante de pines

    interval = setInterval(function(){

        console.log("Leyendo estados de "+ channel +"...");
        var result;

        // Pedir lecturas al canal
        result = sendCommand("getstate", channel);
        result.split(" ");
        
        // Para cada lectura
        for(i = 2 ; i < result.length ; i++){

            // Si hay lectura de entradas
            if(result[i].indexOf("input") !== -1){

                // Vaciamos icono de encendido o apagado
                $('#'+ channel + result[i]).empty();

                // Para lectura de apagado
                if(result[i + 1] == "0"){

                    // Meter nuevo icono
                    $('#'+ channel + result[i]).append("flash_off");

                }

                // Para lectura de encendido
                if(result[i + 1] == "1"){

                    // Meter nuevo icono
                    $('#'+ channel + result[i]).append("offline_bolt");

                }

            }

        }

    }, 1000);

}

function openCollapse(channel){     // Esta función abre el collapse de un canal

    // Cerrar cualquier collapse abierto
    $('.collapse').collapse('hide');
    // Borrar cualquier intervalo presente
    clearInterval(interval);

    // Si no está abierto el collapse que vamos a abrir
    if(sessionStorage.getItem('collapseOpen') !== channel){

        // PEDIR ESTADOS EN EL MOMENTO DE VER EL PANEL
        // FALTARIA AÑADIR LA ACTUALIZACION DE LOS ESTADOS DE MANERA CONTINUA

        // Guardar la nueva información
        sessionStorage.setItem('collapseOpen', channel);
        // Esconder spinner
        $('#spinner').hide();
        // Abrir collapse nuevo
        $('#'+ channel).collapse('show');

        // Si el modelo tiene entradas, activar lectura constante mientras el collapse esté abierto
        if(sessionStorage.getItem(channel +'hasinput') == "yes"){
            //constRead(channel);
        }

    }
    // Si está abierto el collapse que vamos a abrir
    else{
        // Guardar la información
        sessionStorage.removeItem('collapseOpen');
    }

}

function ejectChannel(reciever){    // Esta función expulsa un canal de un grupo

    // Esconder contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();
    // Envío de orden al canal
    var response = sendCommand("ungroup", reciever, sessionStorage.group);

    // Para respuesta positiva
    if(sessionStorage.response.indexOf("ok") !== -1){
            console.log(sessionStorage.response);
            // Obtener canales del grupo tras la operación
            getChannels();
            // Mostrar mensaje de éxito
            showToast("Dispositivo expulsado de la habitación :)");
    }
    // Para respuesta negativa
    else{
        // Mostrar mensaje de error
        showToast("No se ha podido expulsar el dispositivo de la habitación :(");
        // Mostrar contenido principal
        $('#main').show();
        // Esconder spinner
        $('#spinner').hide();
    }

}


function getChannels(){     // Esta función obtiene los canales de los grupos

    // Petición para obtener canales de los grupos
    $.ajax({

        url: URL_getfullgroups,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            //console.log("Pidiendo Canales");
        },
        success: function(response){
            //console.log("Canales obtenidos");
            //console.log(response);
            // Si hay algún canal en algún grupo
            if(response.length > 0){
                // Para cada grupo
                for(i = 0 ; i < response.length ; i++){
                    // Si encontramos el grupo que buscamos
                    if(response[i].group == sessionStorage.group){
                        // Vaciamos la lista de canales
                        $('#channelList').empty();
                        var channel = [];
                        var k = 0;

                        // Para cada canal del grupo
                        for(j = 0 ; j < response[i].channels.length ; j++){

                            // Nombre del canal
                            channel[j] = response[i].channels[j].channel;

                            var container = document.createElement("div");
                            container.className = "btn-group";
                            container.style = "width: 100%";

                            // Botón del canal
                            var channelButton = document.createElement("button");
                            channelButton.className = "btn text-white";
                            channelButton.style = "background-color: #2D3047; width: 75%";
                            channelButton.setAttribute('id', channel[j] +'Button');
                            channelButton.setAttribute('onclick', 'openCollapse("'+ channel[j] +'")');
                            channelButton.innerText = channel[j];

                            // Botón para eliminar canal
                            var ejectButton = document.createElement("button");
                            ejectButton.className = "btn";
                            ejectButton.style = "background-color: #2D3047; width: 25%";
                            ejectButton.setAttribute('id', channel[j] +'Eject');
                            ejectButton.setAttribute('onclick', 'ejectChannel("'+ channel[j] +'")');

                            // Icono del botón de eliminar canal
                            var icon = document.createElement("i");
                            icon.className = "material-icons md-36 md-light align-middle";
                            icon.innerText = "clear";

                            var newDiv = document.createElement("div");
                            newDiv.style = "width: 100%";
                            newDiv.setAttribute('id', channel[j] +'panel');

                            ejectButton.append(icon);
                            container.append(channelButton);
                            container.append(ejectButton);
                            $('#channelList').append(container);
                            $('#channelList').append(newDiv);

                            // Envío de orden para obtener información del canal
                            var result = sendCommand("getinfo", channel[j]);
                            var info = result.split(" ");

                            $('#'+ channel[j] +'panel').load("/models/"+ info[2] +".model.html", function(){

                                $('#collapse').attr('id', channel[k]);
                                $('#des').attr('id', channel[k] +"des");
                                $('#id').attr('id', channel[k] +"id");
                                $('#model').attr('id', channel[k] +"model");
                                $('#panel').attr('id', channel[k] +"panel");

                                // Obtener la información de la repsuesta del canal
                                var description = info[5];
                                for(z = 6 ; z < info.length ; z++){
                                    description = description + " " + info[z];
                                }

                                $('#'+ channel[k] +'des').append(description);
                                $('#'+ channel[k] +'id').append(channel[k]);
                                $('#'+ channel[k] +'model').append(info[2]);
                                k++;
                            
                            });

                        }
                        break;
                    }
                    // Si no encontramos el grupo, no tiene canales asociados
                    else{
                        // Vaciar lista de canales
                        $('#channelList').empty();
                        // Crear elemento indicador
                        var newItem = document.createElement("button");
                        newItem.className = "btn text-white";
                        newItem.style = "background-color: #2D3047";
                        newItem.innerText = "No hay dispositivos";
        
                        // Meter elemento indicador
                        $('#channelList').append(newItem);
                    }
                }
            }
            // Si no hay grupos con canales
            else{
                // Vaciar lista de canales
                $('#channelList').empty();
                // Crear elemento indicador
                var newItem = document.createElement("button");
                newItem.className = "btn text-white";
                newItem.style = "background-color: #2D3047";
                newItem.innerText = "No hay dispositivos";

                // Meter elemento indicador
                $('#channelList').append(newItem);
            }
            // Esconder spinner
            $('#spinner').hide();
            // Mostrar contenido principal
            $('#main').show();
        },
        error: function (response){
            console.log("Error");
            console.log(response);
        }

    });

}

function getFreeChannels(){     // Esta función obtiene los canales libres

    // Petición para obtener canales libres
    $.ajax({

        url: URL_getfreechannels,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            //console.log("Pidiendo canales libres");
        },
        success: function(response){
            //console.log("Canales obtenidos");
            //console.log(response);
            // Si hay canales libres
            if(response.length > 0){
                // Vaciamos opciones del selector del modal de añadir canal a grupo
                $('#channel_select').empty();

                // Crear opción por defecto
                var defaultItem = document.createElement("option");
                defaultItem.innerText = "Escoge cuál agregar...";
                defaultItem.value = "none";
                defaultItem.selected = true;

                // Meter opción por defecto
                $('#channel_select').append(defaultItem);

                // Para los canales libres
                for(i = 0 ; i < response.length ; i++){
                    // Crear opción del selector
                    var newItem = document.createElement("option");
                    newItem.innerText = response[i].channel;
                    newItem.value = response[i].channel;

                    // Meter opción en el selector
                    $('#channel_select').append(newItem);
                }
            }
            // Si no hay canales libres
            else{
                // Vaciamos opciones del selector del modal de añadir canal a grupo
                $('#channel_select').empty();
                // Crear elemento indicador
                var newItem = document.createElement("option");
                newItem.innerText = "No hay dispositivos libres";
                newItem.value = "none";
                newItem.selected = true;

                // Meter elemento indicador
                $('#channel_select').append(newItem);
            }
            $('#main').show();
            $('#spinner').hide();
            $('#add_modal').modal('show');
        },
        error: function (response){
            console.log("Error");
            console.log(response);
        }

    });

}

$(function () {

    // Mostrar el contenido principal
    $('#main').hide();
    // Mostrar el spinner
    $('#spinner').show();

    // Obtener los canales del grupo en el que estamos
    getChannels();

    // Meter el nombre del grupo en el título principal
    $('#group').append(sessionStorage.group);

    // Acción botón Back para volver al módulo Main
    // $('#back').on('click', function(){
    //     sessionStorage.removeItem('group');
    //     $('#content').load("main.mod.html");
    // });

    // Acción del botón para añadir canales al grupo
    $('#addButton').on('click', function(){
        // Esconder contenido principal
        $('#main').hide();
        // Mostrar spinner
        $('#spinner').show();
        // Obtener los canales libres
        getFreeChannels();
    });

    // Acción del botón para abrir mapa interactivo
    $('#mapButton').on('click', function(){
        $('#content').load("map.mod.html");
    });

    // Acción del botón para añadir un canal al grupo
    $('#addChannel').on('click', function(){
        // Obtener canal a añadir al grupo
        var reciever = $('#channel_select option:selected').attr('value');

        // Comprobación de canal válido
        if(reciever !== "none"){
            // Esconder contenido principal
            $('#main').hide();
            // Mostrar spinner
            $('#spinner').show();
            // Esconder modal
            $('#add_modal').modal('hide');

            // Envío de comando de suscripción del canal al grupo
            var response = sendCommand("subgroup", reciever, sessionStorage.group);

            // Para una respuesta positiva
            if(sessionStorage.response.indexOf("ok") !== -1){
                    console.log(sessionStorage.response);
                    // Obtener lista de canales del grupo
                    getChannels();
                    // Borrar intervalo
                    //clearInterval(timer);
                    // Mostrar mensaje de completado con éxito
                    showToast("Dispositivo incluido en la habitación :)");
            }
            // Para una respuesta negativa
            else{
                // Mostrar mensaje de error
                showToast("No se ha podido incluir el dispositivo en el habitación :(");
                // Mostrar contenido principal
                $('#main').show();
                // Esconder spinner
                $('#spinner').hide();
            }
            
        }
    });

});