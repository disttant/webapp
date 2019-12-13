export class ModelComponentsController {

    constructor () {

        // Construct a cache memory for status
        this.statusCache = {};

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
     * Creates an event handler for updating
     * GUI components on each change
     * 
     */
    initComponents = function (){

        // Bugfix for environment reference
        let classThis = this;

        // Update GUI elements from cache values

        function _func (){

            // Update representation of value
            classThis.updateComponent ( event.target );
        }

        document.removeEventListener("input", _func );

        document.addEventListener("input", _func );

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
                data += 'value#' + $(this).prop('checked') + '|';
                statusHolder['field'] = 'value';
                statusHolder['value'] = $(this).prop('checked');
            }

            // For sliders
            if( $(this).attr('type') === 'range' ){
                data += 'value#' + $(this).prop('value') + '|';
                statusHolder['field'] = 'value';
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
     * Call the appropiate method for each component
     * injected in domElement
     * 
     */
    updateComponent = function ( domElement, value ){

        let componentType = domElement.getAttribute("x-component-type");

        switch (componentType) {

            case 'switch':

                this.updateSwitch( domElement, value );
                break;

            case 'brightness-slider':

                this.updateBrightnessSlider( domElement, value );
                break;

            case 'color-slider':
            
                this.updateColorSlider( domElement, value );
                break;

            case 'timer-slider':
        
                this.updateTimerSlider( domElement, value );
                break;
        
            default:

                console.log('x-component-type not found in component: ' + domElement );
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

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElement.getAttribute('x-command') +'"]').style.background = 'rgb('+brightness[0]+','+brightness[1]+','+brightness[2]+')';

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

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElement.getAttribute('x-command') +'"]').style.background = 'rgb('+colorRGB[0]+','+colorRGB[1]+','+colorRGB[2]+')';
            
        // Resetting the slider
        domElement.setAttribute( 'value', value );
    }



    /*
     *
     * Change timer slider value to a 
     * defined step-value
     * 
     */
    updateTimerSlider = function ( value ){

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

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElement.getAttribute('x-command') +'"]').innerHTML = squareInfo;
            
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

        for (var command in this.statusCache) {

            // Take the command element
            let commandDomElement = document.querySelector('[x-command="'+ command +'"]');

            // Dont update the command components that does not exists
            if ( commandDomElement == null ){
                continue;
            }

            // Update component when not calling a routine
            if ( command !== 'routine'){
                // Update it
                this.updateComponent( commandDomElement, this.statusCache[command].value );
                continue;
            }
            
            // Special procedure to update component when calling a routine
            for (var routine in this.statusCache['routine']) {

                let routineDomElement = document.querySelector('[x-command="routine"][x-routine="'+ routine +'"]');

                // Dont update routine components that does not exists
                if ( routineDomElement === null ){
                    continue;
                }

                // Update it
                this.updateComponent( routineDomElement, this.statusCache['routine'][routine].value );
                
            }
        }

    }

    


}