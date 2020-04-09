/*
 *  This class contains the config strings used in the rest of the app
 * 
 *  Alby Hernández // me@achetronic.com // 15-12-2019
 * 
 *  CONSTRUCTOR:
 *  -->
 * 
 *  
 *  METHODS:
 * 
 *  --> getConfig:          This method returns the asked property value ( it is a JSON, not a pure method )
 * 
 *      NEEDS:              VOID
 *      RETURNS:            Value of called property
 * 
 */

export class ConfigController {

    getConfig = function () {

        let config = new Object();

        let URL_broker = "https://api.disttant.com";

        config = {
            "oauth" : {

                auth_uri        : "https://accounts.disttant.com/oauth/authorize",
                client_id       : "1",
                redirect_uri    : "https://webapp.disttant.com/?g=gimme",
                scope           : "user_card"
            
            },

            "api" : {

                

            },

            "group" : {
   
                numberofmessagestoget   : 3,
                getgrouplist            : URL_broker + "/groups/list/names",
                creategroup             : URL_broker + "/group",
                deletegroup             : URL_broker + "/group",
                getmessages             : URL_broker + "/group/messages",
                getfullgroups           : URL_broker + "/groups/list/all",
                debug: false
            
            },

            "device" : {

                numberofmessagestoget      : 3,
                getdevices                 : URL_broker + "/devices/list/all",
                getfreedevices             : URL_broker + "/devices/list/free",
                createdevice               : URL_broker + "/device",
                deletedevice               : URL_broker + "/device",
                changeprofile              : URL_broker + "/device",
                getprofile                 : URL_broker + "/device",
                sendmessage                : URL_broker + "/device/message",
                getmessages                : URL_broker + "/device/messages",
                adddevicetogroup           : URL_broker + "/relation",
                deletedevicefromgroup      : URL_broker + "/relation",
                numberofcyclesuntilgetout  : 20,
                debug: false
            
            },

            "global" : {

                "default"  : "login",
                "excluded" : [

                    "index"

                ],
                
                "timers"  : [],

            },

            "app" : {

                "default" : "home",
                "toasts"  : [],
                "timers"  : [],

            },

            "modules" : {

                "cached" : false,

            },
            
            "models" : {

                "timers" : [],
                "cached" : false,
                "allowed" : {

                    "light-one"         : "#ffeb3b",
                    "socket-one"        : "#ff5252",
                    "thermostat-one"    : "#00b0ff",
                    "undefined"         : "#90a4ae"
                }

            },

        };

        return config;

    }

}
