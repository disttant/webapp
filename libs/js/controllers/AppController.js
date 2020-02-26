/*
 *  This class groups some app-related methods to show spinners, modals, toasts and more
 *  programatically
 * 
 *  Alby Hernández // me@achetronic.com // 15-12-2019
 * 
 *  CONSTRUCTOR:
 *  -->
 * 
 *  
 *  METHODS:
 * 
 *  --> spinner:            Show or hide several kinds of spinner
 * 
 *      NEEDS:              show/hide as input to show/hide the spinner defined by class.spinnerType 
 *                          that can be one of the following: 'page', 'bar', 'module';
 *      RETURNS:            VOID
 * 
 *  --> moduleLoad          Save module name and data into sessionStorage and load the module into the module wrapper
 * 
 *      NEEDS:              Name of the file .m (without extension) to be loaded in the wrapper, A JSON with 
 *                          needed information to be stored in sessionStorage joined to the called module
 *      RETURNS:            VOID
 * 
 *  --> genRandomId:        Generate a random string of numbers prepended by an underscore
 * 
 *      NEEDS:              VOID
 *      RETURNS:            A string like '_25489'
 * 
 *  --> sentToast:          Generate a toast message into the queue
 * 
 *      NEEDS:              The message to be shown
 *      RETURNS:            VOID
 * 
 *  --> processOneToast:    Show a toast and remove it from the queue
 * 
 *      NEEDS:              VOID
 *      RETURNS:            VOID
 * 
 *  --> sendModal:          Generate a modal in front of the screen
 * 
 *      NEEDS:              The title of the modal, The content of the modal (HTML is valid too), A function to 
 *                          be executed when the button of modal is clicked
 *      RETURNS:            VOID
 * 
 */



export class AppController {


    
    spinnerType = 'page';



    /*
    *
    * This function must check the input data field
    * existance and patterns
    * 
    */
    /*constructor(data) {

        

    }*/

    

    /*
    *
    * This function shows or hides the spinner
    * of the app. It has three modes can be set
    * defining the class variable
    * app.spinnerType = 'mode' 
    * before calling an AJAX. The spinner will show
    * and hide automatically
    * 
    */
    spinner = function ( mode ){

        switch (mode){

            case 'show':

                if ( this.spinnerType === 'page' ){
                    $('#app-wrapper').addClass('d-none');
                    $('#app-spinner-wrapper').removeClass('d-none');

                }

                if ( this.spinnerType === 'module' ){
                    $('#module-wrapper').addClass('d-none');
                    $('#module-spinner-wrapper').removeClass('d-none');

                }

                if ( this.spinnerType === 'bar' ){
                    $('#top-preloader').fadeTo( 200, 1 );
                }

                break;

            case 'hide':
                $('#top-preloader').fadeTo( 200, 0 );

                $('#module-spinner-wrapper').addClass('d-none');
                $('#module-wrapper').removeClass('d-none');

                // We need some seconds for getting ready
                setTimeout(function(){
                    $('#app-spinner-wrapper').addClass('d-none');
                    $('#app-wrapper').removeClass('d-none');
                }, 2000);

                break;
        }

        return this;

    }



    /*
    *
    * This function must check and write the headers 
    * (when passed) for the asked module into sessionStorage. 
    * After that, the asked module will be loaded
    * 
    */
    moduleLoad = function ( moduleName, headersData ){

        let headers = null;

        // TASK: Check the input
        if ( typeof moduleName !== 'string' ){
            console.error('DEBUG: module name malformed (not an object). Aborting');
        }

        try {
            if ( typeof headersData !== 'object' ){
                throw 'DEBUG: module headers malformed (not an object). Omiting';
            }
        } catch (e) {
            headersData = null;
        }

        // Build and save the module headers
        headers = {
            'module' : moduleName,
            'data'   : headersData
        };

        window.sessionStorage['app.module.headers'] = JSON.stringify(headers);

        // TASK: Turn off window storage event handlers
        $(window).off('storage');

        // TASK: Turn off all body-related event handlers 
        //$('body').off('click');
        $('body').off();

        // TASK: Clean module timers
        config.app.timers.forEach(function callback(currentValue, index, array) {
            clearInterval(currentValue);
        });

        // Set the spinner in 'module' mode
        app.spinnerType = 'module';

        // Load the module
        $.get({
            url: 'modules/' + moduleName + '.html', 
            cache: config.modules.cached
        })
        .done(function( data ) {
            $('body').find("#module-wrapper").empty().html(data);
        })
        .fail(function() {
            $("#module-wrapper").load('modules/404.html');
        })
        .always(function(){
            //window.sessionStorage.removeItem('app.module.headers');
        });
    }



    /*
    *
    * Generates a string of random numbers
    * like _4865278
    * 
    */
    genRandomId = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    }



    /*
    *
    * This function generates a toast message
    * at the bottom of the app
    * 
    */
    sendToast = function (msg){

        config.app.toasts.push( msg ); 
        
    }



    /*
    *
    * This function process one toast 
    * at each time
    * 
    */
    processOneToast = function () {

        // Check number of messages in queue
        if( config.app.toasts.length < 1 ){
            return;
        }

        // Some toast on screen, go out
        if( $('#toast').is(':hidden') == false ){
            return;
        }

        $('#toast').html( config.app.toasts[0] ).slideDown( 400 ).delay(3000).slideUp( 400 );
        config.app.toasts.shift();

        // Do something every 9 seconds
        //setTimeout(this.testQueue, 3800);
    };

    



    /*
    *
    * This function changes the content of modal
    * and exec callback after clicking
    * 
    */
    sendModal = function (title, body, callback){

        let modalKey = this.genRandomId();
        let cleanModal = null;

        // Check the fields
        if( typeof title !== 'string' ){
            return;
        }

        if( typeof body !== 'string' ){
            return;
        }

        if( typeof callback !== 'function' ){
            return;
        }

        // Creates a clean modal by modifying the default one
        cleanModal = $('#modal-wrapper').find('#modal-footer > button[x-modal-key]').attr('x-modal-key', modalKey);
        cleanModal = $('#modal-wrapper').html();

        $('#modal-wrapper').empty().html(cleanModal);

        // Set the title of the modal
        $('#modal-title').empty().append(title);

        // Set the content of the modal
        $('#modal-body').empty().append(body);
        
        // Show the modal
        $('#modal-wrapper').modal('show');

        // Call a callback when clicking this button
        $('body').find('button[x-modal-key="'+modalKey+'"]').on('click', function(){

            callback();

            $('#modal-wrapper').modal('hide');
        });
    }

}

