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
     * Call the appropiate method for each component
     * injected in domElement
     * 
     */
    updateComponent = function ( domElement ){

        let componentType = domElement.getAttribute("x-component-type");

        switch (componentType) {

            case 'switch':

                this.updateSwitch( domElement );
                break;

            case 'brightness-slider':

                this.updateBrightnessSlider( domElement );
                break;

            case 'color-slider':
            
                this.updateColorSlider( domElement );
                break;

            case 'timer-slider':
        
                this.updateTimerSlider( domElement );
                break;
        
            default:

                console.log('x-component-type not found in component: ' + domElement );
                break;
        }

    }



    /*
     *
     * Turn named switch to a value
     * 
     */
    updateSwitch( domElement, state ){

        // Check if switch is a checkbox
        if( domElement.getAttribute("type") !== 'checkbox' ){
            console.log ( '[GUI]: Switch malformed' )
        }

        // Not a forced value?, let it live
        if (typeof state !== 'boolean' ){
            state = domElement.getAttribute('checked');
        }

        // Setting the state of power switch
        domElement.setAttribute('checked', state);

    }



    /*
     *
     * Change brightness slider value to a 
     * defined step
     * 
     */
    updateBrightnessSlider( domElement, step ){

        // Check if this is a slider
        if( domElement.getAttribute('type') !== 'range' ){
            console.log ( '[GUI]: Slider malformed' )
        }
    
        // Check if i have a forced number
        if (typeof step !== 'number' ){
            step = domElement.value;
        }

        // Calculate the RGB Value from HSL
        let brightness = color.hslToRgb( 0.155, 1, step/255);

        brightness[0] = Math.round(brightness[0]);
        brightness[1] = Math.round(brightness[1]);
        brightness[2] = Math.round(brightness[2]);

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElement.getAttribute('x-command') +'"]').style.background = 'rgb('+brightness[0]+','+brightness[1]+','+brightness[2]+')';

        // Resetting the slider
        domElement.setAttribute( 'value', step );
    
    }



    /*
     *
     * Change color slider value to a 
     * defined step
     * 
     */
    updateColorSlider( domElement, step ){

        // Check if this is a slider
        if( domElement.getAttribute('type') !== 'range' ){
            console.log ( '[GUI]: Slider malformed' )
        }

        if (typeof step !== 'number' ){
            step = domElement.value;
        }

        // Calculate the RGB Value from HSL
        let colorRGB = color.hslToRgb( step/255, 0.8, 0.8);

        colorRGB[0] = Math.round(colorRGB[0]);
        colorRGB[1] = Math.round(colorRGB[1]);
        colorRGB[2] = Math.round(colorRGB[2]);

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElement.getAttribute('x-command') +'"]').style.background = 'rgb('+colorRGB[0]+','+colorRGB[1]+','+colorRGB[2]+')';
            
        // Resetting the slider
        domElement.setAttribute( 'value', step );
    }



    /*
     *
     * Change timer slider value to a 
     * defined step
     * 
     */
    updateTimerSlider = function ( step ){

        // Check if this is a slider
        if( domElement.getAttribute('type') !== 'range' ){
            console.log ( '[GUI]: Slider malformed' )
        }

        if (typeof step !== 'number' ){
            step = domElement.value;
        }

        // First part of the slider
        let divider = 3;
        let squareInfo = Math.round( step / divider) + 'm';

        // Second part of the slider
        if ( step > 179 ){
            divider = 15;
            squareInfo = Math.round( (step-180) / divider);

            // Bugfix
            if ( squareInfo == 0 ){ squareInfo = 1 }

            squareInfo += 'h';
        }

        // Setting the brightness square color
        document.querySelector('[x-label-for="'+ domElement.getAttribute('x-command') +'"]').innerHTML = squareInfo;
            
        // Resetting the slider
        domElement.setAttribute( 'value', step );

    }

    


}