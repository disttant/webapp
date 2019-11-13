/*
 *  This class makes all ajax related with get group lists, create or delete
 *  a group.
 * 
 *  Kevin Machuca // kevin.mrosa96@gmail.com // 11-11-2019
  *  CONSTRUCTOR:
 * 
 *  Must be an array with the following data:
 * 
 *  -> access_token: A valid token to use in the ajax calls.
 *  -> getfullgroups: The URL to the endpoint of the API to get the groups with their channels of the user.
 *  -> getgrouplist: The URL to the endpoint of the API to get the list of groups of a user.
 *  -> creategroup: The URL to the endpoint of the API to create a group of the user.
 *  -> deletegroup: The URL to the endpoint of the API to delete a group of the user.
 * 
 *  METHODS:
 * 
 *  --> getGroupsListWithChannels: Returns a list with all groups and their channels.
 *      NEEDS: function to be execute when complete -- RETURNS: an array with the full group list.
 * 
 *  --> getGroupList: Returns a list with all groups empties
 *      NEEDS: function to be execute when complete -- RETURNS: an array with the group list.
 * 
 *  --> createGroup: Create a group in the system
 *      NEEDS: name of the group to create, function to be execute when complete -- RETURNS: API response.
 * 
 *  --> deleteGroup: Deletes a group from the system
 *      NEEDS: name of the group to delete, function to be execute when complete -- RETURNS: API response.
 * 
 */

export class group {



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
        }catch( ex ){ }

        if(typeof decoded !== 'object')
            return {error: 'access_token does not seem to be a real token'};

        if(typeof data.getfullgroups !== 'string')
            return {error: 'getfullgroups URL is not a string'};

        if(data.getfullgroups.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi) === null)
            return {error: 'getfullgroups URL does not seem to be a real URL'};

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

        this.access_token = data.access_token;
        this.URL_getfullgroups = data.getfullgroups;
        this.URL_getgrouplist = data.getgrouplist;
        this.URL_creategroup = data.creategroup;
        this.URL_deletegroup = data.deletegroup;

    }



    /*
     *
     *  Method to get a full list of all the groups with thier channels
     *
     */

    getGroupsListWithChannels = function (callback) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getfullgroups,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ this.access_token,
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

    }


    /*
     *
     *  Method to get a list with all groups
     *
     */

    getGroupList = function (callback) {

        if(typeof callback !== 'function')
            return false;

        $.ajax({

            url: this.URL_getgrouplist,
            type: 'get',
            headers: {

                "Authorization": "Bearer "+ this.access_token,
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

                "Authorization": "Bearer "+ this.access_token,
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

                "Authorization": "Bearer "+ this.access_token,
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

    }

}
