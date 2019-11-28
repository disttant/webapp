/* *
 *
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  
 * */



export class appController {



    /* *
    *
    * This function must check the input data field
    * existance and patterns
    * 
    * */
    /*constructor(data) {

        

    }*/

    spinnerType = 'page';

    

    /* *
    *
    * This function shows or hides the spinner
    * of the app. It has three modes can be set
    * defining the class variable
    * app.spinnerType = 'mode' 
    * before calling an AJAX. The spinner will show
    * and hide automatically
    * 
    * */
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
                    $('#top-preloader').removeClass('invisible');
                }

                break;

            case 'hide':

                $('#top-preloader').addClass('invisible');

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



    /* *
    *
    * This function must check and write the headers 
    * (when passed) for the asked module into sessionStorage. 
    * After that, the asked module will be loaded
    * 
    * */
    moduleLoad = function ( moduleName, headersData){

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

        //console.warn(headersData);

        // Build and save the module headers
        headers = {
            'module' : moduleName,
            'data'   : headersData
        };

        window.sessionStorage['app.module.headers'] = JSON.stringify(headers);

        // TASK: Turn off window storage event handlers
        $(window).off('storage');

        // TASK: Turn off all body-related click event handlers 
        $('body').off('click');

        // Set the spinner in 'module' mode
        app.spinnerType = 'module';

        // Load the module
        $.get({
            url: moduleName + '.m', 
            cache: false
        })
        .done(function( data ) {
            $('body').find("#module-wrapper").empty().html(data);
        })
        .fail(function() {
            $("#module-wrapper").load('404.m');
        })
        .always(function(){
            //window.sessionStorage.removeItem('app.module.headers');
        });
    }



    /* *
    *
    * This function -----
    * 
    * */
    genRandomId = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    }



    /* *
    *
    * This function -----
    * 
    * */
    sendToast = function (msg){

        let theAlert =
            '<div id="toast" class="alert alert-dismissible fade show m-2 bg-black text-light toast-width" role="alert">'+
                msg +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<i class="material-icons md-light md-18 align-middle">close</i>'+
                '</button>'+
            '</div>';
    
        $('#toastWrapper').append(theAlert);
    
        $('div[class~="alert"][id^="toast"]').hide().show('fast', 'linear');
    
        window.setTimeout(function() {
    
            $('div[class~="alert"][id^="toast"]').fadeTo(250, 0).slideUp(250, function(){
                $(this).remove(); 
            });
    
        }, 3000);
    }



    /* *
    *
    * This function changes the content of modal
    * and exec callback after clicking
    * 
    * */
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

