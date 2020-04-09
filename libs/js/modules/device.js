$(function () {

    let deviceOpenned = null;

    // Defining the needed spinner
    app.spinnerType = 'module';



    /*
     *
     * FUNCTION TO CHECK SOME HEADERS 
     * BEFORE LOADING THE MODULE
     * 
     */ 
    function antiTamper(){

        app.spinnerType = 'module';
        let moduleHeaders;

        if (sessionStorage.getItem("app.module.headers") === null) {
            app.moduleLoad('home');
        }

        moduleHeaders = JSON.parse(sessionStorage.getItem('app.module.headers'));
        
        if(moduleHeaders.hasOwnProperty('data') == false){
            app.moduleLoad('home');
        };

        if(moduleHeaders.data.hasOwnProperty('device') == false){
            app.moduleLoad('home');
        };
    }

    

    /*
     *
     * MAIN CODE
     * 
     */ 

    // Check the headers
    antiTamper();

    // Spy for storage header changes
    window.addEventListener('storage', function(){
        antiTamper();
    });

    deviceOpenned = JSON.parse(sessionStorage.getItem('app.module.headers')).data.device;

    // Write the group name over the content
    //$('#group-name').append(groupOpenned);

    //console.warn(typeof deviceOpenned)

    device.getProfile(deviceOpenned, function(result){

        // The call fail, go to home
        if(result === false){ 
            app.moduleLoad('home')
        }

        // Store the params of the device
        let modelName        = result.device.name;
        let modelType        = result.device.type;
        let modelDescription = result.device.description;
        let offsetToPanel    = $('#panel-wrapper').offset().top;

        $('#panel-wrapper').empty();

        // We have defined model
        if(config.models.allowed.hasOwnProperty(modelType)){

            $.get({
                url: 'models/' + modelType + '.html', 
                cache: config.models.cached
            }).then(function( response ){
                $('#panel-wrapper').html(response);

                // Write device profile into panel
                $('#modelName').empty().append(modelName);
                $('#modelType').empty().append(modelType);
                $('#modelDescription').empty();

                // Write the description only if there IS a description
                if ( 
                    modelDescription !== null && 
                    modelDescription.toLowerCase() !== 'null' && 
                    modelDescription !== 'undefined'
                )
                {
                    $('#modelDescription').append(modelDescription);
                }

            });
            
        // We have UNdefined model
        }else{

            $.get({
                url: 'models/undefined.html', 
                cache: config.models.cached
            }).then(function( response ){
                $('#panel-wrapper').html(response);

                // Write device profile into panel
                $('#modelName').empty().append(modelName);
            });

        }

        // Scroll to the panel
        $('html,body').animate({scrollTop: offsetToPanel}, 1000);   

    });


});
