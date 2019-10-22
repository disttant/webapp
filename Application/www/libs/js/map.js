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

    var result = "";

    if(channel != "none"){

        // Envío de orden para obtener información del canal
        sendCommand("getinfo", channel);

        var cycle = 0;
        var info = "none|none|none|none|none|none";
        var infoGet = false;
        var time = new Date();
        var now = time.getTime();

        while(cycle < 15){

            result = getResponse(channel);
            result = JSON.parse(result.responseText);

            for(i = 0 ; i < result.length ; i++){

                if((now - result[i].time * 1000) < 10000){
                    resultSplit = result[i].message.split("|");
                    if(resultSplit[0] == "info"){
                        if(resultSplit[1] == channel){

                            result = resultSplit;
                            infoGet = true;

                        }
                    }

                }

            }

            if(infoGet == true)
                break;
                
            cycle++;

        }

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

    var result = "";

    if(channel != "none"){

        // Envío de orden para obtener información del canal
        sendCommand("getinfo", channel);

        var cycle = 0;
        var info = "none|none|none|none|none|none";
        var infoGet = false;
        var time = new Date();
        var now = time.getTime();

        while(cycle < 15){

            result = getResponse(channel);
            result = JSON.parse(result.responseText);

            for(i = 0 ; i < result.length ; i++){

                if((now - result[i].time * 1000) < 10000){
                    resultSplit = result[i].message.split("|");
                    if(resultSplit[0] == "info"){
                        if(resultSplit[1] == channel){

                            result = resultSplit;
                            infoGet = true;

                        }
                    }

                }

            }

            if(infoGet == true)
                break;
                
            cycle++;

        }

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

    $('#main').hide();
    $('#spinner').show();
    $('#link').collapse('hide');
    $('#cron').collapse('hide');
    $('#confirmCron').hide();
    $('#confirmLink').hide();
    $('#panel').empty();

    setTimeout(function(){

        // Envío de orden para obtener información del canal
        sendCommand("getinfo", channel);

        var cycle = 0;
        var result = "";
        var info = "none|none|none|none|none|none";
        var infoGet = false;
        var time = new Date();
        var now = time.getTime();

        while(cycle < 15){

            result = getResponse(channel);
            result = JSON.parse(result.responseText);

            for(i = 0 ; i < result.length ; i++){

                if((now - result[i].time * 1000) < 10000){
                    resultSplit = result[i].message.split("|");
                    if(resultSplit[0] == "info"){
                        if(resultSplit[1] == channel){

                            info = resultSplit;
                            infoGet = true;

                        }
                    }

                }

            }

            if(infoGet == true)
                break;
                
            cycle++;

        }

        sendCommand("getstate", channel);

        var cycle = 0;
        var result = "";
        var states = "none|none|none|none";
        var infoGet = false;
        var time = new Date();
        var now = time.getTime();

        while(cycle < 15){

            result = getResponse(channel);
            result = JSON.parse(result.responseText);

            for(i = 0 ; i < result.length ; i++){

                if((now - result[i].time * 1000) < 10000){
                    resultSplit = result[i].message.split("|");
                    if(resultSplit[0] == "states"){
                        if(resultSplit[1] == channel){
                            if(resultSplit[2].indexOf("output") !== -1){

                                states = resultSplit;
                                infoGet = true;

                            }
                        }
                    }

                }

            }

            if(infoGet == true)
                break;
                
            cycle++;

        }

        if(info != "none|none|none|none|none|none"){

            $('#'+ channel +'Button').empty();
            $('#'+ channel +'Button').append(channel);

            $('#panel').load("/models/"+ info[2] +".model.html", function(){

                // Obtener la información de la repsuesta del canal

                $('#des').append(info[5]);
                $('#id').append(channel);
                $('#model').append(info[2]);
                prepareToModel(info[2], channel, states);

                $('#spinner').hide();
                $('#main').show();
                $('#collapse').collapse('show');
                $('#modal').modal('show');
                
            });

        }
        else{

            $('#'+ channel +'Button').empty();
            $('#'+ channel +'Button').append(channel +" (No disponible)");
            $('#spinner').hide();
            $('#main').show();
            $('#collapse').collapse('show');
            $('#modal').modal('hide');

        }

    }, 100);

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
                col.style = "width: 5%; height: 100%; background-color: #A5A5A5";
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

        // Esconder contenido principal
        $('#main').hide();
        // Mostrar spinner
        $('#spinner').show();

        $('#rubbish').empty();
        $('#rubbish').html("<i class=\"material-icons md-24 md-light align-middle\">delete</i>");
        $('#rubbish').append("Expulsar del grupo");

        setTimeout(function(){

            sendCommand("ungroup", data);

            var cycle = 0;
            var result = "";
            var answer = "error";
            var infoGet = false;
            var time = new Date();
            var now = time.getTime();

            while(cycle < 15){

                result = getResponse(data);
                result = JSON.parse(result.responseText);

                for(i = 0 ; i < result.length ; i++){

                    if((now - result[i].time * 1000) < 10000){
                        resultSplit = result[i].message.split("|");
                        if(resultSplit[0] == "ok"){
                            if(resultSplit[1] == data){

                                answer = "ok";
                                infoGet = true;

                            }
                        }

                    }

                }

                if(infoGet == true)
                    break;
                    
                cycle++;

            }

            // Para una respuesta positiva
            if(answer == "ok"){
                localStorage.removeItem(data +'pos');
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

                var dot = document.createElement("span");
                dot.className = "lightDot";
                dot.setAttribute('id', channel);
                dot.setAttribute('draggable', "true");
                dot.setAttribute('ondragstart', "drag(event)");
                dot.setAttribute('onclick', 'openmodal("'+ channel +'")');

                $('#'+ localStorage.getItem(data +'pos')).append(dot);

            }

            // Mostrar contenido principal
            $('#main').show();
            // Esconder spinner
            $('#spinner').hide();

        }, 100);

    }

    if(dropevent.target.id.indexOf("sideline") !== -1){

        var dot = $('#'+ dropevent.target.id).html();
        $('#'+ dropevent.target.id).empty();
        var pos = localStorage.getItem(data +'pos');
        $('#'+ pos).append(dot);

    }

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

            sendCommand("relpins", input, input +"|"+ output +"|"+ inputPin +"|"+ outputPin +"|"+ inputState +"|"+ outputState);

            var cycle = 0;
            var result = "";
            var fstRel = "none|none|none";
            var infoGet = false;
            var time = new Date();
            var now = time.getTime();
        
            while(cycle < 15){
        
                result = getResponse(channel[k]);
                result = JSON.parse(result.responseText);
        
                for(i = 0 ; i < result.length ; i++){
        
                    if((now - result[i].time * 1000) < 10000){
                        resultSplit = result[i].message.split("|");
                        if(resultSplit[0] == "ok"){
                            if(resultSplit[1] == channel[k]){

                                fstRel = resultSplit;
                                infoGet = true;

                            }
                        }
        
                    }
        
                }
        
                if(infoGet == true)
                    break;
                    
                cycle++;
        
            }

            sendCommand("relpins", output, input +"|"+ output +"|"+ inputPin +"|"+ outputPin +"|"+ inputState +"|"+ outputState);

            var cycle = 0;
            var result = "";
            var scdRel = "none|none|none";
            var infoGet = false;
            var time = new Date();
            var now = time.getTime();
        
            while(cycle < 15){
        
                result = getResponse(channel[k]);
                result = JSON.parse(result.responseText);
        
                for(i = 0 ; i < result.length ; i++){
        
                    if((now - result[i].time * 1000) < 10000){
                        resultSplit = result[i].message.split("|");
                        if(resultSplit[0] == "ok"){
                            if(resultSplit[1] == channel[k]){

                                scdRel = resultSplit;
                                infoGet = true;

                            }
                        }
        
                    }
        
                }
        
                if(infoGet == true)
                    break;
                    
                cycle++;
        
            }

            if((fstRel[0] == "ok") && (scdRel[0] != "ok")){
                showToast("Primer dispositivo relacionado :)");
            }
            if((fstRel[0] != "ok") && (scdRel[0] == "ok")){
                showToast("Segundo dispositivo relacionado :)");
            }
            if((fstRel[0] == "ok") && (scdRel[0] == "ok")){
                showToast("Dispositivos relacionados :)");
            }

        }

    });

});