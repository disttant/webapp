function openCron(){

    if($('#cron').hasClass('show')){
        $('#cron').collapse('hide');
        $('#confirmCron').hide();
    }
    else{
        $('#cron').collapse('show');
        $('#link').collapse('hide');
        $('#confirmLink').hide();
        $('#confirmCron').show();
    }

}

function getInputInfo(channel){

    if(channel != "none"){

        var result = sendCommand("getinfo", channel);
        result = result.split(" ");

        $('#linkInputNum').empty();

        if(result[3] > 0){

            var defaultOption = document.createElement("option");
            defaultOption.innerText = "Escoge un pin...";
            defaultOption.value = "none";
            defaultOption.selected = true;
            $('#linkInputNum').append(defaultOption);

            for(i = 0 ; i < result[3] ; i++){

                var option = document.createElement("option");
                option.innerText = "Entrada "+ i;
                option.value = "entrada"+ i;
                $('#linkInputNum').append(option);

            }
        }

        else{

            var defaultOption = document.createElement("option");
            defaultOption.innerText = "No hay entradas";
            defaultOption.value = "none";
            defaultOption.selected = true;
            $('#linkInputNum').append(defaultOption);

        }

        $('#inprepend').attr('placeholder', channel);
        $('#insprepend').attr('placeholder', channel);

    }

    else{

        $('#inprepend').attr('placeholder', "");
        $('#insprepend').attr('placeholder', "");
        $('#linkInputNum').empty();

    }

}

function getOutputInfo(channel){

    if(channel != "none"){

        var result = sendCommand("getinfo", channel);
        result = result.split(" ");

        $('#linkOutputNum').empty();

        if(result[4] > 0){

            var defaultOption = document.createElement("option");
            defaultOption.innerText = "Escoge un pin...";
            defaultOption.value = "none";
            defaultOption.selected = true;
            $('#linkOutputNum').append(defaultOption);

            for(i = 0 ; i < result[4] ; i++){

                var option = document.createElement("option");
                option.innerText = "Salida "+ i;
                option.value = "salida"+ i;
                $('#linkOutputNum').append(option);

            }
        }

        else{

            var defaultOption = document.createElement("option");
            defaultOption.innerText = "No hay salidas";
            defaultOption.value = "none";
            defaultOption.selected = true;
            $('#linkOutputNum').append(defaultOption);

        }

        $('#outprepend').attr('placeholder', channel);
        $('#outsprepend').attr('placeholder', channel);

    }

    else{

        $('#outprepend').attr('placeholder', "");
        $('#outsprepend').attr('placeholder', "");
        $('#linkOutputNum').empty();

    }

}

function openLink(){

    $.ajax({

        url: URL_getfullgroups,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            //console.log("Pidiendo Canales de los Grupos");
        },
        success: function(response){
            //console.log(response);
            if(response.length > 0){

                $('#linkInput').empty();
                $('#linkOutput').empty();
                var found = false;

                for(i = 0 ; i < response.length ; i++){

                    if(response[i].group == sessionStorage.group){

                        found = true;

                        var defaultOption = document.createElement("option");
                        defaultOption.innerText = "Escoge un dispositivo...";
                        defaultOption.value = "none";
                        defaultOption.selected = true;
                        $('#linkInput').append(defaultOption);

                        var defaultOption = document.createElement("option");
                        defaultOption.innerText = "Escoge un dispositivo...";
                        defaultOption.value = "none";
                        defaultOption.selected = true;
                        $('#linkOutput').append(defaultOption);

                        for(j = 0 ; j < response[i].channels.length ; j++){

                            channel = response[i].channels[j].channel;

                            var option = document.createElement("option");
                            option.value = channel;
                            option.innerText = channel;
                            $('#linkInput').append(option);

                            var option = document.createElement("option");
                            option.value = channel;
                            option.innerText = channel;
                            $('#linkOutput').append(option);

                        }

                        if($('#link').hasClass('show')){
                            $('#link').collapse('hide');
                            $('#confirmLink').hide();
                        }
                        else{
                            $('#link').collapse('show');
                            $('#cron').collapse('hide');
                            $('#confirmLink').show();
                            $('#confirmCron').hide();
                        }

                    }

                }

                if(found === false){

                    var defaultOption = document.createElement("option");
                    defaultOption.innerText = "No hay dispositivos";
                    defaultOption.value = "none";
                    defaultOption.selected = true;
                    $('#linkInput').append(defaultOption);

                    var defaultOption = document.createElement("option");
                    defaultOption.innerText = "No hay dispositivos";
                    defaultOption.value = "none";
                    defaultOption.selected = true;
                    $('#linkOutput').append(defaultOption);

                }

            }

            else{

                var defaultOption = document.createElement("option");
                defaultOption.innerText = "No hay dispositivos";
                defaultOption.value = "none";
                defaultOption.selected = true;
                $('#linkInput').append(defaultOption);

                var defaultOption = document.createElement("option");
                defaultOption.innerText = "No hay dispositivos";
                defaultOption.value = "none";
                defaultOption.selected = true;
                $('#linkOutput').append(defaultOption);

            }

        },
        error: function(response){
            console.log(response);
        }
    });

}

function openmodal(channel){

    $('#spinnerModal').show();
    $('#link').collapse('hide');
    $('#cron').collapse('hide');
    $('#confirmCron').hide();
    $('#confirmLink').hide();
    $('#panel').empty();

    // Envío de orden para obtener información del canal
    var result = sendCommand("getinfo", channel);
    var info = result.split(" ");

    $('#panel').load("/models/"+ info[2] +".model.html", function(){

        // Obtener la información de la repsuesta del canal
        var description = info[5];
        for(z = 6 ; z < info.length ; z++){
            description = description + " " + info[z];
        }

        $('#des').append(description);
        $('#id').append(channel);
        $('#model').append(info[2]);

        $('#spinnerModal').hide();
        $('#collapse').collapse('show');
        $('#modal').modal('show');
        
    });

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
            //console.log(response);
            if(response.length > 0){

                for(i = 0 ; i < response.length ; i++){

                    if(response[i].group == sessionStorage.group){

                        for(j = 0 ; j < response[i].channels.length ; j++){

                            channel = response[i].channels[j].channel;

                            var dot = document.createElement("span");
                            dot.className = "lightDot";
                            dot.setAttribute('id', channel);
                            dot.setAttribute('draggable', "true");
                            dot.setAttribute('ondragstart', "drag(event)");
                            if(localStorage.getItem(channel +'pos') != undefined){
                                if(localStorage.getItem(channel +'pos').indexOf('sideline') === -1){
                                    dot.setAttribute('onclick', 'openmodal("'+ channel +'")');
                                }
                            }
                            if(localStorage.getItem(channel +'pos') !== null){
                                $('#'+ localStorage.getItem(channel +'pos')).append(dot);
                            }
                            else{
                                $('#sideline' + (j + 1)).append(dot);
                            }

                        }

                    }

                }

            }
        },
        error: function(response){
            console.log(response);
        }
    });

}

function loadGrid(){

    var grid = document.getElementById("map");

    for(i = 1 ; i < 21 ; i++){

        var row = document.createElement("div");
        row.className = "row mx-auto";
        row.style = "width: 100%; height: 5%;";

        for(j = 1 ; j < 21 ; j++){

            var col = document.createElement("div");
            col.className = "mx-auto";
            if((i == 20) && ((j == 10) || (j == 11))){
                col.style = "width: 5%; height: 100%; background-color: white";
            }
            else{
                col.style = "width: 5%; height: 100%;";
            }
            col.setAttribute('id', 'row'+i+'col'+j);
            col.setAttribute('ondrop', "drop(event)");
            col.setAttribute('ondragover', "allowDrop(event)");
            row.append(col);

        }

        grid.append(row);

    }

}

function loadSideline(){

    var sideline = document.getElementById("sideline");

    var col = document.createElement("div");
    col.className = "row mx-auto";
    col.style = "width: 100%; height:100%;";

    for(i = 1 ; i < 14 ; i++){

        var row = document.createElement("div");
        row.className = "mx-auto my-auto";
        row.style = "width: 100%; height: 7%;";
        row.setAttribute('id', 'sideline'+ i);
        row.setAttribute('ondrop', "drop(event)");
        row.setAttribute('ondragover', "allowDrop(event)");

        col.append(row);

    }

    sideline.append(col);

}

function allowDrop(allowdropevent){
    allowdropevent.preventDefault();
}

function drag(dragevent){
    dragevent.dataTransfer.setData("text", dragevent.target.id);
    $('#rubbish').show();
}

function drop(dropevent){
    $('#rubbish').hide();
    dropevent.preventDefault();
    var data = dropevent.dataTransfer.getData("text");
    dropevent.target.appendChild(document.getElementById(data));

    if(dropevent.target.id !== "rubbish"){
        if(dropevent.target.id.indexOf('sideline') === -1){
            if($('#'+ data).attr('onlcick') == undefined){
                $('#'+ data).attr('onclick', 'openmodal("'+ data +'")');
            }
            localStorage.setItem(data +'pos', dropevent.target.id);
        }
    }
    if(dropevent.target.id === "rubbish"){

        localStorage.removeItem(data +'pos');
        $('#rubbish').empty();
        $('#rubbish').html("<i class=\"material-icons md-24 md-light align-middle\">delete</i>");
        $('#rubbish').append("Expulsar del grupo");
        var response = sendCommand("ungroup", data, sessionStorage.group);

        // Para respuesta positiva (FALLA)
        if(response.indexOf("ok") !== -1){
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
    if(dropevent.target.id.indexOf("sideline") !== -1){
        var dot = $('#'+ dropevent.target.id).html();
        $('#'+ dropevent.target.id).empty();
        var pos = localStorage.getItem(data +'pos');
        $('#'+ pos).append(dot);
    }

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

function openAddModal(){

    // Esconder contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();
    // Obtener los canales libres
    getFreeChannels();

}

$(function () {

    $('#modal').modal('hide');
    $('#spinner').hide();
    $('#rubbish').hide();
    $('#title').append(sessionStorage.group);
    loadGrid();
    loadSideline();
    getChannels();

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

    $('#linkInput').on("change", function(){
        getInputInfo($('#linkInput').val());
    });

    $('#linkOutput').on("change", function(){
        getOutputInfo($('#linkOutput').val());
    });

    $('#confirmCron').on('click', function(){
        console.log("Funcionalildad no implementada aún");
    });

    $('#confirmLink').on('click', function(){
        
        var check = false;

        if($('#linkInput').val() == "none"){
            //console.log("Entrada no válida");
            showToast("Debes escoger un dispositivo válido como entrada.");
            check = true;
        }

        if($('#linkOutput').val() == "none"){
            //console.log("Salida no válida");
            showToast("Debes escoger un dispositivo válido como salida.");
            check = true;
        }

        if($('#linkInputNum').val() == "none"){
            //console.log("Pin de entrada no válida");
            showToast("Debes escoger un pin del dispositivo de entrada válido.");
            check = true;
        }

        if($('#linkOutputNum').val() == "none"){
            //console.log("Pin de salida no válida");
            showToast("Debes escoger un pin del dispositivo de salida válido.");
            check = true;
        }

        if(check == false){

            var input = $('#linkInput').val();
            var output = $('#linkOutput').val();
            var inputPin = $('#linkInputNum').val();
            var outputPin = $('#linkOutputNum').val();
            var inputState = $('#linkInputState').val();
            var outputState = $('#linkOutputState').val();

            var response1 = sendCommand("relpins", input, "toalainfo");  // FALTA AÑADIR LA INFORMACION DEL COMANDO
            var response2 = sendCommand("relpins", output, "toalainfo"); // FALTA AÑADIR LA INFORMACION DEL COMANDO

            showToast("Operación realizada con éxito! :)");
            // COMPROBAR RESPUESTAS "OK" DE AMBOS

        }

    });

});