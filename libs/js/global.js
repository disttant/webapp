// Importing external libraries
import * as jwt_md from './node_modules/jwt-decode/build/jwt-decode.min.js';

// Importing custom libraries
import * as config_md from './modules/config.js';
import * as index_md from './modules/index.js';
import * as oauth2_md from './modules/oauth2.js';
import * as login_md from './modules/login.js';
import * as app_md from './modules/app.js';
import * as group_md from './modules/groups.js';
import * as device_md from './modules/devices.js';
import * as color_md from './modules/color.js';
import * as ModelComponents_md from './modules/ModelComponentsController.js';



/* *
 *
 * Config Library
 * Initialize this module
 * 
 * */
window.config = (new config_md.configController()).getConfig();



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
window.oauth = new oauth2_md.oauthController(config.oauth);



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
window.group = new group_md.groupController(config.group);


/* *
 *
 * Devices Library
 * Initialize this module
 * 
 * */
window.device = new device_md.deviceController(config.device);


/* *
 *
 * Colors Library
 * Initialize this module
 * 
 * */
window.color = new color_md.colorController();



/* *
 *
 * ModelComponents Library
 * Initialize this module
 * 
 * */
window.ModelComponents = new ModelComponents_md.ModelComponentsController();



/* *
 *
 * Index Actions
 * Call the module with its actions
 * 
 * */
window.uriParams     = index.getAllUrlParams(window.location.href);



$(function () {	
    
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

        if( $.inArray(currModule, config.global.excluded) !== -1 ){
            currModule = config.global.default;
        }
        
    })
    .fail(function() { 
        currModule = config.global.default;
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


