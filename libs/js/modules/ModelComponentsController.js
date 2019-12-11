export class ModelComponentsController {

    constructor () {

        // Construct a cache memory for status
        this.statusCache = {};

    }



    /*
     *
     * Render GUI components from statusCache values
     * 
     * Will be defined in the child instances
     * 
     */
    renderFromCache = function () {

        console.log( 'rendering' );

    }



    /*
     *
     * This update the statusCache atribute of this
     * class instance with a new value given by a JSON
     * done like the following
     *   {
     *     command : "power/color/...",
     *     routine : true/false,
     *     field   : "step/state/..."
     *     value   : "value-here" 
     *   }
     */
    updateStatusCache = function ( statusHolder = {}){

        // Check statusHolder
        if ( typeof statusHolder !== 'object' )
            return this.statusCache;

        if ( statusHolder.hasOwnProperty('command') !== true )
            return this.statusCache;

        if ( statusHolder.hasOwnProperty('routine') !== true )
            return this.statusCache;

        if ( statusHolder.hasOwnProperty('field') !== true )
            return this.statusCache;
        
        if ( statusHolder.hasOwnProperty('value') !== true )
            return this.statusCache;

        // 
        if ( statusHolder.routine === true ){
            this.statusCache['routine'][statusHolder.command][statusHolder.field] = statusHolder.value;
        }else{
            this.statusCache[statusHolder.command][statusHolder.field] = statusHolder.value;
        }

        return this.statusCache;
    }



    /*
     *
     * Detect input components with the right tags,
     * build the order, send it to the server,
     * update the statusCache and re-set the values 
     * of components
     * 
     * once executed, this runs in the backgrounds until refresh or $.off()
     */
    detectAndSync = function ( device , callback ){

        $('body').off('change');

        // Detecting status change
        $('body').on('change', 'input', function(){

            // Save current state
            let currentStatus = this.statusCache;

            // Save future status
            let statusHolder   = {
                command : null,
                routine : false,
                field   : null,
                value   : null
            };

            // Save sendable fields

            let command        = $(this).attr('x-command');
            let routine        = $(this).attr('x-routine');

            // Save cache vars for building final string
            let order          = '';
            let data           = '';

            // Build the basic part of the order
            order = 'for|' + device + '|' + command;
            statusHolder['command'] = command;

            // Add the name of routine if present
            if ( typeof routine !== 'undefined' ) {
                data += 'name#' + routine + '|';
                statusHolder['command'] = routine;
                statusHolder['routine'] = true;
            }

            // Add other information fields
            // For switches
            if( $(this).attr('type') === 'checkbox' ){
                data += 'state#' + $(this).prop('checked') + '|';
                statusHolder['field'] = 'state';
                statusHolder['value'] = $(this).prop('checked');
            }

            // For sliders
            if( $(this).attr('type') === 'range' ){
                data += 'step#' + $(this).prop('value') + '|';
                statusHolder['field'] = 'step';
                statusHolder['value'] = $(this).prop('value');
            }

            // Build the entire order
            order += '|' + data;

            // Sending the order to the device
            app.spinnerType = 'bar';

            window.device.sendAndGet( device, command, (result) => {

                if( result !== false ){

                    // Check answer
                    if ( result.data.state === 'error' ) {

                        // Update values
                        this.statusCache = currentStatus;

                        // Inform the user
                        app.sendToast('Oops! There was a mistake :( ');

                        return;
                    }

                    // Update values
                    this.statusCache = this.updateStatusCache(statusHolder);

                    // Inform the user
                    app.sendToast('Task done');

                }else{

                    // Update values
                    this.statusCache = currentStatus;

                    // Inform the user
                    app.sendToast('Oops! Device is sleeping. Reboot it please :(');
                    
                }

                // Execute extra actions
                callback();
                
            }, data);

        });
    }



    /*
     *
     * Turn named switch to a value
     * 
     */
    setGuiSwitch = function ( name, routine, state ){

        let selector;
        
        if ( routine === true ){
            // If routine flag is set
            selector = $('body').find('input[type="checkbox"][x-command="routine"][x-routine="'+name+'"]');
        }else{
            // Not a routine
            selector = $('body').find('input[type="checkbox"][x-command="'+name+'"]');
        }
            
        // Not a forced value?, let it live
        if (typeof state !== 'boolean' ){
            state = selector.prop('checked');
        }

        // Setting the state of power switch
        selector.prop('checked', state);
    }



    /*
     *
     * Change brightness slider value to a 
     * defined step
     * 
     */
    setGuiBrightness = function ( step ){
        if (typeof step !== 'number' ){
            step = $('body').find('input[type="range"][x-command="brightness"]').val();
        }

        // Calculate the RGB Value from HSL
        let brightness = color.hslToRgb( 0.155, 1, step/255);

        brightness[0] = Math.round(brightness[0]);
        brightness[1] = Math.round(brightness[1]);
        brightness[2] = Math.round(brightness[2]);

        // Setting the brightness square color
        $('body').find('div[x-label-for="brightness"]').css('background-color', 'rgb('+brightness[0]+','+brightness[1]+','+brightness[2]+')');
            //.fadeOut( 400 ).fadeIn( 100 );
            
        // Resetting the slider
        $('body').find('input[type="range"][x-command="brightness"]').val(step);
    }



    /*
     *
     * Change color slider value to a 
     * defined step
     * 
     */
    setGuiColor = function ( step ){
        if (typeof step !== 'number' ){
            step = $('body').find('input[type="range"][x-command="color"]').val();
        }

        // Calculate the RGB Value from HSL
        let colorRGB = color.hslToRgb( step/255, 0.8, 0.8);

        colorRGB[0] = Math.round(colorRGB[0]);
        colorRGB[1] = Math.round(colorRGB[1]);
        colorRGB[2] = Math.round(colorRGB[2]);

        // Setting the brightness square color
        $('body').find('div[x-label-for="color"]').css('background-color', 'rgb('+colorRGB[0]+','+colorRGB[1]+','+colorRGB[2]+')');
            //.fadeOut( 1000 ).fadeIn( 1000 );
            
        // Resetting the slider
        $('body').find('input[type="range"][x-command="color"]').val(step);
    }

    


}