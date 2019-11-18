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
 *  -> numberofmessagestoget: The number of messages to get with the method getResponse (recommend 2-5).
 *  -> getfreechannels: The URL to the endpoint of the API to get the free channels of the user.
 *  -> sendmessage: The URL to the endpoint of the API to send a message to a channel.
 *  -> getmessages: The URL to the endpoint of the API to get the last messages of a channel.
 *  -> getchannels: The URL to the endpoint of the API to get the list of channels.
 *  -> createchannel: The URL to the endpoint of the API to create a channel.
 *  -> deletechannel: The URL to the endpoint of the API to delete a channel.
 * 
 *  METHODS:
 * 
 *  --> getChannels: Returns a list with all channels.
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK: an array with the channels/false -- RETURNS: true/false.
 * 
 *  --> createChannel: Create a new channel in the system.
 *      NEEDS: name of the new channel, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> deleteChannel: Delete a channel from the system.
 *      NEEDS: name of the channel to delete, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> getFreeChannels: Returns a list with all FREE channels.
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK:: an array with the free channels/false -- RETURNS: true/false.
 * 
 *  --> addChannelToGroup: Order a client to suscribe to a group.
 *      NEEDS: channel to include, group where include, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> ejectChannel: Order a channel to delete the suscription to his group.
 *      NEEDS: channel to eject, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> sendCommand: Send an order to a client with the require data.
 *      NEEDS: order to send, channel to send the order, extra-data with some orders, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> getResponse: Ask for the last channel messages.
 *      NEEDS: channel where the last order was sent, function to be execute when complete -- GIVEN TO CALLBACK:: an array with the last messages of the channel/false -- RETURNS: true/false.
 * 
 */

export class channelController {



    /*
     *
     *  Contructor of the class
     *
     */

    constructor(data) {

        if(typeof data !== 'object')
            return {error: 'Trying to construct wihtout a config array'};

        if(typeof data.numberofmessagestoget !== 'number')
            return {error: 'numberofmessagestoget is not a number'};

        if(typeof data.getfreechannels !== 'string')
            return {error: 'getfreechannels URL is not a string'};

        let URL_pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi;

        if(data.getfreechannels.match(URL_pattern) === null)
            return {error: 'getfreechannles URL does not seem to be a real URL'};

        if(typeof data.sendmessage !== 'string')
            return {error: 'sendmessage URL is not a string'};

        if(data.sendmessage.match(URL_pattern) === null)
            return {error: 'sendmessage URL does not seem to be a real URL'};

        if(typeof data.getmessages !== 'string')
            return {error: 'getmessages URL is not a string'};

        if(data.getmessages.match(URL_pattern) === null)
            return {error: 'getmessages URL does not seem to be a real URL'};

        if(typeof data.addchanneltogroup !== 'string')
            return {error: 'addchanneltogroup URL is not a string'};

        if(data.addchanneltogroup.match(URL_pattern) === null)
            return {error: 'addchanneltogroup URL does not seem to be a real URL'};

        if(typeof data.deletechannelfromgroup !== 'string')
            return {error: 'deletechanneltogroup URL is not a string'};

        if(data.deletechannelfromgroup.match(URL_pattern) === null)
            return {error: 'deletechanneltogroup URL does not seem to be a real URL'};

        if(typeof data.getchannels !== 'string')
            return {error: 'getchannels URL is not a string'};

        if(data.getchannels.match(URL_pattern) === null)
            return {error: 'getchannels URL does not seem to be a real URL'};

        if(typeof data.createchannel !== 'string')
            return {error: 'createchannel URL is not a string'};

        if(data.createchannel.match(URL_pattern) === null)
            return {error: 'createchannel URL does not seem to be a real URL'};

        if(typeof data.deletechannel !== 'string')
            return {error: 'deletechannel URL is not a string'};

        if(data.deletechannel.match(URL_pattern) === null)
            return {error: 'deletechannel URL does not seem to be a real URL'};

        this.nummessages = data.numberofmessagestoget;
        this.URL_getfreechannels = data.getfreechannels;
        this.URL_sendmessage = data.sendmessage;
        this.URL_getmessages = data.getmessages;
        this.URL_addchanneltogroup = data.addchanneltogroup;
        this.URL_deletechannelfromgroup = data.deletechannelfromgroup;
        this.URL_getchannels = data.getchannels;
        this.URL_createchannel = data.createchannel;
        this.URL_deletechannel = data.deletechannel;

    }



    /*
     *
     *  Method to get a list of channels
     *
     */

    getChannels = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getchannels,
            type: 'get',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo canales");

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

        return true;

    }



    /*
     *
     *  Method to create a new channel
     *
     */

    createChannel = function ( channel, callback ) {

        if(typeof channel !== 'string')
            return false;

        if(channel.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        let url = this.URL_createchannel + channel;

        $.ajax({

            url: url,
            type: 'post',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Creando canal "+ channel);

            },
            success: function(response){

                console.log("===> Canales creado");
                callback(true);
            },
            error: function (response){

                console.log("===> [Error]");
                callback(false);
            }

        });

        return true;

    }



    /*
     *
     *  Method to delete a channel
     *
     */

    deleteChannel = function ( channel, callback ) {

        if(typeof channel !== 'string')
            return false;

        if(channel.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        let url = this.URL_deletechannel + channel;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Borrando canal "+ channel);

            },
            success: function(response){

                console.log("===> Canales borrado");
                callback(true);
            },
            error: function (response){

                console.log("===> [Error]");
                callback(false);
            }

        });

        return true;

    }



    /*
     *
     *  Method to get a list of the free channels
     *
     */

    getFreeChannels = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getfreechannels,
            type: 'get',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
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

        return true;

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

                "Authorization": "Bearer "+ localStorage.access_token,
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

        return true;
    
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

        var url = this.URL_deletechannelfromgroup + channel;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
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

        return true;

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

        var url = this.URL_getmessages + channel + "/" + this.nummessages;
    
        $.ajax({
    
            url: url,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
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

        return true;

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

                return false;

        }

        if(message != ""){

            var url = this.URL_sendmessage + channel;
            message = "{\"message\":\""+ message +"\"}";
    
            $.ajax({
    
                url: url,
                type: 'post',
                headers: {

                    "Authorization": "Bearer "+ localStorage.access_token,
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

            return true;
    
        }

    }

}