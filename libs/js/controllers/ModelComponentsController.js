/*
 *  This class is a components library for making panels for hardware models with ease
 * 
 *  Alby Hernández // me@achetronic.com // 15-12-2019
 * 
 *  CONSTRUCTOR:           Create a class property to store the status of the device
 *  -->
 * 
 *  
 *  METHODS:
 * 
 *  --> syncStatusCache:            Communicate with the device and retrieve the response. Then update statusCache
 * 
 *      NEEDS:                      Device to communicate with, An arrow function to execute after that
 *      RETURNS:                    VOID
 * 
 *  --> updateStatusCache:          This update a list of properties in statusCache 
 *                                  given by the input parameter of the method
 * 
 *      NEEDS:                      A JSON with the following structure
 *                                  {
 *                                      power      : true | "true",
 *                                      brightness : 75 | "75",
 *                                      color      : 125 | "125",
 *                                      .
 *                                      .
 *                                      .
 *                                  }
 *      RETURNS:                    VOID 
 * 
 *  --> updateStatusCacheField      This function changes safetly an item into statusCache 
 * 
 *      NEEDS:                      A JSON with the following structure
 *                                  {
 *                                      command : "{power|color|brightness|pomodoro}",
 *                                      field   : "value"
 *                                      value   : "{value}" 
 *                                  }
 *      RETURNS:                    A JSON with statusCache
 * 
 *  --> initComponents:             Create an event listener to watch changes of component and update them
 * 
 *      NEEDS:                      VOID
 *      RETURNS:                    VOID
 * 
 * --> updateComponent:             Change the value of a GUI component
 * 
 *      NEEDS:                      A DOM element with x-component-type tag. A value to be set
 *      RETURNS:                    VOID
 * 
 * --> updateSwitch:                Change the value of a GUI switch component
 * 
 *      NEEDS:                      A DOM element with checkbox type tag. A value to be set
 *      RETURNS:                    VOID
 * 
 * --> updateBrightnessSlider:      Change the value of a GUI brightness slider component and set 
 *                                  the background color into its tag square
 * 
 *      NEEDS:                      A DOM element with range type tag. A value to be set
 *      RETURNS:                    VOID
 * 
 * --> updateColorSlider:           Change the value of a GUI color slider component and set 
 *                                  the background color into its tag square
 * 
 *      NEEDS:                      A DOM element with range type tag. A value to be set
 *      RETURNS:                    VOID
 * 
 * --> updateTimerSlider:           Change the value of a GUI timer slider component and set 
 *                                  the number into its tag square
 * 
 *      NEEDS:                      A DOM element with range type tag. A value to be set
 *      RETURNS:                    VOID
 * 
 * --> updateComponentsFromCache:   Update all the values and graphical position of GUI components
 *                                  taking the values from statusCache
 * 
 *      NEEDS:                      VOID
 *      RETURNS:                    VOID
 *
 * --> detectAndSync:               Create an event listener to detect changes on GUI components
 *                                  build the string to be sent to the device, send it and parse
 *                                  the response. Then update the statusCache with changes and execute
 *                                  a callback function
 * 
 *      NEEDS:                      Device name to sync with. Callback to be executed after processing
 *      RETURNS:                    VOID
 * 
 * 
 */

export class ModelComponentsController {

    constructor () {

        // Construct a cache memory for status
        this.statusCache = {};
        this.debug       = false;
    }



    /*
     *
     * Send 'sync' command, get the
     * response. Then, process and save it 
     * into statusCache
     * 
     */
    syncStatusCache = function ( device, callback ){

        if( this.debug === true ){
            console.log('[GUI]: Syncing Status Cache');
        }
        
        // Saving the environment of class auto reference
        let thisClass = this;

        // Send the message to the device
        app.spinnerType = 'bar';

        window.device.sendAndGet( device, 'sync', function( result ) {

            if( this.debug === true ){
                console.warn ( result );
            }

            // Result could not be achieved
            if ( result === false ){

                // Execute extra functions and quit
                callback( result = false );
                return;
            }

            thisClass.updateStatusCache( result.data );

            callback( result );
        });
    }



    /*
     *
     * This update a list of properties in statusCache 
     * given by the input parameter of the method
     *   {
     *     power      : true | "true",
     *     brightness : 75 | "75",
     *     color      : 125 | "125",
     *     .
     *     .
     *     .
     *   }
     * 
     * 
     */
    updateStatusCache = function ( newPropertiesObj ){

        // Building a function to process incoming data
        function stringToReal( value ){

            if ( value.match(/^([-+]?([0-9]*\.[0-9]+|[0-9]+))$/) !== null ) {

                return Number(value);

            } else if( value.match(/^(true|false){1}$/) !== null ) {

                return JSON.parse(value.toLowerCase());
                
            }else{
                return String(value);
            }
        }

        // We have a result, save it
        for (var order in newPropertiesObj ) {

            this.updateStatusCacheField ( { 
                command :  order,
                field   : 'value',
                value   :  stringToReal(newPropertiesObj[order]),
            })

        }

    }



    /*
     *
     * This update the statusCache atribute of this
     * class instance with a new value given by a JSON
     * done like the following
     *   {
     *     command : "power/color/...",
     *     field   : "value"
     *     value   : "{value}" 
     *   }
     */
    updateStatusCacheField = function ( statusHolder = {}){

        if( this.debug === true ){
            console.log('[GUI]: Updating Status Cache');
        }

        // Check statusHolder
        if ( typeof statusHolder !== 'object' )
            return this.statusCache;

        if ( statusHolder.hasOwnProperty('command') !== true )
            return this.statusCache;
        
        if ( statusHolder.hasOwnProperty('field') !== true )
            return this.statusCache;
        
        if ( statusHolder.hasOwnProperty('value') !== true )
            return this.statusCache;

        // Try to change the command in main properties
        if ( this.statusCache.hasOwnProperty(statusHolder.command) ){

            this.statusCache[statusHolder.command][statusHolder.field] = statusHolder.value;
        }

        // Command is not present in main properties. Try into routines
        if ( this.statusCache['routine'].hasOwnProperty(statusHolder.command) ){

            this.statusCache['routine'][statusHolder.command][statusHolder.field] = statusHolder.value;
        }

        return this.statusCache;
    }



    /*
     *
     * Creates an event handler for updating
     * GUI components on each change
     * 
     */
    initComponents = function (){

        if( this.debug === true ){
            console.log('[GUI]: Building Components Watchdog');
        }

        // Bugfix for environment reference
        let thisClass = this;

        // Update GUI elements from cache values
        $( 'body' ).off( 'input' );

        $( 'body' ).on( 'input', function(){

            thisClass.updateComponent ( event.target );

            //thisClass.updateComponentsFromCache();
        });

    }



    /*
     *
     * Call the appropiate method for each component
     * injected in domElement
     * 
     */
    updateComponent = function ( domElement, value ){

        if( this.debug === true ){
            console.log('[GUI]: Updating Component Status');
        }

        let componentType = domElement.getAttribute("x-component-type");

        let thisClass = this;

        switch (componentType) {

            case 'switch':

                thisClass.updateSwitch( domElement, value );
                break;

            case 'brightness-slider':

                thisClass.updateBrightnessSlider( domElement, value );
                break;

            case 'color-slider':
            
                thisClass.updateColorSlider( domElement, value );
                break;

            case 'timer-slider':
        
                thisClass.updateTimerSlider( domElement, value );
                break;
        
            default:
                if( this.debug === true ){
                    console.log('[GUI] Component Type Not Found');
                }
                break;
        }

    }



    /*
     *
     * Turn named switch to a bool-value
     * 
     */
    updateSwitch( domElement, value ){

        // Check if switch is a checkbox
        if( domElement.getAttribute("type") !== 'checkbox' ){
            if( this.debug === true ){
                console.log ( '[GUI]: Switch malformed' )
            }
        }

        // Not a forced value?, let it live
        if ( typeof value !== 'boolean' ){
            value = domElement.checked;
        }

        // Setting the state of power switch
        domElement.checked = value;

    }



    /*
     *
     * Change brightness slider value to a 
     * defined step-value
     * 
     */
    updateBrightnessSlider( domElement, value ){

        // Check if this is a slider
        if( domElement.getAttribute('type') !== 'range' ){
            if( this.debug === true ){
                console.log ( '[GUI]: Slider malformed' )
            }
        }
    
        // Check if i have a forced number
        if (typeof value !== 'number' ){
            value = domElement.value;
        }

        // Calculate the RGB Value from HSL
        let brightness = color.hslToRgb( 0.155, 1, value/255);

        brightness[0] = Math.round(brightness[0]);
        brightness[1] = Math.round(brightness[1]);
        brightness[2] = Math.round(brightness[2]);

        // Get the label
        let domElementCommand = domElement.getAttribute('x-command');

        if ( domElementCommand === 'routine' ){
            domElementCommand = domElement.getAttribute('x-routine');
        }

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElementCommand +'"]').style.background = 'rgb('+brightness[0]+','+brightness[1]+','+brightness[2]+')';

        // Resetting the slider
        domElement.setAttribute( 'value', value );
        domElement.value = value;
    
    }



    /*
     *
     * Change color slider value to a 
     * defined step-value
     * 
     */
    updateColorSlider( domElement, value ){

        // Check if this is a slider
        if( domElement.getAttribute('type') !== 'range' ){
            if( this.debug === true ){
                console.log ( '[GUI]: Slider malformed' )
            }
        }

        if (typeof value !== 'number' ){
            value = domElement.value;
        }

        // Calculate the RGB Value from HSL
        let colorRGB = color.hslToRgb( value/255, 0.8, 0.8);

        colorRGB[0] = Math.round(colorRGB[0]);
        colorRGB[1] = Math.round(colorRGB[1]);
        colorRGB[2] = Math.round(colorRGB[2]);

        // Get the label
        let domElementCommand = domElement.getAttribute('x-command');

        if ( domElementCommand === 'routine' ){
            domElementCommand = domElement.getAttribute('x-routine');
        }

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElementCommand +'"]').style.background = 'rgb('+colorRGB[0]+','+colorRGB[1]+','+colorRGB[2]+')';
            
        // Resetting the slider
        domElement.setAttribute( 'value', value );
        domElement.value = value;
    }



    /*
     *
     * Change timer slider value to a 
     * defined step-value
     * 
     */
    updateTimerSlider = function ( domElement, value ){

        // Check if this is a slider
        if( domElement.getAttribute('type') !== 'range' ){
            if( this.debug === true ){
                console.log ( '[GUI]: Slider malformed' )
            }
        }

        if (typeof value !== 'number' ){
            value = domElement.value;
        }

        // First part of the slider
        let divider = 3;
        let squareInfo = Math.round( value / divider) + 'm';

        // Second part of the slider
        if ( value > 179 ){
            divider = 15;
            squareInfo = Math.round( (value-180) / divider);

            // Bugfix
            if ( squareInfo == 0 ){ squareInfo = 1 }

            squareInfo += 'h';
        }

        // Get the label
        let domElementCommand = domElement.getAttribute('x-command');

        if ( domElementCommand === 'routine' ){
            domElementCommand = domElement.getAttribute('x-routine');
        }

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElementCommand +'"]').innerHTML = squareInfo;
            
        // Resetting the slider
        domElement.setAttribute( 'value', value );
        domElement.value = value;

    }



    /*
     *
     * This take the commands from statusCache
     * and update components with those values
     * 
     */
    updateComponentsFromCache = function (){

        if( this.debug === true ){
            console.log('[GUI]: Updating Components From Status Cache');
        }

        let thisClass = this;

        for (var command in thisClass.statusCache) {

            // Take the command element
            let commandDomElement = document.querySelector('[x-command="'+ command +'"]');

            // Dont update the command components that does not exists
            if ( commandDomElement == null || typeof commandDomElement == 'undefined'){
                continue;
            }

            

            // Update component when not calling a routine
            if ( command !== 'routine'){
                
                // Update it
                thisClass.updateComponent( commandDomElement, thisClass.statusCache[command].value );
                continue;
            }
            
            // Special procedure to update component when calling a routine
            for (var routine in thisClass.statusCache['routine']) {

                let routineDomElement = document.querySelector('[x-command="routine"][x-routine="'+ routine +'"]');

                // Dont update routine components that does not exists
                if ( routineDomElement == null || typeof routineDomElement == 'undefined'){
                    continue;
                }

                // Update it
                thisClass.updateComponent( routineDomElement, thisClass.statusCache['routine'][routine].value );

            }
            
        }

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

        let thisClass = this;

        if( this.debug === true ){
            // Debug purposes only
            console.log('[GUI]: Starting detectAndSync()');
        }

        // Build a function to be called when event is shot
        function _func (){

            // Save current state
            let currentStatus = thisClass.statusCache;
            
            // Save future status
            let statusHolder   = {
                command : null,
                routine : false,
                field   : null,
                value   : null
            };

            // Save sendable fields
            let command        = event.target.getAttribute('x-command');
            let routine        = event.target.getAttribute('x-routine');

            // Save cache vars for building final string
            let order          = '';
            let data           = '';

            // Build the basic part of the order
            order = 'for|' + device + '|' + command;
            statusHolder['command'] = command;

            // Add the name of routine if present
            if ( typeof routine !== 'undefined' && routine != null ) {
                data += 'name#' + routine + '|';
                statusHolder['command'] = routine;
                statusHolder['routine'] = true;
            }

            // Add other information fields
            // For switches
            let inputType = event.target.getAttribute('type');
            if( inputType === 'checkbox' ){
                data += 'value#' + event.target.checked + '|';
                statusHolder['field'] = 'value';
                statusHolder['value'] = event.target.checked;
            }

            // For sliders
            if( inputType === 'range' ){
                data += 'value#' + event.target.getAttribute('value') + '|';
                statusHolder['field'] = 'value';
                statusHolder['value'] = event.target.getAttribute('value');
            }

            if( this.debug === true ){
                // Build the entire order
                order += '|' + data;

                // Debug purposes only: filter possible starting or ending strange chars for showing the message
                if (order.startsWith("|"))
                    order = order.slice(1);
                    
                if (order.endsWith("|"))
                    order = order.slice(0, -1);  

                console.warn( '[DEBUG]: Message to send: ', order );
            }

            // filter possible starting or ending strange chars in 'data' string
            if (data.startsWith("|"))
                data = data.slice(1);
                
            if (data.endsWith("|"))
                data = data.slice(0, -1); 

            // Sending the order to the device
            app.spinnerType = 'bar';

            window.device.sendAndGet( device, command, (result) => {

                if( this.debug === true ){
                    // Debug purposes only
                    console.warn('[DEBUG]: Message recieved: ', result );
                }

                // Device DOESNT answer
                if( result === false ){

                    // Update values
                    thisClass.statusCache = currentStatus;

                    // Inform the user
                    app.sendToast('Oops! Device is sleeping. Reboot it please :(');

                    return;
                }


                // Device answer something
                // There was an error by device
                if ( result.data.response === 'error' ) {

                    // Update values
                    thisClass.statusCache = currentStatus;

                    // Inform the user
                    app.sendToast('Oops! There was a mistake :( ');

                    // Execute extra actions
                    callback();

                    return;
                }

                // Success response
                // Update values
                thisClass.updateStatusCache( result.data );

                // Inform the user
                app.sendToast('Task done');

                // Execute extra actions
                callback();
                
            }, data);

        }

        // Destroy the detector for input changes
        $( 'body' ).off( 'change' );

        // Building a detector for status change
        $( 'body' ).on( 'change', _func );

    }

}