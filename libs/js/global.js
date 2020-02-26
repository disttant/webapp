// Importing external libraries
import * as jwt_md from './node_modules/jwt-decode/build/jwt-decode.min.js';

// Importing custom libraries
import * as ConfigModule             from './controllers/ConfigController.js';
import * as IndexModule              from './controllers/IndexController.js';
import * as Oauth2Module             from './controllers/Oauth2Controller.js';
import * as LoginModule              from './controllers/LoginController.js';
import * as AppModule                from './controllers/AppController.js';
import * as GroupModule              from './controllers/GroupsController.js';
import * as DeviceModule             from './controllers/DevicesController.js';
import * as ColorModule              from './controllers/ColorController.js';
import * as ModelComponentsModule    from './controllers/ModelComponentsController.js';



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

    $.get('global_modules/' + uriParams.g + '.html')
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

        $("#index-wrapper").load('global_modules/' + currModule + '.html', function(){

            // Define the spinner type
            app.spinnerType = 'page';

            $.getScript('libs/js/actions/' + currModule + '.js')

        });

    });


    

});


