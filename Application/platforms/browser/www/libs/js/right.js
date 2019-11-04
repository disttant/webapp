function openGroup(group){      // Esta función abre el módulo Group

    $('#main').hide();
    $('#spinner').show();
    // Guardar grupo que se abre
    sessionStorage.setItem('group', group);

    setTimeout(function(){

        // Cargar módulo Group
        $('#content').load("map.mod.html");

    }, 100);

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
                    newItem.style = "background-color: #828282";
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
                newItem.style = "background-color: #828282";
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

});