// Importing external libraries
import * as jwt_md from './node_modules/jwt-decode/build/jwt-decode.min.js';

// Importing custom libraries
import * as index_md from './modules/index.js';
import * as oauth2_md from './modules/oauth2.js';
import * as login_md from './modules/login.js';
import * as app_md from './modules/app.js';
import * as group_md from './modules/groups.js';
import * as device_md from './modules/devices.js';




/* *
 *
 * Index Library
 * Initialize this module
 * 
 * */
window.index = new index_md.index();



/* *
 *
 * OAuth 2 Library
 * Initialize this module
 * 
 * */
let oauthConfig = {

    auth_uri: "http://accounts.dalher.net/oauth/authorize",
    client_id: "14",
    redirect_uri: "http://adaptative.dalher.net/?g=gimme",
    scope: "broker_r broker_w broker_d"

};

window.oauth = new oauth2_md.oauthController(oauthConfig);



/* *
 *
 * Login Library
 * Initialize this module
 * 
 * */
window.login = new login_md.loginController();



/* *
 *
 * App Library
 * Initialize this module
 * 
 * */
window.app = new app_md.appController();



/* *
 *
 * Groups Library
 * Initialize this module
 * 
 * */
let groupConfig = {
   
    numberofmessagestoget: 3,
    getgrouplist: "http://broker.dalher.net/v1/groups/list",
    creategroup: "http://broker.dalher.net/v1/groups/",
    deletegroup: "http://broker.dalher.net/v1/groups/",
    getmessages: "http://broker.dalher.net/v1/groups/messages/",
    getrelatedgroups: "http://broker.dalher.net/v1/groups/list/related",
    getfullgroups: "http://broker.dalher.net/v1/groups/list/full",
    getfullgroupwithinfo: "http://broker.dalher.net/v1/group/list/related/"

};

window.group = new group_md.groupController(groupConfig);



/* *
 *
 * Groups Library
 * Initialize this module
 * 
 * */
let deviceConfig = {

    numberofmessagestoget: 3,
    getfreedevices: "http://broker.dalher.net/v1/devices/list/free",
    sendmessage: "http://broker.dalher.net/v1/devices/message/",
    getmessages: "http://broker.dalher.net/v1/devices/messages/",
    getdevices: "http://broker.dalher.net/v1/devices/list",
    createdevice: "http://broker.dalher.net/v1/devices/",
    deletedevice: "http://broker.dalher.net/v1/devices/",
    adddevicetogroup: "http://broker.dalher.net/v1/devices/relation/",
    deletedevicefromgroup:  "http://broker.dalher.net/v1/devices/relation/",
    changeprofile: "http://broker.dalher.net/v1/devices/profile/",
    savemapcoords: "http://broker.dalher.net/v1/devices/relation/coordinates/"

}

window.device = new device_md.deviceController(deviceConfig);



/* *
 *
 * Index Actions
 * Call the module with its actions
 * 
 * */
window.uriParams     = index.getAllUrlParams(window.location.href);

$(function () {	
    
    // Define the default module in case of error
    let defModule     = 'login';

    // Define wich modules are not callable
    let excludedFiles = [
        'index'
    ];

    let currModule    = null;

    

    // Controller for beginning ajax calls
    $( document ).ajaxStart(function() {

        app.spinner('show');
    });

    // Controller for finishing ajax calls
    $( document ).ajaxStop(function() {

        app.spinner('hide');
    });



    // Define the spinner type
    app.spinnerType = 'page';

    $.get(uriParams.g + '.g')
    .done(function() {

        currModule = uriParams.g;

        if( $.inArray(currModule, excludedFiles) !== -1 ){
            currModule = defModule;
        }
        
    })
    .fail(function() { 
        currModule = defModule;
    })
    .always(function(){

        // Define the spinner type
        app.spinnerType = 'page';

        $("#index-wrapper").load(currModule + '.g', function(){

            // Define the spinner type
            app.spinnerType = 'page';

            $.getScript('libs/js/actions/' + currModule + '.js')
            .done(function() {})
            .fail(function(){
                console.warn('LOG: No actions needed');
            });

        });

    });


    

});































/*


var interval;   // Variable para almacenar intervalos generados en el JavaScript de distintos módulos
var brokerVersion = "v1";   // Versión del broker
var accountsVersion = "v1"; // Versión del oauth + sign + etc

var URL_authorization = "http://accounts.dalher.net/oauth/"+ accountsVersion +"/token?flow=password";
var URL_refreshToken = "http://accounts.dalher.net/oauth/"+ accountsVersion +"/token?flow=refresh";

var URL_deletegroup = "https://broker.dalher.net/"+ brokerVersion +"/groups/";
var URL_creategroup = "https://broker.dalher.net/"+ brokerVersion +"/groups/";
var URL_getgrouplist = "https://broker.dalher.net/"+ brokerVersion +"/groups/list";
var URL_getfullgroups = "https://broker.dalher.net/"+ brokerVersion +"/groups/lists";
var URL_getfreedevices = "https://broker.dalher.net/"+ brokerVersion +"/devices/list/free";
var URL_sendmessage = "https://broker.dalher.net/"+ brokerVersion +"/devices/message/";

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

    var url = "https://broker.dalher.net/v5/devices/messages/" + reciever + "/5";
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

        var url = "https://broker.dalher.net/"+ brokerVersion +"/devices/message/" + reciever;
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

window.prepareToModel = function(model, device, states){

    if(model == "bombilla"){

        $('#bombillaIcon').attr('id', device +"output1");
        $('#'+ device +"output1").parent().attr('onclick', "change(\""+ device +"\", \"output1\");");


        if(states[3] == "0"){
            $('#'+ device +"output1").empty();
            $('#'+ device +"output1").append("star_border");
        }
        if(states[3] == "1"){
            $('#'+ device +'output1').empty();
            $('#'+ device +'output1').append("star");
        }

    }

    if(model == "multiple4"){

        $('#multiple1Icon').attr('id', device +"output1");
        $('#multiple2Icon').attr('id', device +"output2");
        $('#multiple3Icon').attr('id', device +"output3");
        $('#multiple4Icon').attr('id', device +"output4");
        $('#'+ device +"output1").parent().attr('onclick', "change(\""+ device +"\", \"output1\");");
        $('#'+ device +"output2").parent().attr('onclick', "change(\""+ device +"\", \"output2\");");
        $('#'+ device +"output3").parent().attr('onclick', "change(\""+ device +"\", \"output3\");");
        $('#'+ device +"output4").parent().attr('onclick', "change(\""+ device +"\", \"output4\");");


        if(states[3] == "0"){
            $('#'+ device +"output1").empty();
            $('#'+ device +"output1").append("star_border");
        }
        if(states[3] == "1"){
            $('#'+ device +'output1').empty();
            $('#'+ device +'output1').append("star");
        }

        if(states[5] == "0"){
            $('#'+ device +"output2").empty();
            $('#'+ device +"output2").append("star_border");
        }
        if(states[5] == "1"){
            $('#'+ device +'output2').empty();
            $('#'+ device +'output2').append("star");
        }

        if(states[7] == "0"){
            $('#'+ device +"output3").empty();
            $('#'+ device +"output3").append("star_border");
        }
        if(states[7] == "1"){
            $('#'+ device +'output3').empty();
            $('#'+ device +'output3').append("star");
        }

        if(states[9] == "0"){
            $('#'+ device +"output4").empty();
            $('#'+ device +"output4").append("star_border");
        }
        if(states[9] == "1"){
            $('#'+ device +'output4').empty();
            $('#'+ device +'output4').append("star");
        }

    }

}

*/