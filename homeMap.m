<div class="d-flex flex-column justify-content-center mx-auto mt-2 mb-2 border-black" id="grid" style="border-style:solid; border-width:thick;"></div>

<div id="panel-wrapper" class="d-flex border"></div>

<script>

    $(function () {

        let groupOpenned = JSON.parse(sessionStorage.getItem('app.module.headers')).data;

        if(groupOpenned === null){

            app.moduleLoad('homeMaker');

        }

        else
            groupOpenned = groupOpenned.group;

        window.addEventListener('storage', function(){

            if(groupOpenned === null){

                app.moduleLoad('homeMaker');

            }   

        });

        // FUNCTION TO ADAPT THE GRID TO THE WINDOW SIZE
        // 
        function adapt(max){

            let cellwidth = $('[x-coord-y]').outerWidth();
            let width = $(window).outerWidth(true);
            let height = $(window).outerHeight(true);
            let reference = 0;

            if(width < height)
                reference = width - 0.1 * width;

            if(width > height)
                reference = height - 0.1 * height;

            if(reference > max)
                reference = max;

            $('#grid').css('height' , reference);
            $('#grid').css('width' , reference);
            $('[x-coord-y]').css('height', cellwidth);

            return cellwidth;

        }

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

        }

        else{

            door[0] = y_length / 2;
            door[1] = door[0] + 1;
            door[2] = 0;

        }

        // CONSTRUCTION OF THE GRID
        for(let i = 1 ; i < x_length + 1 ; i++){

            let row = '<div x-coord-x="'+ i +'" class="d-flex"></div>';
            grid.append(row);

            for(let j = 1 ; j < y_length + 1 ; j++){

                let col = '';

                if((i === x_length) && ((j === door[0]) || (j === door[1]) || (j === door[2])))
                    col = '<div class="flex-fill border border-black bg-black"></div>';

                else
                    col = '<div x-coord-y="'+ j +'" class="flex-fill border"></div>';

                $('[x-coord-x="'+ i +'"]').append(col);

            }

        }

        app.spinnerType = 'module';
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

                        if(config.model.hasOwnProperty(type)){

                            color = config.model[type];

                        }
                        
                        else{

                            color = 'gray';

                        }

                        $('[x-coord-x="'+ coords[0] +'"] > [x-coord-y="'+ coords[1] +'"]').css('background-color', color);
                        $('[x-coord-x="'+ coords[0] +'"] > [x-coord-y="'+ coords[1] +'"]').append('<div id="'+ result.group[0].devices[i].name +'" x-model="'+ result.group[0].devices[i].type +'"></div>');

                    }

                }

                app.spinner('hide');
                adapt(700);     // BUG FIX  --  TWICE AJUST CORRECTLY THE GRID ON FIRST LOAD
                adapt(700);     // BUG FIX

            }

        });

        $( window ).resize(function() {
            adapt(700);
        });

        $('[x-coord-y]').on('click', function(){

            if($(this).children().length === 0){

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

                            }

                            else{

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

                }

                else{

                    // NO HAY CANALES LIBRES EN EL GRUPO
                    app.sendToast('There are no more unrelated devices in this group');

                }

            }

            else{

                // ABRIR PANEL DEL CANAL
                let deviceName = $(this).children()[0].id;
                let model = $(this).children().attr('x-model');
                console.log(deviceName, model);

                $('#panel-wrapper').empty();
                $('#panel-wrapper').load('./libs/models/' + model + '.html', function(){

                    // PASAR DATOS NECESARIOS EN EL PANEL(SI HACE FALTA)

                });

            }

        });

    });

</script>