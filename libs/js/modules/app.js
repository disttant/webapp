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
        var thisClass = this ;

        // Show the spinner
        thisClass.moduleSpinner('show');

        // Load the module and hide the spinner
        $.get(moduleName + '.m')
        .done(function( data ) {
            $("#module-wrapper").html(data);
        })
        .fail(function() {
            $("#module-wrapper").load('404.m');
        })
        .always(function(){
            setTimeout(function(){
                thisClass.moduleSpinner('hide');
            }, 1000);
        });

    }


    genRandomId = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

}

