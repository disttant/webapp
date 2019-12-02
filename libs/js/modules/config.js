// Config file

export class configController {

    getConfig = function () {

        let config = new Object();

        let URL_broker = "http://broker.dalher.net/";
        let URL_broker_version = "v1";

        config = {

            "global" : {

                "default"  : "login",
                "excluded" : [

                    "index"

                ]

            },

            "app" : {

                "default" : "homeMaker",
                "timers"  : []

            },

            "map" : {

                "width"        : 12,
                "height"       : 12

            },

            "oauth" : {

                auth_uri        : "http://accounts.dalher.net/oauth/authorize",
                client_id       : "14",
                redirect_uri    : "http://adaptative.dalher.net/?g=gimme",
                scope           : "broker_r broker_w broker_d"
            
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
                debug: true
            
            },

            "device" : {

                numberofmessagestoget      : 3,
                getfreedevices             : URL_broker + URL_broker_version +"/devices/list/free",
                sendmessage                : URL_broker + URL_broker_version +"/devices/message/",
                getmessages                : URL_broker + URL_broker_version +"/devices/messages/",
                getdevices                 : URL_broker + URL_broker_version +"/devices/list",
                createdevice               : URL_broker + URL_broker_version +"/devices/",
                deletedevice               : URL_broker + URL_broker_version +"/devices/",
                adddevicetogroup           : URL_broker + URL_broker_version +"/devices/relation/",
                deletedevicefromgroup      : URL_broker + URL_broker_version +"/devices/relation/",
                changeprofile              : URL_broker + URL_broker_version +"/devices/profile/",
                savemapcoords              : URL_broker + URL_broker_version +"/devices/relation/coordinates/",
                numberofcyclesuntilgetout  : 5,
                debug: true
            
            },

            "model" : {

                "light"        : "#ffeb3b",
                "lamp"         : "#ffbc00",
                "socket"       : "#ff5252",
                "multisocket"  : "#00b0ff",
                "undefined"    : "#90a4ae"

            }

        };

        return config;

    }

}