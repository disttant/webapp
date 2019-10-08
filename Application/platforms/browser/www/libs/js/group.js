function change(channel, pin){

    var result;
    var turnOff = false;
    var turnOn = false;

    if(sessionStorage.getItem(channel +'state') == "off"){
        result = sendCommand("changepinstate", channel);
        turnOn = true;
        turnOff = false;
    }

    if(sessionStorage.getItem(channel +'state') == "on"){
        result = sendCommand("changepinstate", channel);
        turnOff = true;
        turnOn = false;
    }

    if(result.indexOf(channel) !== -1){
        if(result.indexOf("ok") !== -1){
            showToast("Modificado con éxito :)");
            $('#'+ channel +'icon'+ pin).empty();

            if(turnOff == true){
                sessionStorage.setItem(channel +'state', "off");
                $('#'+ channel +'icon'+ pin).append("toggle_off");
            }

            if(turnOn == true){
                sessionStorage.setItem(channel +'state', "on");
                $('#'+ channel +'icon'+ pin).append("toggle_on");
            }

        }
    }
    else{
        showToast("No se pudo modificar :(");
    }

}

function constRead(channel){

    interval = setInterval(function(){

        console.log("Leyendo estados de "+ channel +"...");
        var result;

        result = sendCommand("getstate", channel);
        result.split(" ");
        
        for(i = 2 ; i < result.length ; i++){

            if(result[i].indexOf("input") !== -1){

                $('#'+ channel + result[i]).empty();

                if(result[i + 1] == "0"){

                    $('#'+ channel + result[i]).append("flash_off");

                }

                if(result[i + 1] == "1"){

                    $('#'+ channel + result[i]).append("offline_bolt");

                }

            }

        }

    }, 1000);

}

function openCollapse(channel){

    $('.collapse').collapse('hide');
    clearInterval(interval);

    if(sessionStorage.getItem('collapseOpen') !== channel){

        sessionStorage.setItem('collapseOpen', channel);
        $('#spinner').show();
        $('#spinner').hide();
        $('#'+ channel).collapse('show');

        if(sessionStorage.getItem(channel +'hasinput') == "yes"){
            //constRead(channel);
        }

    }
    else{
        sessionStorage.removeItem('collapseOpen');
    }

}

function ejectChannel(reciever){

    $('#main').hide();
    $('#spinner').show();
    var response = sendCommand("ungroup", reciever, sessionStorage.group);

    var timer = setInterval(function(){
        if(sessionStorage.response.indexOf("ok") !== -1){
                console.log(sessionStorage.response);
                getChannels();
                clearInterval(timer);
                showToast("Dispositivo expulsado de la habitación :)");
        }
        else{
            showToast("No se ha podido expulsar el dispositivo de la habitación :(");
            $('#main').show();
            $('#spinner').hide();
        }
    }, 1000);

}


function getChannels(){

    var url = "https://broker.dalher.net/v5/groups/lists";

    $.ajax({

        url: url,
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
            if(response.length > 0){
                for(i = 0 ; i < response.length ; i++){
                    if(response[i].group == sessionStorage.group){
                        $('#channelList').empty();

                        for(j = 0 ; j < response[i].channels.length ; j++){

                            var channel = response[i].channels[j].channel;

                            $('#'+ channel +'info').empty();
                            var parent = document.createElement("div");
                            parent.className = "btn-group";

                            var eject = document.createElement("button");
                            eject.className = "btn text-white";
                            eject.style = "background-color: #2D3047; width: 25%";
                            eject.setAttribute('onclick', "ejectChannel(\""+ channel +"\")");
                            eject.innerHTML = '<i class="material-icons md-36 md-light align-middle">clear</i>';

                            var newItem = document.createElement("button");
                            newItem.className = "btn text-white";
                            newItem.style = "background-color: #2D3047; width: 75%";
                            newItem.setAttribute('onclick', "openCollapse(\""+ channel +"\")");
                            newItem.innerText = channel;

                            parent.append(newItem);
                            parent.append(eject);
                            $('#channelList').append(parent);

                            var collapse = document.createElement("div");
                            collapse.className = "collapse mx-auto";
                            collapse.style = "width: 100%";
                            collapse.setAttribute('id', channel);
                            var content = document.createElement("div");
                            content.className = "card card-body text-center";
                            content.style = "width: 100%; background-color: #f7f3f3";
                            content.setAttribute('id', channel +"info");

                            var des = document.createElement("h1");
                            des.setAttribute('id', "channel"+ channel +"des");
                            var title = document.createElement("h3");
                            title.setAttribute('id', "channel"+ channel +"id");
                            var model = document.createElement("h5");
                            model.setAttribute('id', "channel"+ channel +"model");
                            var modelpanel = document.createElement("div");
                            modelpanel.setAttribute('id', "channel"+ channel +"panel");

                            content.append(des);
                            content.append(title);
                            content.append(model);
                            content.append(modelpanel);
                            collapse.append(content);
                            $('#channelList').append(collapse);

                            var result = sendCommand("getinfo", channel);
                            var info = result.split(" ");
                            var description = info[5];
                            for(k = 6 ; k < info.length ; k++){
                                description = description + " " + info[k];
                            }

                            $('#channel'+ channel +'des').append(description);
                            $('#channel'+ channel +'id').append(channel);
                            $('#channel'+ channel +'model').append(info[2]);

                            sessionStorage.setItem('channelStorage'+ i, channel);

                            //mountcollapse(info[2], channel);

                        }
                        break;
                    }
                    else{
                        $('#channelList').empty();
                        var newItem = document.createElement("button");
                        newItem.className = "btn text-white";
                        newItem.style = "background-color: #2D3047";
                        newItem.innerText = "No hay dispositivos";
        
                        $('#channelList').append(newItem);
                    }
                }
            }
            else{
                $('#channelList').empty();
                var newItem = document.createElement("button");
                newItem.className = "btn text-white";
                newItem.style = "background-color: #2D3047";
                newItem.innerText = "No hay dispositivos";

                $('#channelList').append(newItem);
            }
            $('#spinner').hide();
            $('#main').show();
        },
        error: function (response){
            console.log("Error");
            console.log(response);
        }

    });

}

function getFreeChannels(){

    var url = "https://broker.dalher.net/v5/channels/list/free";

    $.ajax({

        url: url,
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
            if(response.length > 0){
                $('#channel_select').empty();

                var defaultItem = document.createElement("option");
                defaultItem.innerText = "Escoge cuál agregar...";
                defaultItem.value = "none";
                defaultItem.selected = true;

                $('#channel_select').append(defaultItem);

                for(i = 0 ; i < response.length ; i++){
                    var newItem = document.createElement("option");
                    newItem.innerText = response[i].channel;
                    newItem.value = response[i].channel;

                    $('#channel_select').append(newItem);
                }
            }
            else{
                $('#channel_select').empty();
                var newItem = document.createElement("option");
                newItem.innerText = "No hay dispositivos libres";
                newItem.value = "none";
                newItem.selected = true;

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

    $('#main').hide();
    $('#spinner').show();

    num = 0;
    getChannels();

    $('#group').append(sessionStorage.group);

    $('#back').on('click', function(){
        sessionStorage.removeItem('group');
        $('#content').load("main.mod.html");
    });

    $('#addButton').on('click', function(){
        $('#main').hide();
        $('#spinner').show();
        getFreeChannels();
    });

    $('#addChannel').on('click', function(){
        var reciever = $('#channel_select option:selected').attr('value');
        var error = false;
        if(reciever !== "none"){
            $('#main').hide();
            $('#spinner').show();
            $('#add_modal').modal('hide');

            var response = sendCommand("subgroup", reciever, sessionStorage.group);

            var timer = setInterval(function(){
                if(sessionStorage.response.indexOf("ok") !== -1){
                        console.log(sessionStorage.response);
                        getChannels();
                        clearInterval(timer);
                        showToast("Dispositivo incluido en la habitación :)");
                }
                else{
                    showToast("No se ha podido incluir el dispositivo en el habitación :(");
                    $('#main').show();
                    $('#spinner').hide();
                }
            }, 1000);
            
        }
    });

});