var interval;   // Variable para almacenar intervalos generados en el JavaScript de distintos módulos
var brokerVersion = "v1";   // Versión del broker
var accountsVersion = "v1"; // Versión del oauth + sign + etc

var URL_authorization = "http://accounts.dalher.net/oauth/"+ accountsVersion +"/token?flow=password";
var URL_refreshToken = "http://accounts.dalher.net/oauth/"+ accountsVersion +"/token?flow=refresh";

var URL_deletegroup = "https://broker.dalher.net/"+ brokerVersion +"/groups/";
var URL_creategroup = "https://broker.dalher.net/"+ brokerVersion +"/groups/";
var URL_getgrouplist = "https://broker.dalher.net/"+ brokerVersion +"/groups/list";
var URL_getfullgroups = "https://broker.dalher.net/"+ brokerVersion +"/groups/lists";
var URL_getfreechannels = "https://broker.dalher.net/"+ brokerVersion +"/channels/list/free";
var URL_sendmessage = "https://broker.dalher.net/"+ brokerVersion +"/channels/message/";

window.showToast = function (msg){      // Esta función global genera y muestra un Toast

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

window.getResponse = function (reciever){

    var url = "https://broker.dalher.net/v5/channels/messages/" + reciever + "/5";
    var result = "no result";

    return $.ajax({

        url: url,
        type: 'get',
        async: false,
        headers: {
            "Authorization": "Bearer "+ sessionStorage.access_token,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        success: function(response){
            //console.log("Mensajes obtenidos");
            //console.log(response);                
        },
        error: function (response){
            console.log("Error");
            console.log(response);
            result = "error";
        }

    });

}

window.sendCommand = function (command, reciever, data="none"){     // Esta función envía un mensaje a un canal y devuelve su respuesta

    var message = "";

    switch(command){

        case "getinfo":

            message = reciever +"|getinfo";
            break;

        case "getstate":

            message = reciever +"|getstate";
            break;

        case "getrels":

            message = reciever +"|getrels";
            break;

        case "newdesc":

            message = reciever +"|newdesc|"+ data;
            break;

        case "subgroup":

            message = reciever +"|subgroup|"+ data;
            break;

        case "ungroup":

            message = reciever +"|ungroup";
            break;

        case "relpins":

            message = reciever +"|relpins|"+ data;
            break;

        case "unrelpins":

            message = reciever +"|unrelpins|"+ data;
            break;

        case "changepinstate":

            message = reciever +"|changepinstate|"+ data;
            break;

        default:

            break;

    }

    if(message != ""){

        var url = "https://broker.dalher.net/"+ brokerVersion +"/channels/message/" + reciever;
        message = "{\"message\":\""+ message +"\"}";

        return $.ajax({

            url: url,
            type: 'post',
            headers: {
                "Authorization": "Bearer "+ sessionStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            data: message,
            success: function(response){
                console.log("Mensaje enviado");
                //console.log(response);
            },
            error: function (response){
                console.log("Error");
                //console.log(response);
            }

        });

    }

}

window.openmenu = function(icon){

    if(icon == "left"){

        $('#leftIcon').addClass("md-light").removeClass("md-dark");
        $('#centerIcon').addClass("md-dark").removeClass("md-light");
        $('#rightIcon').addClass("md-dark").removeClass("md-light");

    }

    if(icon == "center"){

        $('#centerIcon').addClass("md-light").removeClass("md-dark");
        $('#leftIcon').addClass("md-dark").removeClass("md-light");
        $('#rightIcon').addClass("md-dark").removeClass("md-light");

    }

    if(icon == "right"){

        $('#rightIcon').addClass("md-light").removeClass("md-dark");
        $('#centerIcon').addClass("md-dark").removeClass("md-light");
        $('#leftIcon').addClass("md-dark").removeClass("md-light");

    }

}

window.prepareToModel = function(model, channel, states){

    if(model == "bombilla"){

        $('#bombillaIcon').attr('id', channel +"output1");
        $('#'+ channel +"output1").parent().attr('onclick', "change(\""+ channel +"\", \"output1\");");


        if(states[3] == "0"){
            $('#'+ channel +"output1").empty();
            $('#'+ channel +"output1").append("star_border");
        }
        if(states[3] == "1"){
            $('#'+ channel +'output1').empty();
            $('#'+ channel +'output1').append("star");
        }

    }

    if(model == "multiple4"){

        $('#multiple1Icon').attr('id', channel +"output1");
        $('#multiple2Icon').attr('id', channel +"output2");
        $('#multiple3Icon').attr('id', channel +"output3");
        $('#multiple4Icon').attr('id', channel +"output4");
        $('#'+ channel +"output1").parent().attr('onclick', "change(\""+ channel +"\", \"output1\");");
        $('#'+ channel +"output2").parent().attr('onclick', "change(\""+ channel +"\", \"output2\");");
        $('#'+ channel +"output3").parent().attr('onclick', "change(\""+ channel +"\", \"output3\");");
        $('#'+ channel +"output4").parent().attr('onclick', "change(\""+ channel +"\", \"output4\");");


        if(states[3] == "0"){
            $('#'+ channel +"output1").empty();
            $('#'+ channel +"output1").append("star_border");
        }
        if(states[3] == "1"){
            $('#'+ channel +'output1').empty();
            $('#'+ channel +'output1').append("star");
        }

        if(states[5] == "0"){
            $('#'+ channel +"output2").empty();
            $('#'+ channel +"output2").append("star_border");
        }
        if(states[5] == "1"){
            $('#'+ channel +'output2').empty();
            $('#'+ channel +'output2').append("star");
        }

        if(states[7] == "0"){
            $('#'+ channel +"output3").empty();
            $('#'+ channel +"output3").append("star_border");
        }
        if(states[7] == "1"){
            $('#'+ channel +'output3').empty();
            $('#'+ channel +'output3').append("star");
        }

        if(states[9] == "0"){
            $('#'+ channel +"output4").empty();
            $('#'+ channel +"output4").append("star_border");
        }
        if(states[9] == "1"){
            $('#'+ channel +'output4').empty();
            $('#'+ channel +'output4').append("star");
        }

    }

}