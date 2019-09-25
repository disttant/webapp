function openGroup(group){

    sessionStorage.setItem('group', group);
    $('#content').load("group.mod.html");

}

function deleteGroup(){

    var group = $('#channel_select option:selected').attr('value');
    if(group !== "none"){
        var url = "https://broker.dalher.net/v4/groups/"+ group;

        $.ajax({

            url: url,
            type: 'delete',
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
                $('#spinner').hide();
                $('#success_alert').show();
                setTimeout(function(){
                    $('#success_alert').hide();
                    $('#spinner').show();
                    getGroupList();
                }, 2000);
            },
            error: function (response){
                console.log("Error");
                console.log(response);
                $('#spinner').hide();
                $('#error_alert').show();
                setTimeout(function(){
                    $('#error_alert').hide();
                    $('#spinner').show();
                    getGroupList();
                }, 2000);
            }

        });
    }
    else{
        $('#delete_modal').modal('show');
        $('#main').show();
        $('#spinner').hide();
    }

}

function createGroup(){

    var group = $('#roomSend').val();
    var url = "https://broker.dalher.net/v4/groups/"+ group;

    $.ajax({

        url: url,
        type: 'post',
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
            $('#spinner').hide();
            $('#success_alert').show();
            setTimeout(function(){
                $('#success_alert').hide();
                $('#spinner').show();
                getGroupList();
            }, 2000);
        },
        error: function (response){
            console.log("Error");
            console.log(response);
            $('#spinner').hide();
            $('#error_alert').show();
            setTimeout(function(){
                $('#error_alert').hide();
                $('#spinner').show();
                getGroupList();
            }, 2000);
        }

    });

}

function getGroupList(){

    var url = "https://broker.dalher.net/v4/groups/list";

    $.ajax({

        url: url,
        type: 'get',
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        beforeSend: function(){
            console.log("Pidiendo Grupos");
        },
        success: function(response){
            console.log("Grupos obtenidos");
            //console.log(response);

            if(response.length > 0){
                $('#groupList').empty();
                $('#channel_select').empty();

                var defaultItem = document.createElement("option");
                defaultItem.innerText = "Escoge cuál borrar...";
                defaultItem.value = "none";
                defaultItem.selected = true;

                $('#channel_select').append(defaultItem);

                for(i = 0 ; i < response.length ; i++){

                    var newItem = document.createElement("button");
                    newItem.className = "btn text-white";
                    newItem.style = "background-color: #2D3047";
                    newItem.innerText = response[i].group;
                    newItem.setAttribute('onclick', 'openGroup("'+ response[i].group +'")');

                    $('#groupList').append(newItem);

                    var newItem = document.createElement("option");
                    newItem.innerText = response[i].group;
                    newItem.value = response[i].group;

                    $('#channel_select').append(newItem);

                }
            }
            else{
                var newItem = document.createElement("button");
                newItem.className = "btn text-white";
                newItem.style = "background-color: #2D3047";
                newItem.innerText = "No hay habitaciones";

                $('#groupList').append(newItem);
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

$(function () {

    $('#main').hide();
    $('#spinner').show();
    $('#success_alert').hide();
    $('#error_alert').hide();

    $('#user').append(sessionStorage.user_id);
    getGroupList();

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

    $('#addButton').on('click', function(){
        $('#add_modal').modal('show');
    });

    $('#deleteButton').on('click', function(){
        $('#delete_modal').modal('show');
    });

    $('#createGroup').on('click', function(){
        $('#add_modal').modal('hide');
        $('#main').hide();
        $('#spinner').show();
        createGroup();
    });

    $('#deleteGroup').on('click', function(){
        $('#delete_modal').modal('hide');
        $('#main').hide();
        $('#spinner').show();
        deleteGroup();
    });

});