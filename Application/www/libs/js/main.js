function openGroup(group){      // Esta función abre el módulo Group

    // Guardar grupo que se abre
    sessionStorage.setItem('group', group);
    // Cargar módulo Group
    $('#content').load("group.mod.html");

}

function deleteGroup(){     // Esta función elimina un grupo

    // Coger el grupo escogido para eliminar
    var group = $('#channel_select option:selected').attr('value');

    // Comprobar que se escogió un grupo válido
    if(group !== "none"){
        // URL para petición de borrar grupo
        var url = URL_deletegroup + group;

        // Petición para borrar grupo
        $.ajax({

            url: url,
            type: 'delete',
            headers: {
                "Authorization": "Bearer "+ sessionStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            beforeSend: function(){
                // Esconder el modal
                $('#delete_modal').modal('hide');
                // Esconder contenido principal
                $('#main').hide();
                // Mostrar spinner
                $('#spinner').show();
                console.log("Borrando Grupo");
            },
            success: function(response){
                console.log("Grupo borrado");
                //console.log(response);
                // Mostrar mensaje éxito
                showToast("Habitación eliminada :)");
                // Cargar lista de grupos
                getGroupList();
            },
            error: function (response){
                console.log("Error");
                //console.log(response);
                // Mostrar mensaje error
                showToast("No se pudo eliminar la habitación :(");
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

}

function createGroup(){     // Esta función crea un grupo

    // Coger nombre del nuevo grupo
    var group = $('#roomSend').val();
    // URL para petición de crear grupo
    var url = URL_creategroup + group;

    // Petición para crear un grupo
    $.ajax({

        url: url,
        type: 'post',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            // Esconder el modal
            $('#add_modal').modal('hide');
            // Esconder el contenido principal
            $('#main').hide();
            // Mostrar spinner
            $('#spinner').show();
            console.log("Creando Grupo");
        },
        success: function(response){
            console.log("Grupo creado");
            //console.log(response);
            // Mostrar mensaje de éxito
            showToast("Habitación creada :)");
            // Cargar lista de grupos
            getGroupList();
        },
        error: function (response){
            console.log("Error");
            //console.log(response);
            // Mostrar mensaje de error
            showToast("No se ha podido crear la habitación :(");
            // Cargar lista de grupos (REVISAR)
            getGroupList();
        }

    });

}

function getGroupList(){        // Esta función obtiene la lista de grupos

    // Petición para obtener listas de grupos
    $.ajax({

        url: URL_getgrouplist,
        type: 'get',
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
                $('#channel_select').empty();

                // Crear elemento para modal de borrar grupo
                var defaultItem = document.createElement("option");
                defaultItem.innerText = "Escoge cuál borrar...";
                defaultItem.value = "none";
                defaultItem.selected = true;

                // Meter elemento al modal de borrar grupo
                $('#channel_select').append(defaultItem);

                // Para cada grupo crear elemento para la lista de grupos y para el modal de borrar grupo
                for(i = 0 ; i < response.length ; i++){

                    // Crear elemento para lista de grupos
                    var newItem = document.createElement("button");
                    newItem.className = "btn text-white";
                    newItem.style = "background-color: #2D3047";
                    newItem.innerText = response[i].group;
                    newItem.setAttribute('onclick', 'openGroup("'+ response[i].group +'")');

                    // Meter elemento en la lista de grupos
                    $('#groupList').append(newItem);

                    // Crear elemento para modal de borrar grupo
                    var newItem = document.createElement("option");
                    newItem.innerText = response[i].group;
                    newItem.value = response[i].group;

                    // Meter elemento en modal de borrar grupo
                    $('#channel_select').append(newItem);

                }
            }
            else{
                // Como no hay grupos, colocamos un aviso
                // Creamos elemento para introducir, con su clase, estilo y el mensaje
                var newItem = document.createElement("button");
                newItem.className = "btn text-white";
                newItem.style = "background-color: #2D3047";
                newItem.innerText = "No hay habitaciones";

                // Meter aviso en la lista de grupos
                $('#groupList').append(newItem);
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

$(function () {

    // Esconder contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();

    // Acoplar nombre de usuario
    $('#user').append(sessionStorage.user_id);
    // Obtener lista de grupos
    getGroupList();

    // Acción para el botón Logout
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
    $('#createGroup').on('click', function(){
        createGroup();
    });

    // Acción para el botón  de eliminar grupos
    $('#deleteGroup').on('click', function(){
        deleteGroup();
    });

});