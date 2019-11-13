/*
 *  This class makes all ajax related with get channels lists, add/eject to/from
 *  a group.
 * 
 *  Kevin Machuca // kevin.mrosa96@gmail.com // 11-11-2019
 * 
 *  CONSTRUCTOR:
 * 
 *  Must be an array with the following data:
 * 
 *  -> access_token: A valid token to use in the ajax calls.
 *  -> numberofmessagestoget: The number of messages to get with the method getResponse (recommend 2-5).
 *  -> getfreechannels: The URL to the endpoint of the API to get the free channels of the user.
 *  -> sendmessage: The URL to the endpoint of the API to send a message to a channel.
 *  -> getmessages: The URL to the endpoint of the API to get the last messages of a channel.
 * 
 *  METHODS:
 * 
 *  --> getFreeChannels: Returns a list with all FREE channels.
 *      NEEDS: function to be execute when complete -- RETURNS: an array with the free channels.
 * 
 *  --> addChannelToGroup: Order a client to suscribe to a group.
 *      NEEDS: channel to include, group where include, function to be execute when complete -- RETURNS: ok/error.
 * 
 *  --> ejectChannel: Order a channel to delete the suscription to his group.
 *      NEEDS: channel to eject, function to be execute when complete -- RETURNS: ok/error.
 * 
 *  --> sendCommand: Send an order to a client with the require data.
 *      NEEDS: order to send, channel to send the order, extra-data with some orders, function to be execute when complete -- RETURNS: API response.
 * 
 *  --> getResponse: Ask for the last channel messages.
 *      NEEDS: channel where the last order was sent, function to be execute when complete -- RETURNS: an array with the last messages of the channel.
 * 
 */

export class channel {



    /*
     *
     *  Contructor of the class
     *
     */

    constructor(data) {

        if(typeof data !== 'object')
            return {error: 'Trying to construct wihtout a config array'};

        if(typeof data.access_token !== 'string')
            return {error: 'access_token is not a string'};

        let decoded = '';

        try{
            decoded = jwt_decode(data.access_token); 
        }catch( ex ){  }

        if(typeof decoded !== 'object')
            return {error: 'access_token does not seem to be a real token'};

        if(typeof data.numberofmessagestoget !== 'number')
            return {error: 'numberofmessagestoget is not a number'};

        if(typeof data.getfreechannels !== 'string')
            return {error: 'getfreechannels URL is not a string'};

        if(data.getfreechannels.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getfreechannles URL does not seem to be a real URL'};

        if(typeof data.sendmessage !== 'string')
            return {error: 'sendmessage URL is not a string'};

        if(data.sendmessage.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'sendmessage URL does not seem to be a real URL'};

        if(typeof data.getmessages !== 'string')
            return {error: 'getmessages URL is not a string'};

        if(data.getmessages.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getmessages URL does not seem to be a real URL'};

        if(typeof data.addchanneltogroup !== 'string')
            return {error: 'addchanneltogroup URL is not a string'};

        if(data.addchanneltogroup.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'addchanneltogroup URL does not seem to be a real URL'};

        if(typeof data.deletechanneltogroup !== 'string')
            return {error: 'deletechanneltogroup URL is not a string'};

        if(data.deletechanneltogroup.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'deletechanneltogroup URL does not seem to be a real URL'};

        this.access_token = data.access_token;
        this.nummessages = data.numberofmessagestoget;
        this.URL_getfreechannels = data.getfreechannels;
        this.URL_sendmessage = data.sendmessage;
        this.URL_getmessages = data.getmessages;
        this.URL_addchanneltogroup = data.addchanneltogroup;
        this.URL_deletechanneltogroup = data.deletechanneltogroup;

    }



    /*
     *
     *  Method to get a list of the free channels
     *
     */

    getFreeChannels = function (callback) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getfreechannels,
            type: 'get',

            headers: {

                "Authorization": "Bearer "+ this.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo canales libres");

            },
            success: function(response){

                console.log("===> Canales obtenidos");
                callback(response);
            },
            error: function (response){

                console.log("===> [Error]");
                callback(false);
            }

        });

    }



    /*
     *
     *  Method to add a channel to a group
     *
     */

    addChannelToGroup = function ( channel, group, callback ) {

        if(typeof channel !== 'string')
            return false;

        if(channel.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof group !== 'string')
            return false;

        if(group.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_addchanneltogroup + channel + "/" + group;

        $.ajax({

            url: url,
            type: 'post',

            headers: {

                "Authorization": "Bearer "+ this.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo a "+ channel +" que se suscriba a "+ group);

            },
            success: function(response){

                console.log("===> Canal suscrito");
                callback(true);
            },
            error: function (response){

                console.log("===> [Error]");
                callback(false);
            }

        });
    
    }



    /*
     *
     *  Method to eject a channel from his group
     *
     */

    ejectChannel = function ( channel, callback ) {

        if(typeof channel !== 'string')
            return false;

        if(channel.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_deletechanneltogroup + channel;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization": "Bearer "+ this.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo a "+ channel +" que se desuscriba");

            },
            success: function(response){

                console.log("===> Canal desuscrito");
                callback(true);
            },
            error: function (response){

                console.log("===> [Error]");
                callback(false);
            }

        });

    }



    /*
     *
     *  Method to ask for the last messages of a channel
     *
     */

    getResponse = function ( channel, callback ){

        if(typeof channel !== 'string')
            return false;

        if(channel.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_getmessages + channel + this.nummessages;
    
        $.ajax({
    
            url: url,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ this.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo mensajes")

            },
            success: function(response){

                console.log("===> Mensajes obtenidos");
                callback(response);

            },
            error: function (response){

                console.warn("===> [Error]");
                callback(false);

            }
    
        });

    }



    /*
     *
     *  Method to send a command to a channel
     *
     */

    sendCommand = function ( order, channel, callback, data='none' ) {

        if(typeof channel !== 'string')
            return false;

        if(channel.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof order !== 'string')
            return false;

        if(order.match(/^[a-z]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var message = "";

        switch(order){

            case "getinfo":

                message = channel +"|"+ order;
                break;

            case "getstate":

                message = channel +"|"+ order;
                break;

            case "getrels":

                message = channel +"|"+ order;
                break;

            case "newdesc":

                if(typeof data !== 'string')
                    return false;

                if(data !== 'none')
                    return false;

                if(data.match(/^[a-z0-9 ]+$/gi) === null)
                    return false;

                message = channel +"|"+ order +"|"+ data;
                break;

            case "subgroup":

                if(typeof data !== 'string')
                    return false;

                if(data !== 'none')
                    return false;

                if(data.match(/^[a-z0-9]+$/gi) === null)
                    return false;

                message = channel +"|"+ order +"|"+ data;
                break;

            case "ungroup":

                message = channel +"|"+ order;
                break;

            case "relpins":

                if(typeof data !== 'string')
                    return false;

                if(data !== 'none')
                    return false;

                if(data.match(/^[a-z0-9 ]+$/gi) === null)
                    return false;

                message = channel +"|"+ order +"|"+ data;
                break;

            case "unrelpins":

                if(typeof data !== 'string')
                    return false;

                if(data !== 'none')
                    return false;

                if(data.match(/^[a-z0-9 ]+$/gi) === null)
                    return false;

                message = channel +"|"+ order +"|"+ data;
                break;

            case "changepinstate":

                if(typeof data !== 'string')
                    return false;

                if(data !== 'none')
                    return false;

                if(data.match(/^[a-z0-9 ]+$/gi) === null)
                    return false;

                message = channel +"|"+ order +"|"+ data;
                break;

            default:

                break;

        }

        if(message != ""){

            var url = this.URL_sendmessage + channel;
            message = "{\"message\":\""+ message +"\"}";
    
            $.ajax({
    
                url: url,
                type: 'post',
                headers: {

                    "Authorization": "Bearer "+ this.access_token,
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"

                },
                data: message,
                beforeSend: function(){

                    console.log("======> Enviando mensaje");

                },
                success: function(response){

                    console.log("===> Mensaje enviado");
                    callback(true);

                },
                error: function (response){

                    console.warn("===> [Error]");
                    callback(false);

                }
    
            });
    
        }

    }

}