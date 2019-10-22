var interval;
var num = 0;

window.showToast = function (msg){

    let theAlert =
        '<div id="toast" class="alert alert-dismissible fade show m-2" role="alert" style="background-color: #8285A0 !important; color: white !important;">'+
            msg +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<i class="material-icons md-light md-18 align-middle">close</i>'+
            '</button>'+
        '</div>';

    $('#toastWrapper').append(theAlert);

    $('div[class~="alert"][id^="toast"]').hide().show('fast', 'linear');

    window.setTimeout(function() {

        $('div[class~="alert"][id^="toast"]').fadeTo(250, 0).slideUp(250, function(){
            $(this).remove(); 
        });

    }, 3000);

}

window.mountcollapse = function(model, channel){

    $('#channel'+ channel +'panel').load("/models/"+ model +".model.html");

}

window.sendCommand = function (command, reciever, data="none"){
    
    //console.log("COMANDO: "+ command);
    
    switch(command){

        case "getinfo":

            //console.log("Entra en GETINFO");
            var result = "info "+ reciever +" enchufe4 0 1 luz de la entrada";
            return result;

        case "getstate":

            //console.log("Entra en GETSTATE");
            var result = "states "+ reciever +" output1 0 output2 1 output3 1 output4 1";
            return result;

        case "getrels":

            //console.log("Entra en GETRELS");
            return "norels "+ reciever;

        case "newdesc":

            //console.log("Entra en NEWDESC");
            return "ok "+ reciever;

        case "subgroup":

            //console.log("Entra en SUBGROUP");
            var url = "https://broker.dalher.net/v5/channels/link/"+ reciever +"/"+ data;

            $.ajax({

                url: url,
                type: 'post',
                headers: {
                    "Authorization": "Bearer "+ sessionStorage.access_token,
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                beforeSend: function(){
                   //console.log("Suscribir a grupo "+ reciever);
                },
                error: function(response){
                    console.log(response);
                }
        
            }).done(function(){

                sessionStorage.setItem('response', "ok "+ reciever);

            });

            break;

        case "ungroup":

            //console.log("Entra en UNGROUP");
            var url = "https://broker.dalher.net/v5/channels/link/"+ reciever;

            $.ajax({

                url: url,
                type: 'delete',
                headers: {
                    "Authorization": "Bearer "+ sessionStorage.access_token,
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                beforeSend: function(){
                    //console.log("Desuscribir a grupo "+ reciever);
                },
                error: function(response){
                    console.log(response);
                }
        
            }).done(function(){

                sessionStorage.setItem('response', "ok "+ reciever);
                
            });

            break;

        case "relpins":

            //console.log("Entra en RELPINS");
            return "ok "+ reciever;

        case "unrelpins":

            //console.log("Entra en UNRELPINS");
            return "ok "+ reciever;

        case "changepinstate":

            //console.log("Entra en CHANGEPINSTATE");
            return "ok "+ reciever;

        default:

            //console.log("Entra en NINGUNA");
            return "[X]";

    }

}