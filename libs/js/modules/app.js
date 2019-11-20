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

    
    spinner = function ( mode ){
        switch (mode){
            case 'show':
                
                $('#app-wrapper').addClass('d-none');
                $('#app-spinner-wrapper').removeClass('d-none');
                return this;
                break;

            case 'hide':

                $('#app-spinner-wrapper').addClass('d-none');
                $('#app-wrapper').removeClass('d-none');
                return this;
                break;

            default:
                return this;
                break;
        }
    }


    moduleSpinner = function ( mode ){
        switch (mode){
            case 'show':
                
                $('#module-wrapper').addClass('d-none');
                $('#module-spinner-wrapper').removeClass('d-none');
                return this;
                break;

            case 'hide':

                $('#module-spinner-wrapper').addClass('d-none');
                $('#module-wrapper').removeClass('d-none');
                return this;
                break;

            default:
                return this;
                break;
        }
    }



    moduleLoad = function ( moduleName = null ){

        // Turn off all body-related click event handlers 
        $('body').off('click');

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
        .always(function(){});
    }


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

