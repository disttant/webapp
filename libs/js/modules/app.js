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
                
                $('#module-wrapper').addClass('d-none');
                $('#spinner-wrapper').removeClass('d-none');
                return this;
                break;

            case 'hide':

                $('#spinner-wrapper').addClass('d-none');
                $('#module-wrapper').removeClass('d-none');
                return this;
                break;

            default:
                return this;
                break;
        }
    }



    moduleLoad = function ( moduleName = null ){

        $.get(moduleName + '.m')
        .done(function( data ) {
            $("#content").html(data);
        })
        .fail(function() {
            $("#content").html('404 not found');
        })
        .always(function(){});

    }



    toggleSidebar = function () {
        
    }

}

