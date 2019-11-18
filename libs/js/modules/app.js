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

        // Fix the 'this' context
        //var thisClass = this ;

        // Show the spinner
        //thisClass.moduleSpinner('show');

        // Load the module and hide the spinner
        $.get(moduleName + '.m')
        .done(function( data ) {
            $("#module-wrapper").html(data);
        })
        .fail(function() {
            $("#module-wrapper").load('404.m');
        })
        .always(function(){
            /*setTimeout(function(){
                thisClass.moduleSpinner('hide');
            }, 1000);*/
        });

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
    * This function -----
    * 
    * */
   sendModal = function (title, body, tag){

        // Check the fields
        if( typeof title !== 'string' ){
            return;
        }

        if( typeof body !== 'string' ){
            return;
        }

        if( typeof tag !== 'string' ){
            return;
        }

        // Set the title of the modal
        $('#modal-title').html('').append(title);

        // Set the content of the modal
        $('#modal-body').html('').append(body);

        // Set the new tag for callback
        $('#modal-footer > button[x-modal-callback-tag]').attr('x-modal-callback-tag' , tag);

        /*if( typeof callback !== 'function' ){
            return;
        }
        callback();  */  
    }

}

