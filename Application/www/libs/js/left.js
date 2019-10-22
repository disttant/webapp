var firstTime = true;

function deleteGroup(){     // Esta función elimina un grupo

    // Esconder el modal
    $('#delete_modal').modal('hide');
    // Esconder contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();

    // Coger el grupo escogido para eliminar
    var group = $('#group_select2 option:selected').attr('value');

    setTimeout(function(){

        // Comprobar que se escogió un grupo válido
        if(group !== "none"){
            // URL para petición de borrar grupo
            var url = URL_deletegroup + group;

            // Petición para borrar grupo
            $.ajax({

                url: url,
                type: 'delete',
                async: false,
                headers: {
                    "Authorization": "Bearer "+ sessionStorage.access_token,
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                beforeSend: function(){
                    console.log("Borrando Grupo");
                },
                success: function(response){
                    console.log("Grupo borrado");
                    //console.log(response);
                    // Cargar lista de grupos
                    getGroupList();
                },
                error: function (response){
                    console.log("Error");
                    //console.log(response);
                    // Cargar lista de grupos (REVISAR)
                    getGroupList();
                }

            });
        }
        else{
            // Mostrar el modal
            $('#delete_modal').modal('show');
            // Mostrar el contenido principal
            $('#main').show();
            // Esconder el spinner
            $('#spinner').hide();
        }

    }, 100);

}

function createGroup(){     // Esta función crea un grupo

    // Esconder el modal
    $('#add_modal').modal('hide');
    // Esconder el contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();

    // Coger nombre del nuevo grupo
    var group = $('#roomSend').val();
    // URL para petición de crear grupo
    var url = URL_creategroup + group;

    setTimeout(function(){

    // Petición para crear un grupo
        $.ajax({

            url: url,
            type: 'post',
            async: false,
            headers: {
                "Authorization": "Bearer "+ sessionStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            beforeSend: function(){
                console.log("Creando Grupo");
            },
            success: function(response){
                console.log("Grupo creado");
                //console.log(response);
                // Cargar lista de grupos
                getGroupList();
            },
            error: function (response){
                console.log("Error");
                //console.log(response);
                // Cargar lista de grupos
                getGroupList();
            }

        });

    }, 100);

}

function getGroupList(){        // Esta función obtiene la lista de grupos

    // Petición para obtener listas de grupos
    $.ajax({

        url: URL_getgrouplist,
        type: 'get',
        async: false,
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            //console.log("Pidiendo Grupos");
        },
        success: function(response){
            //console.log("Grupos obtenidos");
            //console.log(response);
            // Comprobación de la cantidad de grupos obtenidos
            if(response.length > 0){
                // Vaciamos la lista de grupos
                $('#groupList').empty();
                // Vaciamos selector de canal del modal borrar grupo
                $('#group_select').empty();
                $('#group_select2').empty();

                // Crear elemento para modal de borrar grupo
                var defaultItem = document.createElement("option");
                defaultItem.innerText = "Escoge la habitación...";
                defaultItem.value = "none";
                defaultItem.selected = true;

                var defaultItem2 = document.createElement("option");
                defaultItem2.innerText = "Escoge cuál borrar...";
                defaultItem2.value = "none";
                defaultItem2.selected = true;

                // Meter elemento al modal de borrar grupo
                
                $('#group_select').append(defaultItem);
                $('#group_select2').append(defaultItem2);

                // Para cada grupo crear elemento para la lista de grupos y para el modal de borrar grupo
                for(i = 0 ; i < response.length ; i++){

                    // Crear elemento para lista de grupos
                    var newItemBtn = document.createElement("button");
                    newItemBtn.className = "btn text-white";
                    newItemBtn.style = "background-color: #828282;";
                    newItemBtn.innerText = response[i].group;
                    newItemBtn.setAttribute('onclick', "openCollapse('"+ response[i].group +"')");

                    // Meter elemento en la lista de grupos
                    $('#groupList').append(newItemBtn);

                    // Crear elemento para modal de borrar grupo
                    var newItem = document.createElement("option");
                    newItem.innerText = response[i].group;
                    newItem.value = response[i].group;

                    var newItem2 = document.createElement("option");
                    newItem2.innerText = response[i].group;
                    newItem2.value = response[i].group;

                    // Meter elemento en modal de borrar grupo
                    $('#group_select').append(newItem);
                    $('#group_select2').append(newItem2);

                    var newCollapse = document.createElement("div");
                    newCollapse.className = "collapse";
                    newCollapse.style = "width: 100%";
                    newCollapse.setAttribute('id', response[i].group +"content");

                    // Crear elemento por defecto
                    var newItem = document.createElement("button");
                    newItem.className = "btn text-white";
                    newItem.style = "background-color: #A5A5A5";
                    newItem.innerText = "No hay dispositivos en esta habitación";

                    newCollapse.append(newItem);
                    $('#groupList').append(newCollapse);

                }
            }
            else{
                // Como no hay grupos, colocamos un aviso
                // Creamos elemento para introducir, con su clase, estilo y el mensaje
                var newItem = document.createElement("div");
                newItem.className = "text-white";
                newItem.style = "background-color: #828282";
                newItem.innerText = "No hay habitaciones";

                // Meter aviso en la lista de grupos
                $('#groupList').append(newItem);
            }
        },
        error: function (response){
            console.log("Error");
            //console.log(response);
        }

    });

    if(firstTime != true){
        // Esconder spinner
        $('#spinner').hide();
        // Mostrar contenido principal
        $('#main').show();
    }
    else{
        firstTime = false;
    }

}

function openCollapse(group){

    // Cerrar cualquier collapse abierto
    $('.collapse').collapse('hide');

    // Si no está abierto el collapse que vamos a abrir
    if(sessionStorage.getItem('collapseOpen') !== group){

        // PEDIR ESTADOS EN EL MOMENTO DE VER EL PANEL
        // FALTARIA AÑADIR LA ACTUALIZACION DE LOS ESTADOS DE MANERA CONTINUA

        // Guardar la nueva información
        sessionStorage.setItem('collapseOpen', group);
        // Abrir collapse nuevo
        $("#"+ group+ "content").collapse('show');

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

    setTimeout(function(){

        // Envío de orden al canal
        sendCommand("ungroup", reciever);

        var cycle = 0;
        var result = "";
        var answer = "error";
        var infoGet = false;
        var time = new Date();
        var now = time.getTime();

        while(cycle < 15){

            result = getResponse(reciever);
            result = JSON.parse(result.responseText);

            for(i = 0 ; i < result.length ; i++){

                if((now - result[i].time * 1000) < 10000){
                    resultSplit = result[i].message.split("|");
                    if(resultSplit[0] == "ok"){
                        if(resultSplit[1] == reciever){

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

        // Para respuesta positiva
        if(answer == "ok"){
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

    }, 100);

}

function getChannels(){

    // Petición para obtener listas de grupos completos con sus canales
    $.ajax({

        url: URL_getfullgroups,
        type: 'get',
        async: false,
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            //console.log("Pidiendo Grupos Completos");
        },
        success: function(response){
            //console.log("Grupos obtenidos");
            //console.log(response);
            // Comprobación de la cantidad de grupos obtenidos
            if(response.length > 0){

                for(i = 0 ; i < response.length ; i++){

                    $('#'+ response[i].group +'content').empty();

                    for(j = 0 ; j < response[i].channels.length ; j++){
                        
                        var container = document.createElement("div");
                        container.className = "btn-group";
                        container.style = "width: 100%";

                        // Botón del canal
                        var channelButton = document.createElement("button");
                        channelButton.className = "btn text-white";
                        channelButton.style = "background-color: #A5A5A5; width: 75%";
                        channelButton.setAttribute('id', response[i].channels[j].channel +'Button');
                        channelButton.innerText = response[i].channels[j].channel;

                        // Botón para eliminar canal
                        var ejectButton = document.createElement("button");
                        ejectButton.className = "btn";
                        ejectButton.style = "background-color: #A5A5A5; width: 25%";
                        ejectButton.setAttribute('id', response[i].channels[j].channel +'Eject');
                        ejectButton.setAttribute('onclick', 'ejectChannel("'+ response[i].channels[j].channel +'")');

                        // Icono del botón de eliminar canal
                        var icon = document.createElement("i");
                        icon.className = "material-icons md-36 md-light align-middle";
                        icon.innerText = "clear";

                        ejectButton.append(icon);
                        container.append(channelButton);
                        container.append(ejectButton);

                        $('#'+ response[i].group +'content').append(container);

                    }

                }
            }
            // Esconder spinner
            $('#spinner').hide();
            // Mostrar contenido principal
            $('#main').show();
        },
        error: function (response){
            console.log("Error");
            //console.log(response);
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
            $('#spinner').hide();
            $('#main').show();
            $('#channel_modal').modal('show');
        },
        error: function (response){
            console.log("Error");
            console.log(response);
        }

    });

}

function addChannelToGroup(){

    // Obtener canal a añadir al grupo
    var reciever = $('#channel_select option:selected').attr('value');
    var group = $('#group_select option:selected').attr('value');

    // Comprobación de canal válido
    if((reciever !== "none") && (group !== "none")){
        // Esconder contenido principal
        $('#main').hide();
        // Mostrar spinner
        $('#spinner').show();
        // Esconder modal
        $('#channel_modal').modal('hide');

        setTimeout(function(){

            // Envío de comando de suscripción del canal al grupo
            sendCommand("subgroup", reciever, group);

            var cycle = 0;
            var result = "";
            var answer = "error";
            var infoGet = false;
            var time = new Date();
            var now = time.getTime();

            while(cycle < 15){

                result = getResponse(reciever);
                result = JSON.parse(result.responseText);

                for(i = 0 ; i < result.length ; i++){

                    if((now - result[i].time * 1000) < 10000){
                        resultSplit = result[i].message.split("|");
                        if(resultSplit[0] == "ok"){
                            if(resultSplit[1] == reciever){

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

            // Para respuesta positiva
            if(answer == "ok"){
                    // Obtener canales del grupo tras la operación
                    getChannels();
                    // Mostrar mensaje de éxito
                    showToast("Dispositivo añadido a la habitación :)");
            }
            // Para respuesta negativa
            else{
                // Mostrar mensaje de error
                showToast("No se ha podido añadir el dispositivo a la habitación :(");
                // Mostrar contenido principal
                $('#main').show();
                // Esconder spinner
                $('#spinner').hide();
            }
    
        }, 100);

    }
    
}

$(function () {

    // Esconder contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();

    setTimeout(function(){
        // Obtener lista de grupos
        getGroupList();
        getChannels();
    }, 100);

    // Acción para el botón para abrir modal para añadir canales
    $('#addChannelButton').on('click', function(){
        // Esconder contenido principal
        $('#main').hide();
        // Mostrar spinner
        $('#spinner').show();

        setTimeout(function(){
            getFreeChannels();
        }, 100);

    });

    // Acción para el botón para abrir modal para añadir grupos
    $('#addButton').on('click', function(){
        $('input[id="roomSend"]').val("");
        $('#add_modal').modal('show');
    });

    // Acción para el botón para abrir modal para eliminar grupos
    $('#deleteButton').on('click', function(){
        $('#delete_modal').modal('show');
    });

    // Acción para el botón de crear grupos
    $('#addChannel').on('click', function(){
        addChannelToGroup();
    });

    // Acción para el botón de crear grupos
    $('#createGroup').on('click', function(){
        createGroup();
    });

    // Acción para el botón  de eliminar grupos
    $('#deleteGroup').on('click', function(){
        deleteGroup();
    });

});