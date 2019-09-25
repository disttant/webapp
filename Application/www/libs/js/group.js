function openCollapse(channel){

    $('#collapse').collapse('hide');

    setTimeout(function(){  // provisional
        $('#channel').empty();
        $('#channel').append(channel);
        $('#collapse').collapse('show');
    }, 500);

}

function getChannels(){

    var url = "https://broker.dalher.net/v4/groups/lists";

    $.ajax({

        url: url,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            console.log("Pidiendo Canales");
        },
        success: function(response){
            console.log("Canales obtenidos");
            console.log(response);
            if(response.length > 0){
                for(i = 0 ; i < response.length ; i++){
                    if(response[i].group == sessionStorage.group){
                        $('#channelList').empty();
                        for(j = 0 ; j < response[i].channels.length ; j++){
                            var newItem = document.createElement("button");
                            newItem.className = "btn text-white";
                            newItem.style = "background-color: #2D3047";
                            newItem.setAttribute('onclick', "openCollapse(\""+ response[i].channels[j].channel +"\")");
                            newItem.innerText = response[i].channels[j].channel;

                            $('#channelList').append(newItem);
                        }
                        break;
                    }
                    else{
                        var newItem = document.createElement("button");
                        newItem.className = "btn text-white";
                        newItem.style = "background-color: #2D3047";
                        newItem.innerText = "No hay dispositivos";
        
                        $('#channelList').append(newItem);
                    }
                }
            }
            else{
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

    var url = "https://broker.dalher.net/v4/channels/list/free";

    $.ajax({

        url: url,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            console.log("Pidiendo canales libres");
        },
        success: function(response){
            console.log("Canales obtenidos");
            console.log(response);
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

                $('#channelList').append(newItem);
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
        if(reciever !== "none"){
            $('#main').hide();
            $('#spinner').show();
            $('#add_modal').modal('hide');
            var response = sendCommand("getinfo", reciever);
            console.log(response);
            $('#main').show();
            $('#spinner').hide();
        }
    });

});