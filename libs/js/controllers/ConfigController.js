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

        let URL_broker = "https://api.disttant.com/";
        let URL_broker_version = "v1";

        config = {
            "oauth" : {

                auth_uri        : "https://accounts.disttant.com/oauth/authorize",
                client_id       : "1",
                redirect_uri    : "https://webapp.disttant.com/?g=gimme",
                scope           : "api_r api_w api_d"
            
            },

            "api" : {

                

            },

            "group" : {
   
                numberofmessagestoget   : 3,
                getgrouplist            : URL_broker + URL_broker_version +"/groups/list",
                creategroup             : URL_broker + URL_broker_version +"/groups/",
                deletegroup             : URL_broker + URL_broker_version +"/groups/",
                getmessages             : URL_broker + URL_broker_version +"/groups/messages/",
                getrelatedgroups        : URL_broker + URL_broker_version +"/groups/list/related",
                getfullgroups           : URL_broker + URL_broker_version +"/groups/list/full",
                getfullgroupwithinfo    : URL_broker + URL_broker_version +"/group/list/related/",
                debug: false
            
            },

            "device" : {

                numberofmessagestoget      : 3,
                getdevices                 : URL_broker + URL_broker_version +"/devices/list",
                getfreedevices             : URL_broker + URL_broker_version +"/devices/list/free",
                createdevice               : URL_broker + URL_broker_version +"/devices/",
                deletedevice               : URL_broker + URL_broker_version +"/devices/",
                changeprofile              : URL_broker + URL_broker_version +"/devices/profile/",
                getprofile                 : URL_broker + URL_broker_version +"/devices/profile/",
                sendmessage                : URL_broker + URL_broker_version +"/devices/message/",
                getmessages                : URL_broker + URL_broker_version +"/devices/messages/",
                adddevicetogroup           : URL_broker + URL_broker_version +"/devices/relation/",
                deletedevicefromgroup      : URL_broker + URL_broker_version +"/devices/relation/",
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

                    "light-v1"     : "#ffeb3b",
                    "lamp"         : "#ffbc00",
                    "socket-v1"    : "#ff5252",
                    "multisocket"  : "#00b0ff",
                    "undefined"    : "#90a4ae"
                }

            },

        };

        return config;

    }

}
