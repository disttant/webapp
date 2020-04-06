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
 *  -> numberofmessagestoget:       The number of messages to get with the method getResponse (recommend 2-5).
 *  -> getfreedevices:              The URL of the API to get the free devices of the user.
 *  -> sendmessage:                 The URL of the API to send a message to a device.
 *  -> getmessages:                 The URL of the API to get the last messages of a device.
 *  -> getdevices:                  The URL of the API to get the list of devices.
 *  -> createdevice:                The URL of the API to create a device.
 *  -> deletedevice:                The URL of the API to delete a device.
 *  -> changeprofile:               The URL of the API to change profile data.linear-activity
 *  -> getprofile:                  The URL of the API to get profile
 *  -> numberofcyclesuntilgetout:   The number of times to look for a response into the channel messages.
 * 
 *  METHODS:
 * 
 *  --> sendAndGet:         Returns the message needed like response of an order sended to a device.
 * 
 *      NEEDS:              Name of the device to send the order, order to be send, function to be execute when complete, extra data for the order
 *      GIVEN TO CALLBACK:  The message looked for / False
 *      RETURNS:            True / False
 * 
 *  --> checkMessages:      Ask for the messages repetively until he gets the max repetitions or found the message looked for.
 * 
 *      NEEDS:              Name of the device where the order was sent, the order that was sent, aux vairable to know when the message is recieved, aux variable to know the number of cycles that this function have been executed, function to be execute when complete (USUALLY ITSELF)
 *      GIVEN TO CALLBACK:  The message looked for / False
 *      RETURNS:            VOID
 * 
 *  --> parseMessage:       Parse a message and returns an array with all info extracted from that message.
 * 
 *      NEEDS:              Message to be parsed
 *      RETURNS:            an array with all the info extrated / False.
 * 
 *  --> getDevices:         Returns a list with all devices.
 * 
 *      NEEDS:              Function to be execute when complete
 *      GIVEN TO CALLBACK:  an array with the devices / False
 *      RETURNS:            True / False
 * 
 *  --> createDevice:       Create a new device in the system.
 * 
 *      NEEDS:              Name of the new device, function to be execute when complete
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 * 
 *  --> deleteDevice:       Delete a device from the system.
 * 
 *      NEEDS:              Name of the device to delete, function to be execute when complete
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 * 
 *  --> getFreeDevices:     Returns a list with all FREE devices.
 * 
 *      NEEDS:              Function to be execute when complete
 *      GIVEN TO CALLBACK:  an array with the free devices / False
 *      RETURNS:            True / False
 * 
 *  --> addDeviceToGroup:   Order a client to suscribe to a group.
 * 
 *      NEEDS:              Device to include, group where include, function to be execute when complete
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 * 
 *  --> ejectDevice:        Order a device to delete the suscription to his group.
 * 
 *      NEEDS:              Device to eject, function to be execute when complete
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 * 
 *  --> sendCommand:        Send an order to a client with the require data.
 * 
 *      NEEDS:              Order to send, device to send the order, function to be execute when complete, extra-data with some orders ( DEFAULT => 'NONE' )
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 * 
 *  --> getResponse:        Ask for the last device messages.
 * 
 *      NEEDS:              Device where the last order was sent, function to be execute when complete
 *      GIVEN TO CALLBACK:  an array with the last messages of the device / False
 *      RETURNS:            True / False
 *
 *  --> changeProfile:      Change the information of the profile of a Device.
 * 
 *      NEEDS:              Device to change the profile info, function to be execute when complete, description to put into the profile, type of device to put into the profile
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 *
 *  --> getProfile:         Get the profile of a Device.
 * 
 *      NEEDS:              Device to get the profile info, function to be execute when complete
 *      GIVEN TO CALLBACK:  True / False
 *      RETURNS:            True / False
 * 
 */

export class DeviceController {



    /*
     *
     *  Contructor of the class
     *
     */

    constructor( data ) {

        if( typeof data !== 'object' )
            return { error: 'Trying to construct wihtout a config array' };

        if( typeof data.numberofmessagestoget !== 'number' )
            return { error: 'numberofmessagestoget is not a number' };

        if( typeof data.getfreedevices !== 'string' )
            return { error: 'getfreedevices URL is not a string' };

        let URL_pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi;

        if( data.getfreedevices.match( URL_pattern ) === null )
            return { error: 'getfreedevices URL does not seem to be a real URL' };

        if( typeof data.sendmessage !== 'string' )
            return { error: 'sendmessage URL is not a string' };

        if( data.sendmessage.match( URL_pattern ) === null )
            return { error: 'sendmessage URL does not seem to be a real URL' };

        if( typeof data.getmessages !== 'string' )
            return { error: 'getmessages URL is not a string' };

        if( data.getmessages.match( URL_pattern ) === null )
            return { error: 'getmessages URL does not seem to be a real URL' };

        if( typeof data.adddevicetogroup !== 'string' )
            return { error: 'adddevicetogroup URL is not a string' };

        if( data.adddevicetogroup.match( URL_pattern ) === null )
            return { error: 'adddevicetogroup URL does not seem to be a real URL' };

        if( typeof data.deletedevicefromgroup !== 'string' )
            return { error: 'deletedevicetogroup URL is not a string' };

        if( data.deletedevicefromgroup.match( URL_pattern ) === null )
            return { error: 'deletedevicetogroup URL does not seem to be a real URL' };

        if( typeof data.getdevices !== 'string' )
            return { error: 'getdevices URL is not a string' };

        if( data.getdevices.match( URL_pattern ) === null )
            return { error: 'getdevices URL does not seem to be a real URL' };

        if( typeof data.createdevice !== 'string' )
            return { error: 'createdevice URL is not a string' };

        if( data.createdevice.match( URL_pattern ) === null )
            return { error: 'createdevice URL does not seem to be a real URL' };

        if( typeof data.deletedevice !== 'string' )
            return { error: 'deletedevice URL is not a string' };

        if( data.deletedevice.match( URL_pattern ) === null )
            return { error: 'deletedevice URL does not seem to be a real URL' };

        if( typeof data.changeprofile !== 'string' )
            return { error: 'changeprofile URL is not a string' };

        if( data.changeprofile.match( URL_pattern ) === null )
            return { error: 'changeprofile URL does not seem to be a real URL' };

        if( typeof data.getprofile !== 'string' )
            return { error: 'getprofile URL is not a string' };

        if( data.getprofile.match( URL_pattern ) === null )
            return { error: 'getprofile URL does not seem to be a real URL' };

        if( typeof data.numberofcyclesuntilgetout !== 'number' )
            return { error: 'numberofcyclesuntilgetout URL is not a number' };

        if( typeof data.debug !== 'boolean' )
            return { error: 'debug is not a boolean' };

        this.nummessages                = data.numberofmessagestoget;
        this.URL_getfreedevices         = data.getfreedevices;
        this.URL_sendmessage            = data.sendmessage;
        this.URL_getmessages            = data.getmessages;
        this.URL_adddevicetogroup       = data.adddevicetogroup;
        this.URL_deletedevicefromgroup  = data.deletedevicefromgroup;
        this.URL_getdevices             = data.getdevices;
        this.URL_createdevice           = data.createdevice;
        this.URL_deletedevice           = data.deletedevice;
        this.URL_getprofile             = data.getprofile;
        this.URL_changeprofile          = data.changeprofile;
        this.cycleout                   = data.numberofcyclesuntilgetout;
        this.debug                      = data.debug;

    }



    /*
     *
     *  Method to send a command to a device and get his response
     *
     */

    sendAndGet = function ( device, order, callback, data='none' ) {

        let recieve     = false;
        let cyclenow    = 0;

        let classDevice = this;
        let send = classDevice.sendCommand( order, device, function( sendResult ) {

            if( sendResult !== false ){

                classDevice.checkMessages( device, order, recieve, cyclenow, function( message ) {

                    callback( message );

                });

            }

        }, data );

        if( send === false )
            return false;

    }



    /*
     *
     *  Method look for the response of a device into his channel repetively
     *
     */

    checkMessages = function ( device, order, recieve, cyclenow, callback ) {

        if( cyclenow === this.cycleout ) {

            callback( false );
            return;
        }

        if( recieve === true )
            return;

        cyclenow++;
        let deviceClass = this;

        this.getResponse( device, function( result ) {

            if( result !== false ) {

                let sentOrder     = new RegExp('^((\\|)?for\\|'+device+'\\|'+order+'(\\|[a-z]+\\#[a-z0-9]+)*(\\|)?){1}$');
                let expectedOrder = new RegExp('^((\\|)?from\\|'+device+'\\|'+order+'(\\|[a-z]+\\#[a-z0-9]+)*(\\|)?){1}$');

                for( let i = 0 ; i < result.device.messages.length ; i++ ) {
                    
                    let parsedMessage = deviceClass.parseMessage( result.device.messages[i].message ) ;

                    // Sent message found, go out
                    if ( result.device.messages[i].message.match(sentOrder) !== null ){
                        break;
                    }

                    // Expected message not found, go out
                    if ( result.device.messages[i].message.match(expectedOrder) == null ){
                        break;
                    }

                    recieve = true;
                    callback( parsedMessage );
                    break;

                }

                deviceClass.checkMessages( device, order, recieve, cyclenow, callback );

            }

            else {

                deviceClass.checkMessages( device, order, recieve, cyclenow, callback );

            }

        });

    }



    /*
     *
     *  Method to parse a message and extract all the info into an array
     *
     */

    parseMessage = function( message ) {

        if( typeof message !== 'string' )
            return false;

        let parsed = new Object();

        let messageSplit = message.split( '|' );

        if( messageSplit[0] === message )
            return false;

        if( messageSplit.length < 3 )
            return false;

        parsed["type"]      = messageSplit[0];
        parsed["device"]    = messageSplit[1];
        parsed["order"]     = messageSplit[2];

        if( messageSplit.length > 3 ) {

            parsed["data"] = new Object();
            let data = messageSplit.splice( 3 );

            for( let i = 0 ; i < data.length ; i++ ) {

                let messageDataSplit = data[i].split( '#' );

                if( messageDataSplit[0] === data[i] )
                    return false;

                parsed["data"][messageDataSplit[0]] = messageDataSplit[1];

            }

        }

        return parsed;

    }



    /*
     *
     *  Method to update the info i nthe profile of a device
     *
     */
    changeProfile = function ( device, callback, description='', type='' ) {

        if( typeof callback !== 'function' )
            return false;

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        let body = new Object();
        body['name'] = device;

        if( description !== '' ) {

            if( typeof description !== 'string' )
                return false;

            if( description.match(/^[a-zA-Z0-9 ]+$/gi) === null )
                return false;

            body['description'] = description;

        }

        if( type !== '' ) {

            if( typeof type !== 'string' )
                return false;

            if( type.match(/^[a-zA-Z0-9]+$/gi) === null )
                return false;

            body['type'] = type;

        }

        if( ( body.description === '' ) && ( body.type === '' ) )
            return false;

        let url = this.URL_changeprofile;
        let debug = this.debug;

        $.ajax({

            url: url,
            type: 'put',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            data: JSON.stringify( body ),
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Cambiando perfil del dispositivo" );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Perfil actualizado" );

                callback( true );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
            }

        });

        return true;

    }



    /*
     *
     *  Method to get the profile of a device
     *
     */
    getProfile = function ( device, callback ) {

        if( typeof callback !== 'function' )
            return false;

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        let url = this.URL_getprofile + '/' + device;
        let debug = this.debug;

        $.ajax({

            url: url,
            type: 'get',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Obteniendo perfil del dispositivo" );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Perfil obtenido" );

                callback( response );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof callback !== 'function' )
            return false;

        let debug = this.debug;

        $.ajax({

            url: this.URL_getdevices,
            type: 'get',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Pidiendo dispositivos" );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Dispositivos obtenidos" );

                callback( response );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof callback !== 'function' )
            return false;

        let url = this.URL_createdevice;
        let debug = this.debug;

        $.ajax({

            url: url,
            type: 'post',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Creando dispositivo "+ device );

            },
            data: JSON.stringify({
                "name" : device,
                "type" : "new",
                "description" : "new device"
            }),
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Dispositivo creado" );

                callback( true );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof callback !== 'function' )
            return false;

        let url = this.URL_deletedevice + "/" + device;
        let debug = this.debug;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Borrando dispositivo "+ device );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Dispositivo borrado" );

                callback( true );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof callback !== 'function' )
            return false;

        let debug = this.debug;

        $.ajax({

            url: this.URL_getfreedevices,
            type: 'get',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Pidiendo dispositivos libres" );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Dispositivos obtenidos" );

                callback( response );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof group !== 'string' )
            return false;

        if( group.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof callback !== 'function' )
            return false;

        let debug = this.debug;

        var url = this.URL_adddevicetogroup;

        $.ajax({

            url: url,
            type: 'post',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            data: JSON.stringify({
                "group" : group,
                "device" : device
            }),
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Pidiendo a "+ device +" que se suscriba a "+ group );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Dispositivo suscrito" );

                callback( true );
            },
            error: function ( response ) {

                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof callback !== 'function' )
            return false;

        var url = this.URL_deletedevicefromgroup + "/" + device;
        let debug = this.debug;

        $.ajax({

            url: url,
            type: 'delete',

            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Pidiendo a "+ device +" que se desuscriba" );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Dispositivo desuscrito" );

                callback( true );
            },
            error: function ( response ) {
                if( debug === true )
                    console.log( "===> [Error]" );

                callback( false );
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

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof callback !== 'function' )
            return false;

        let debug = this.debug;

        var url = this.URL_getmessages + "/" + device + "/" + this.nummessages;
    
        $.ajax({
    
            url: url,
            type: 'get',
            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            beforeSend: function() {

                if( debug === true )
                    console.log( "======> Pidiendo mensajes" )

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Mensajes obtenidos" );

                callback(response);

            },
            error: function ( response ) {

                if( debug === true )
                    console.warn( "===> [Error]" );

                callback( false );

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

        if( typeof device !== 'string' )
            return false;

        if( device.match(/^[a-z0-9]+$/gi) === null )
            return false;

        if( typeof order !== 'string' )
            return false;

        if( order.match(/^[a-z]+$/gi) === null )
            return false;

        if( typeof callback !== 'function' )
            return false;

        if( typeof data !== 'string' )
            return false;

        var message = 'for|' + device + '|' + order;

        if( data !== 'none' )
            message = message + '|' + data;

        var url = this.URL_sendmessage;
        let debug = this.debug;

        $.ajax({

            url: url,
            type: 'post',
            headers: {

                "Authorization" : "Bearer "+ localStorage.access_token,
                "Content-Type"  : "application/json",
                "Accept"        : "application/json"

            },
            data: JSON.stringify({
                "name" : device,
                "message" : message
            }),
            beforeSend: function() {

                if( debug === true )
                    console.log(    "======> Enviando mensaje" );

            },
            success: function( response ) {

                if( debug === true )
                    console.log( "===> Mensaje enviado" );

                callback( true );

            },
            error: function ( response ) {

                if( debug === true )
                    console.warn( "===> [Error]" );

                callback( false );

            }

        });

        return true;
    
    }

}
