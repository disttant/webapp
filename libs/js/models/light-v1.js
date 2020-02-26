$(function() {

    /*
    *
    * GLOBAL VARS
    * 
    */
    var device = $('#modelName').html();
    $('body').find('[loader]').show();
    $('body').find('[error]').hide();
    $('body').find('[component]').hide();

    // Retrieve status from device

    ModelComponents.statusCache = {

        power : {
            value : false,
        },
        brightness : {
            value : 127,
        },
        color: {
            value: 43,
        },
        routine : {
            presence    : {
                value : false,
            },
            nightmare  : {
                value : false,
            },
            party       : {
                value : false,
            },
        }

    }



    // Event: Update GUI components on input change
    ModelComponents.initComponents();

    // Sync from device, retrieve data and set statusCache
    ModelComponents.syncStatusCache( device, function( result ){

        // If result can not be achieved
        if ( result === false ){

            app.sendToast( 'Oops! Device made a mistake. Retry, please.' );

            $('body').find('[loader]').hide();
            $('body').find('[error]').show();
            $('body').find('[component]').hide();
            return;
        }

        // Show the cache
        //console.log('[GUI]: statusCache: ', window.ModelComponents.statusCache);

        // Set GUI to statusCache values
        window.ModelComponents.updateComponentsFromCache();

        // Show the components
        $('body').find('[loader]').hide();
        $('body').find('[error]').hide();
        $('body').find('[component]').show();

    });


    // Event: Detect component change and send it to the server
    ModelComponents.detectAndSync(device, function(){

        // Set GUI to statusCache values
        window.ModelComponents.updateComponentsFromCache();
            
    });


});