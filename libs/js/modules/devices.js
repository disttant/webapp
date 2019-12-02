/*
 *  This class makes all ajax related with get devices lists, add/eject to/from
 *  a group.
 * 
 *  Kevin Machuca // kevin.mrosa96@gmail.com // 11-11-2019
 * 
 *  CONSTRUCTOR:
 * 
 *  Must be an array with the following data:
 * 
 *  -> numberofmessagestoget: The number of messages to get with the method getResponse (recommend 2-5).
 *  -> getfreedevices: The URL to the endpoint of the API to get the free devices of the user.
 *  -> sendmessage: The URL to the endpoint of the API to send a message to a device.
 *  -> getmessages: The URL to the endpoint of the API to get the last messages of a device.
 *  -> getdevices: The URL to the endpoint of the API to get the list of devices.
 *  -> createdevice: The URL to the endpoint of the API to create a device.
 *  -> deletedevice: The URL to the endpoint of the API to delete a device.
 *  -> changeprofile: The URL to the endpoint of the API to change profile data.linear-activity
 *  -> savemapcoords: The URL to the endpoint of the API to save the coords of the map position of a device into database
 *  -> numberofcyclesuntilgetout: The number of times to look for a response into the channel messages.
 * 
 *  METHODS:
 * 
 *  --> getDevices: Returns a list with all devices.
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK: an array with the devices/false -- RETURNS: true/false.
 * 
 *  --> createDevice: Create a new device in the system.
 *      NEEDS: name of the new device, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> deleteDevice: Delete a device from the system.
 *      NEEDS: name of the device to delete, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> getFreeDevices: Returns a list with all FREE devices.
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK:: an array with the free devices/false -- RETURNS: true/false.
 * 
 *  --> addDeviceToGroup: Order a client to suscribe to a group.
 *      NEEDS: device to include, group where include, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> ejectDevice: Order a device to delete the suscription to his group.
 *      NEEDS: device to eject, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> sendCommand: Send an order to a client with the require data.
 *      NEEDS: order to send, device to send the order, function to be execute when complete, extra-data with some orders(DEFAULT => 'NONE') -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> getResponse: Ask for the last device messages.
 *      NEEDS: device where the last order was sent, function to be execute when complete -- GIVEN TO CALLBACK:: an array with the last messages of the device/false -- RETURNS: true/false.
 *
 *  --> changeProfile: Change the information of the profile of a Device.
 *      NEEDS: device to change the profile info, function to be execute when complete, description to put into the profile, type of device to put into the profile -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 *  --> saveMapCoords: Save into device profile the coords of his position into the map.
 *      NEEDS: device to save the map coords, coord "x" of the map, coord "y" of the map, function to be execute when complete -- GIVEN TO CALLBACK: true/false -- RETURNS: true/false.
 * 
 */

export class deviceController {



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

        if(typeof data.getfreedevices !== 'string')
            return {error: 'getfreedevices URL is not a string'};

        let URL_pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi;

        if(data.getfreedevices.match(URL_pattern) === null)
            return {error: 'getfreedevices URL does not seem to be a real URL'};

        if(typeof data.sendmessage !== 'string')
            return {error: 'sendmessage URL is not a string'};

        if(data.sendmessage.match(URL_pattern) === null)
            return {error: 'sendmessage URL does not seem to be a real URL'};

        if(typeof data.getmessages !== 'string')
            return {error: 'getmessages URL is not a string'};

        if(data.getmessages.match(URL_pattern) === null)
            return {error: 'getmessages URL does not seem to be a real URL'};

        if(typeof data.adddevicetogroup !== 'string')
            return {error: 'adddevicetogroup URL is not a string'};

        if(data.adddevicetogroup.match(URL_pattern) === null)
            return {error: 'adddevicetogroup URL does not seem to be a real URL'};

        if(typeof data.deletedevicefromgroup !== 'string')
            return {error: 'deletedevicetogroup URL is not a string'};

        if(data.deletedevicefromgroup.match(URL_pattern) === null)
            return {error: 'deletedevicetogroup URL does not seem to be a real URL'};

        if(typeof data.getdevices !== 'string')
            return {error: 'getdevices URL is not a string'};

        if(data.getdevices.match(URL_pattern) === null)
            return {error: 'getdevices URL does not seem to be a real URL'};

        if(typeof data.createdevice !== 'string')
            return {error: 'createdevice URL is not a string'};

        if(data.createdevice.match(URL_pattern) === null)
            return {error: 'createdevice URL does not seem to be a real URL'};

        if(typeof data.deletedevice !== 'string')
            return {error: 'deletedevice URL is not a string'};

        if(data.deletedevice.match(URL_pattern) === null)
            return {error: 'deletedevice URL does not seem to be a real URL'};

        if(typeof data.changeprofile !== 'string')
            return {error: 'changeprofile URL is not a string'};

        if(data.changeprofile.match(URL_pattern) === null)
            return {error: 'changeprofile URL does not seem to be a real URL'};

        if(typeof data.savemapcoords !== 'string')
            return {error: 'savemapcoords URL is not a string'};

        if(data.savemapcoords.match(URL_pattern) === null)
            return {error: 'savemapcoords URL does not seem to be a real URL'};

        this.nummessages = data.numberofmessagestoget;
        this.URL_getfreedevices = data.getfreedevices;
        this.URL_sendmessage = data.sendmessage;
        this.URL_getmessages = data.getmessages;
        this.URL_adddevicetogroup = data.adddevicetogroup;
        this.URL_deletedevicefromgroup = data.deletedevicefromgroup;
        this.URL_getdevices = data.getdevices;
        this.URL_createdevice = data.createdevice;
        this.URL_deletedevice = data.deletedevice;
        this.URL_changeprofile = data.changeprofile;
        this.URL_savemapcoords = data.savemapcoords;
        this.cycleout = data.numberofcyclesuntilgetout;

    }



    /*
     *
     *  Method to send a command to a device and get his response
     *
     */

    sendAndGet = function ( device, order, callback, data='none' ) {

        let recieve = false;
        let cyclenow = 0;

        let classDevice = this;
        let send = classDevice.sendCommand(order, device, function(sendResult) {

            if(sendResult !== false){

                classDevice.check(device, order, recieve, cyclenow, function(message) {

                    callback(message);

                });

            }

        }, data);

        if(send === false)
            return false;

    }


    check = function( device, order, recieve, cyclenow, callback ) {

        if(cyclenow === this.cycleout){

            callback(false);
            return;

        }

        if(recieve === true)
            return;

        cyclenow++;

        let deviceClass = this;

        this.getResponse(device, function(result) {

            if(result !== false){

                for(let i = result.length - 1 ; i >= 0 ; i--){
                    
                    let message = deviceClass.parseMessage(result[i].message);
                    
                    if(message.type !== 'from')
                        continue;

                    if(message.device !== device)
                        continue;

                    if(message.order !== order)
                        continue;

                    recieve = true;
                    callback(message);
                    break;

                }

                deviceClass.check(device, order, recieve, cyclenow, callback);

            }

            else{

                deviceClass.check(device, order, recieve, cyclenow, callback);

            }

        });

    }

    parseMessage = function( message ) {

        let parsed = new Object();

        let messageSplit = message.split('|');

        parsed["type"] = messageSplit[0];
        parsed["device"] = messageSplit[1];
        parsed["order"] = messageSplit[2];
        parsed["data"] = new Object();

        for(let i = messageSplit.length - 3 ; i < messageSplit.length ; i++){

            let messageDataSplit = messageSplit[i].split('#');
            parsed["data"][messageDataSplit[0]] = messageDataSplit[1];

        }

        return parsed;

    }



    /*
     *
     *  Method to update the coords of the map position
     *
     */

    saveMapCoords = function ( device, x, y, callback ) {

        if(typeof callback !== 'function')
            return false;

        if(typeof x !== 'number')
            return false;

        if(typeof y !== 'number')
            return false;

        let body = new Object();

        body['map_x'] = x;
        body['map_y'] = y;

        let url = this.URL_savemapcoords + device;

        $.ajax({

            url: url,
            type: 'put',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            data: JSON.stringify(body),
            beforeSend: function(){

                console.log("======> Actualizando coordenadas del dispositivo");

            },
            success: function(response){

                console.log("===> Coordenadas actualizadas");
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
     *  Method to update the info i nthe profile of a device
     *
     */

    changeProfile = function ( device, callback, description='', type='' ) {

        if(typeof callback !== 'function')
            return false;

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        let body = new Object();

        if(description !== ''){

            if(typeof description !== 'string')
                return false;

            if(description.match(/^[a-zA-Z0-9 ]+$/gi) === null)
                return false;

            body['description'] = description;

        }

        if(type !== ''){

            if(typeof type !== 'string')
                return false;

            if(type.match(/^[a-zA-Z0-9]+$/gi) === null)
                return false;

            body['type'] = type;

        }

        if((body.description === '') && (body.type === ''))
            return false;

        let url = this.URL_changeprofile + device;

        $.ajax({

            url: url,
            type: 'put',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            data: JSON.stringify(body),
            beforeSend: function(){

                console.log("======> Cambiando perfil del dispositivo");

            },
            success: function(response){

                console.log("===> Perfil actualizado");
                callback(false);
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
     *  Method to get a list of devices
     *
     */

    getDevices = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getdevices,
            type: 'get',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo dispositivos");

            },
            success: function(response){

                console.log("===> Dispositivos obtenidos");
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
     *  Method to create a new device
     *
     */

    createDevice = function ( device, callback ) {

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        let url = this.URL_createdevice + device;

        $.ajax({

            url: url,
            type: 'post',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Creando dispositivo "+ device);

            },
            success: function(response){

                console.log("===> Dispositivo creado");
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
     *  Method to delete a device
     *
     */

    deleteDevice = function ( device, callback ) {

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        let url = this.URL_deletedevice + device;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Borrando dispositivo "+ device);

            },
            success: function(response){

                console.log("===> Dispositivo borrado");
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
     *  Method to get a list of the free devices
     *
     */

    getFreeDevices = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getfreedevices,
            type: 'get',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo dispositivos libres");

            },
            success: function(response){

                console.log("===> Dispositivos obtenidos");
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
     *  Method to add a device to a group
     *
     */

    addDeviceToGroup = function ( device, group, callback ) {

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof group !== 'string')
            return false;

        if(group.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_adddevicetogroup + device + "/" + group;

        $.ajax({

            url: url,
            type: 'post',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo a "+ device +" que se suscriba a "+ group);

            },
            success: function(response){

                console.log("===> Dispositivo suscrito");
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
     *  Method to eject a device from his group
     *
     */

    ejectDevice = function ( device, callback ) {

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_deletedevicefromgroup + device;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo a "+ device +" que se desuscriba");

            },
            success: function(response){

                console.log("===> Dispositivo desuscrito");
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
     *  Method to ask for the last messages of a device
     *
     */

    getResponse = function ( device, callback ){

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_getmessages + device + "/" + this.nummessages;
    
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
     *  Method to send a command to a device
     *
     */

    sendCommand = function ( order, device, callback, data='none' ) {

        if(typeof device !== 'string')
            return false;

        if(device.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof order !== 'string')
            return false;

        if(order.match(/^[a-z]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        if(typeof data !== 'string')
            return false;

        var message = 'for|' + device + '|' + order;

        if(data !== 'none')
            message = message + '|' + data;

        var url = this.URL_sendmessage + device;
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