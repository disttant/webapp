$(function () {

    let groupOpenned = null;

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

        if(moduleHeaders.data.hasOwnProperty('group') == false){
            app.moduleLoad('home');
        };
    }

    

    /*
     *
     * FUNCTION TO ADAPT THE LOCATION BAR 
     * TO THE GRID SIZE
     * 
     */ 
    function adjustLocationBar(){

        let gridWidth      = $('#grid').outerWidth();
        $('#homemap-header').css('width', gridWidth);

    }



    /*
     *
     * FUNCTION TO ADAPT THE GRID 
     * TO THE WINDOW SIZE
     * 
     */ 
    function adjustGridSize(max){

        let winWidth      = $(window).outerWidth();
        let winHeight     = $(window).outerHeight();

        let navHeight     = $('#app-navbar').outerHeight();
        let headerHeight  = $('#homemap-header').outerHeight();

        let wrapperWidth = $('#grid-wrapper').outerWidth();
        let wrapperHeight = $('#grid-wrapper').outerHeight();

        let cellwidth = $('[x-coord-y]').outerWidth();
        let reference = 0;


        // Setting the size for the grid
        // Portrait
        if(winWidth < winHeight){
            reference = wrapperWidth - 0.1 * wrapperWidth;
        }

        // Landscape
        if(winWidth > winHeight){
             reference = wrapperWidth - 0.1 * wrapperWidth;
        }

        // Setting a max size for the grid
        if(reference > max)
            reference = max;

        // Setting the parameters to the grid
        $('#grid').css('height' , reference);
        $('#grid').css('width' , reference);
        $('[x-coord-y]').css('height', cellwidth);

        return cellwidth;
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

    groupOpenned = JSON.parse(sessionStorage.getItem('app.module.headers')).data.group;

    // Write the group name over the content
    $('#module-title').append(groupOpenned);

    // ADAPTING THE MAP SIZES
    config.app.timers[0] = setInterval(() => {
        adjustGridSize(700);
        adjustLocationBar()
    }, 100);

    // PREPARE TO CONSTRUCT THE GRID
    grid = $('#grid');
    grid.empty();

    let x_length = config.map.width;
    let y_length = config.map.height;
    let door = new Array();
    
    // DEFINE THE CENTRAL CELLS (DOOR)
    if(y_length % 2 !== 0){
        door[0] = Math.floor(y_length / 2);
        door[1] = door[0] + 1;
        door[2] = door[1] + 1;
    }else{
        door[0] = y_length / 2;
        door[1] = door[0] + 1;
        door[2] = 0;
    }

    // CONSTRUCTION OF THE GRID
    // Building each column
    for(let i = 1 ; i < x_length + 1 ; i++){

        let row = '<div x-coord-x="'+ i +'" class="d-flex"></div>';
        grid.append(row);

        // Filling each column with rows
        for(let j = 1 ; j < y_length + 1 ; j++){

            let col = '';

            // Defining the style for cells
            if((i === x_length) && ((j === door[0]) || (j === door[1]) || (j === door[2])))
                // Door cells different styled
                col = '<div class="flex-fill border border-black bg-black rounded-top"></div>';
            else
                // normal cells
                col = '<div x-coord-y="'+ j +'" class="flex-fill border border-oldgrey rounded"></div>';

            // Add the cell to the grid
            $('[x-coord-x="'+ i +'"]').append(col);
        }
    }

    
    let nocoords = new Array();

    group.getFullGroupWithInfo(groupOpenned, function(result){

        if(result !== false){

            // CHECK CHANNELS MODELS
            $('body').on('click', '[x-coord-y]', function(clicked){

                let y_value = $(this).attr('x-coord-y');
                let x_value = $(this).parent().attr('x-coord-x');

                // DO SOMETHING WHEN CLICK ON ANY MAP CELL

            });

            // LOOK FOR THE GROUP THAT OPEN THE MAP
            // GET THE CHANNELS OF THAT GROUP
            // PUT THE CHANNELS IN MAP, 2 OPTIONS:
            // -> INTO SIDELINE, CAUSE DOESNT HAS COORDS IN CLOUD DB
            // -> INTO COORDS OBTAINED FROM CLOUD DB

            if(result.group.length > 0){

                for(let i = 0 ; i < result.group[0].devices.length ; i++){

                    let type = result.group[0].devices[i].type;
                    let coords = result.group[0].devices[i].map;

                    if((coords[0] === null) || (coords[1] === null))
                        continue;

                    if((coords[0] < 0) || (coords[1] < 0))
                        continue;

                    if((coords[0] > config.map.width) || (coords[1] > config.map.height))
                        continue;

                    if((coords[0] === 0) || (coords[1] === 0))
                        nocoords[nocoords.length] = result.group[0].devices[i];

                    let color = '';

                    // Defining the color of the cell according to the device type
                    if(config.models.allowed.hasOwnProperty(type)){
                        color = config.models.allowed[type];
                    }else{
                        color = config.models.allowed.undefined;
                    }

                    $('[x-coord-x="'+ coords[0] +'"] > [x-coord-y="'+ coords[1] +'"]').css('background-color', color);
                    $('[x-coord-x="'+ coords[0] +'"] > [x-coord-y="'+ coords[1] +'"]')
                        .append('<div id="'+ result.group[0].devices[i].name +'" x-model="'+ result.group[0].devices[i].type +'" x-description="'+ result.group[0].devices[i].description +'"></div>');

                }

            }

        }

    });



    // Cell click detector
    $('[x-coord-y]').on('click', function(){


        if($(this).children().length === 0){

            
            // Empty cell clicked
            if(nocoords.length > 0){

                // AÑADIR CANAL AL MAPA
                let clicked = $(this);
                let defaultOption = 'Choose...';
                let title = 'Select Device to add to this cell';
                let bodyStart = '<select id="device-name" class="flex-fill form-control"><option>'+ defaultOption +'</option>';
                let bodyContent = '';
                let bodyEnd = '</select>';

                for(let i = 0 ; i < nocoords.length ; i++){

                    bodyContent = bodyContent + '<option>' + nocoords[i].name + '</option>';

                }

                let body = bodyStart + bodyContent + bodyEnd;

                app.sendModal(title, body, function(){

                    let deviceName = $('#modal-body > #device-name').val();

                    if(deviceName !== defaultOption){

                        let color = '';
                        let index = nocoords.findIndex(item => item.name === deviceName);

                        if(config.models.allowed.hasOwnProperty(nocoords[index].type)){
                            color = config.models.allowed[nocoords[index].type];
                        }else{
                            color = config.models.allowed.undefined;
                        }

                        let y_value = Number(clicked.attr('x-coord-y'));
                        let x_value = Number(clicked.parent().attr('x-coord-x'));

                        device.saveMapCoords(deviceName, x_value, y_value, function(result){

                            if(result !== false){
                                clicked.css('background-color', color);
                                clicked.append('<div id="'+ deviceName +'" x-model="'+ nocoords[index].type +'"></div>');
                                nocoords.splice(index, 1);
                            }

                        });

                    }

                });

            }else{

                // NO HAY CANALES LIBRES EN EL GRUPO
                app.sendToast('Oops! You have no more devices into the group');

            }

        }else{

            

            // ABRIR PANEL DEL CANAL
            let modelName = $(this).children()[0].id;
            let modelType = $(this).children().attr('x-model');
            let modelDescription = $(this).children().attr('x-description');
            let offsetToPanel = $('#panel-wrapper').offset().top;

            $('#panel-wrapper').empty();
            
            // We have defined model
            if(config.models.allowed.hasOwnProperty(modelType)){

                $.get({
                    url: 'models/' + modelType + '.html', 
                    cache: config.models.cached
                }).then(function( response ){
                    $('#panel-wrapper').html(response);

                    // PASAR DATOS NECESARIOS EN EL PANEL(SI HACE FALTA)
                    $('#modelName').empty().append(modelName);
                    $('#modelType').empty().append(modelType);
                    $('#modelDescription').empty();

                    // Write the description only if there IS a description
                    if ( modelDescription !== null && modelDescription.toLowerCase() !== 'null' && modelDescription !== 'undefined'){
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

                    // PASAR DATOS NECESARIOS EN EL PANEL(SI HACE FALTA)
                    $('#modelName').empty().append(modelName);
                });

            }

            // Scroll to the panel
            $('html,body').animate({scrollTop: offsetToPanel}, 1000);

            

        }

    });


});