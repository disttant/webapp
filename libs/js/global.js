// Importing external libraries
import * as jwt_md from './node_modules/jwt-decode/build/jwt-decode.min.js';

// Importing custom libraries
import * as ConfigModule             from './modules/ConfigController.js';
import * as IndexModule              from './modules/IndexController.js';
import * as Oauth2Module             from './modules/Oauth2Controller.js';
import * as LoginModule              from './modules/LoginController.js';
import * as AppModule                from './modules/AppController.js';
import * as GroupModule              from './modules/GroupsController.js';
import * as DeviceModule             from './modules/DevicesController.js';
import * as ColorModule              from './modules/ColorController.js';
import * as ModelComponentsModule    from './modules/ModelComponentsController.js';



/* *
 *
 * Config Library
 * Initialize this module
 * 
 * */
window.config = (new ConfigModule.ConfigController()).getConfig();



/* *
 *
 * Index Library
 * Initialize this module
 * 
 * */
window.index = new IndexModule.IndexController();



/* *
 *
 * OAuth 2 Library
 * Initialize this module
 * 
 * */
window.oauth = new Oauth2Module.OauthController(config.oauth);



/* *
 *
 * Login Library
 * Initialize this module
 * 
 * */
window.login = new LoginModule.LoginController();



/* *
 *
 * App Library
 * Initialize this module
 * 
 * */
window.app = new AppModule.AppController();



/* *
 *
 * Groups Library
 * Initialize this module
 * 
 * */
window.group = new GroupModule.GroupController(config.group);


/* *
 *
 * Devices Library
 * Initialize this module
 * 
 * */
window.device = new DeviceModule.DeviceController(config.device);


/* *
 *
 * Colors Library
 * Initialize this module
 * 
 * */
window.color = new ColorModule.ColorController();



/* *
 *
 * ModelComponents Library
 * Initialize this module
 * 
 * */
window.ModelComponents = new ModelComponentsModule.ModelComponentsController();



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


