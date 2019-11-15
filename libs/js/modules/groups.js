/*
 *  This class makes all ajax related with get group lists, create or delete
 *  a group.
 * 
 *  Kevin Machuca // kevin.mrosa96@gmail.com // 11-11-2019
 * 
 *  CONSTRUCTOR:
 * 
 *  Must be an array with the following data:
 * 
 *  -> numberofmessagestoget: Number of messages to get of a group.
 *  -> getgrouplist: The URL to the endpoint of the API to get the list of groups of a user.
 *  -> creategroup: The URL to the endpoint of the API to create a group of the user.
 *  -> deletegroup: The URL to the endpoint of the API to delete a group of the user.
 *  -> getmessages: The URL to the endpoint of the API to get the last messages of a group.
 *  -> getrelatedgroups: The URL to the endpoint of the API to get the list of groups with channels inside.
 *  -> getfullgroups: The URL to the endpoint of the API to get the list of all groups, empties or not.
 * 
 *  METHODS:
 * 
 *  --> getRelatedGroups: Returns a list with all groups with channels inside.
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK: an array with the group list/false -- RETURNS: true/false.
 * 
 *  --> getFullGroups: Returns a list with all groups with or wihtout channles inside.
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK: an array with the full group list/false -- RETURNS: true/false.
 * 
 *  --> getGroupList: Returns a list with all groups empties
 *      NEEDS: function to be execute when complete -- GIVEN TO CALLBACK: an array with the group list/false -- RETURNS: true/false.
 * 
 *  --> createGroup: Create a group in the system
 *      NEEDS: name of the group to create, function to be execute when complete -- GIVEN TO CALLBACK: an array with the channels/false -- RETURNS: true/false.
 * 
 *  --> deleteGroup: Deletes a group from the system
 *      NEEDS: name of the group to delete, function to be execute when complete -- GIVEN TO CALLBACK: an array with the channels/false -- RETURNS: true/false.
 * 
 *  --> getGroupMessages: Ask for the last messages of a group
 *      NEEDS: name of the group to get the messages, function to be execute when complete -- GIVEN TO CALLBACK: an array with the messages/false -- RETURNS: true/false.
 * 
 */

export class groupController {



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

        if(typeof data.getgrouplist !== 'string')
            return {error: 'getgrouplist URL is not a string'};

        if(data.getgrouplist.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getgrouplist URL does not seem to be a real URL'};

        if(typeof data.creategroup !== 'string')
            return {error: 'creategroup URL is not a string'};

        if(data.creategroup.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'creategroup URL does not seem to be a real URL'};

        if(typeof data.deletegroup !== 'string')
            return {error: 'deletegroup URL is not a string'};

        if(data.deletegroup.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'deletegroup URL does not seem to be a real URL'};

        if(typeof data.getmessages !== 'string')
            return {error: 'getmessages URL is not a string'};

        if(data.getmessages.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getmessages URL does not seem to be a real URL'};

        if(typeof data.getrelatedgroups !== 'string')
            return {error: 'getrelatedgroups URL is not a string'};

        if(data.getrelatedgroups.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getrelatedgroups URL does not seem to be a real URL'};

        if(typeof data.getfullgroups !== 'string')
            return {error: 'getfullgroups URL is not a string'};

        if(data.getfullgroups.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getfullgroups URL does not seem to be a real URL'};

        this.numberofmessagestoget = data.numberofmessagestoget;
        this.URL_getgrouplist = data.getgrouplist;
        this.URL_creategroup = data.creategroup;
        this.URL_deletegroup = data.deletegroup;
        this.URL_getmessages = data.getmessages;
        this.URL_getrelatedgroups = data.getrelatedgroups;
        this.URL_getfullgroups = data.getfullgroups;

    }



    /*
     *
     *  Method to get the list of all groups in the user system
     *
     */

    getRelatedGroups = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getrelatedgroups,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo todos los grupos con canales");

            },
            success: function(response){

                console.log("===> Grupos obtenidos");
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
     *  Method to get the list of all groups in the user system
     *
     */

    getFullGroups = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getfullgroups,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo todos los grupos");

            },
            success: function(response){

                console.log("===> Grupos obtenidos");
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
     *  Method to get the last messages of the group
     *
     */

    getGroupMessages = function ( group, callback ) {

        if(typeof group !== 'string')
            return false;

        if(group.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        let url = this.URL_getmessages + group + "/" + this.numberofmessagestoget;

        $.ajax({

            url: url,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo mensajes del grupo "+ group);

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
     *  Method to get a full list of all the groups with thier channels
     *
     */

    getGroupsListWithChannels = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getfullgroups,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo grupos completos");

            },
            success: function(response){

                console.log("===> Grupos obtenidos");
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
     *  Method to get a list with all groups
     *
     */

    getGroupList = function ( callback ) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getgrouplist,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Pidiendo grupos");

            },
            success: function(response){

                console.log("===> Grupos obtenidos");
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
     *  Method to create a new group
     *
     */

    createGroup = function ( group, callback ) {

        if(typeof group !== 'string')
            return false;

        if(group.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_creategroup + group;

        $.ajax({

            url: url,
            type: 'post',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Creando Grupo");

            },
            success: function(response){

                console.log("===> Grupo creado");
                callback(true);

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
     *  Method to delete a group
     *
     */

    deleteGroup = function ( group, callback ) {

        if(typeof group !== 'string')
            return false;

        if(group.match(/^[a-z0-9]+$/gi) === null)
            return false;

        if(typeof callback !== 'function')
            return false;

        var url = this.URL_deletegroup + group;

        $.ajax({

            url: url,
            type: 'delete',
            headers: {

                "Authorization": "Bearer "+ localStorage.access_token,
                "Content-Type" : "application/json",
                "Accept" : "application/json"

            },
            beforeSend: function(){

                console.log("======> Borrando grupo");

            },
            success: function(response){

                console.log("===> Grupo borrado");
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
