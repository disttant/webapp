<div id="homemap-content" class="row mx-auto container p-0">

    
    <div id="grid-wrapper" class="d-flex col-md-7 align-items-start p-0">
        <div class="d-flex flex-column flex-grow-1">

            <!-- Location bar -->
            <div id="homemap-header" class="d-flex flex-row align-items-center mx-auto text-muted h5 font-weight-light alert alert-light border rounded" role="alert">
                <div class="px-2">
                    <a href="#" onclick="app.moduleLoad('homeMaker')">
                        <i class="material-icons md-dark md-24 align-middle">home</i>
                    </a>
                </div>
                <div class="px-2">
                    <i class="material-icons md-dark md-24 align-middle">arrow_right</i>
                </div>
                <div id="module-title" class="px-2 text-capitalize"></div>
            </div>

            <!-- Map -->
            <div id="grid" class="d-flex flex-column justify-content-center mx-auto mt-2 mb-2 border border-3 border-black rounded shadow-sm bg-white"></div>

        </div>
    </div>

    <div id="gridmod-wrapper" class="d-flex col-md-5 align-items-start p-0" >

        <div id="panel-wrapper" class="d-flex flex-grow-1 rounded-0 " >
            <!-- Model here -->
            <div class="alert alert-light w-100 border" role="alert">
                <div class="d-flex flex-column">
                    <div>
                        <div class="font-weight-bold text-capitalize">Lets play!</div>
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div>
                        <span class="d-block">Touch a device to control it!</span>
                        <small>Or a free square to join another</small>
                    </div>
                </div>
            </div>
        </div>

    </div>


</div>



<script>

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
                app.moduleLoad('homeMaker');
            }

            moduleHeaders = JSON.parse(sessionStorage.getItem('app.module.headers'));
            
            if(moduleHeaders.hasOwnProperty('data') == false){
                app.moduleLoad('homeMaker');
            };

            if(moduleHeaders.data.hasOwnProperty('group') == false){
                app.moduleLoad('homeMaker');
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
                        if(config.model.hasOwnProperty(type)){
                            color = config.model[type];
                        }else{
                            color = config.model.undefined;
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

                            if(config.model.hasOwnProperty(nocoords[index].type)){
                                color = config.model[nocoords[index].type];
                            }else{
                                color = 'gray';
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
                if(config.model.hasOwnProperty(modelType)){

                    $.get({
                        url: './libs/models/' + modelType + '.html', 
                        cache: config.models.cached
                    }).then(function( response ){
                        $('#panel-wrapper').html(response);

                        // PASAR DATOS NECESARIOS EN EL PANEL(SI HACE FALTA)
                        $('#modelName').empty().append(modelName);
                        $('#modelType').empty().append(modelType);
                        $('#modelDescription').empty();
                        if ( modelDescription !== null && modelDescription.toLowerCase() !== 'null' ){
                            $('#modelDescription').append(modelDescription);
                        }
                    });
                    
                // We have UNdefined model
                }else{

                    $.get({
                        url: './libs/models/undefined.html', 
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


</script>