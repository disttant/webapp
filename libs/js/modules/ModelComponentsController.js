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
 *  --> updateStatusCache           This function changes safetly an item into statusCache 
 * 
 *      NEEDS:                      A JSON with the following structure
 *                          
 *                                  {
 *                                      command : "{power|color|brightness|pomodoro}",
 *                                      routine : {true|false},
 *                                      field   : "value"
*                                       value   : "{value}" 
 *                                  }
 * 
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

    }



    /*
     *
     * Send 'sync' command, get the
     * response. Then, process and save it 
     * into statusCache
     * 
     */
    syncStatusCache = function ( device, callback ){

        console.log('[GUI]: Syncing Status Cache');

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
        
        // Saving the environment of class auto reference
        let thisClass = this;

        // Send the message to the device
        app.spinnerType = 'bar';

        window.device.sendAndGet( device, 'sync', function( result ) {

            // Result could not be achieved
            if ( result === false ){

                // Execute extra functions and quit
                callback( result = false );
                return;
            }

            // We have a result, save it
            for (var command in thisClass.statusCache ) {

                // Update component when not calling a routine
                if ( command !== 'routine'){

                    thisClass.statusCache[command].value = stringToReal( result.data[command] );
                    continue;
                }

                // Special procedure to update component when calling a routine
                for (var routine in thisClass.statusCache['routine']) {
                    thisClass.statusCache['routine'][routine].value = stringToReal( result.data[routine] );
                }
            }

            // Execute extra functions and quit
            callback( result );
        });
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

        console.log('[GUI]: Updating Status Cache');

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
     * Creates an event handler for updating
     * GUI components on each change
     * 
     */
    initComponents = function (){

        console.log('[GUI]: Building Components Watchdog');

        // Bugfix for environment reference
        let thisClass = this;

        // Update GUI elements from cache values
        $( 'body' ).off( 'input' );

        $( 'body' ).on( 'input', function(){
            thisClass.updateComponent ( event.target );
        });

        /*
        Vanilla JS version under development: 
        The problem is about identifying and removing handler

        //document.removeEventListener("input", function (){} );
        //document.addEventListener("input", function (){} );
        */
    }



    /*
     *
     * Call the appropiate method for each component
     * injected in domElement
     * 
     */
    updateComponent = function ( domElement, value ){

        console.log('[GUI]: Updating Component Status');

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

                console.log('[GUI] Component Type Not Found');
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
            console.log ( '[GUI]: Switch malformed' )
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
            console.log ( '[GUI]: Slider malformed' )
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
            console.log ( '[GUI]: Slider malformed' )
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
            console.log ( '[GUI]: Slider malformed' )
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

    }



    /*
     *
     * This take the commands from statusCache
     * and update components with those values
     * 
     */
    updateComponentsFromCache = function (){

        console.log('[GUI]: Updating Components From Status Cache');

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

        // Debug purposes only
        console.log('[GUI]: Starting detectAndSync()');

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

            // Build the entire order
            order += '|' + data;

            // Filter possible starting or ending strange chars
            if (order.startsWith("|"))
                order = order.slice(1);
                
            if (order.endsWith("|"))
                order = order.slice(0, -1);  

            // Debug purposes only
            console.warn( '[DEBUG]: Message to send: ', order );

            // Sending the order to the device
            app.spinnerType = 'bar';

            window.device.sendAndGet( device, command, (result) => {

                // Debug purposes only
                console.warn('[DEBUG]: Message recieved: ', result );

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
                if ( result.data.state === 'error' ) {

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
                thisClass.statusCache = thisClass.updateStatusCache(statusHolder);

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

        /*
        Vanilla JS under development
        // Destroy the detector for input changes
        document.querySelector("body").removeEventListener("change", function (){} );
        // Building a detector for status change
        document.querySelector("body").addEventListener("change", function (){} );
        */
    }

}