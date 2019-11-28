<!-- Module HTML goes here -->
<div class="d-flex justify-content-start mb-4 my-2">
    <a href="#" class="btn btn-light bg-yellow" role="button" aria-pressed="true" x-btn-function="add-group">
        <i class="material-icons md-dark md-18 align-middle">add</i>
        <span class="align-middle">Group</span>
    </a>
</div>








<!-- Groups wrapper loaded with devices inside -->
<div class="accordion" id="groups-accordion">
    <!-- New group -->
</div>



<!-- Execute module actions -->
<script>

    $(function () {

        app.spinnerType = 'module';

        // Show groups and devices inside
        group.getFullGroups(function( response ){

            $('#groups-accordion').empty();

            let newGroup = null;
            let newId = null;

            // Check if there are not groups
            if( response.groups.length == 0 )
            {
                return;
            }

            // List all available groups
            response.groups.forEach( function( item ) {

                // Generate a new unique Id
                newId = app.genRandomId();

                // Build new element into the accordion
                newGroup = 
                '<!-- New group -->' +
                '<div class="card border">' +
                    '<div class="card-header " id="heading'+ newId +'">' +
                        '<div class="d-flex justify-content-between align-items-center">' +
                            '<div class="mr-auto p-2 text-capitalize">'+
                                item.name +
                            '</div>'+
                            '<div>'+
                                '<a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true" x-btn-function="remove-group" x-hiden-value="'+item.name.toLowerCase()+'" >'+
                                    '<i class="material-icons md-dark md-24 align-middle">close</i>'+
                                '</a>'+
                            '</div>'+
                            '<div>'+
                                '<a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true" data-toggle="collapse" data-target="#collapse'+newId+'" aria-expanded="true" aria-controls="collapse'+newId+'">'+
                                    '<i class="material-icons md-dark md-24 align-middle">arrow_drop_down</i>'+
                                '</a>'+
                            '</div>'+
                            '<div>'+
                                '<a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true" x-btn-function="enter-group" x-hiden-value="'+item.name.toLowerCase()+'">'+
                                    '<i class="material-icons md-dark md-24 align-middle">map</i>'+
                                '</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div id="collapse'+newId+'" class="collapse" aria-labelledby="heading'+ newId +'" data-parent="#groups-accordion">'+
                        '<div class="card-body">'+
                            'No devices added yet' +
                        '</div>'+
                    '</div>'+
                '</div>';

                // Append the element to the accordion flow
                $('#groups-accordion').append(newGroup);

                // Check if there are devices
                if( item.devices.length !== 0 )
                {
                    // Put the devices into the group
                    $('#collapse' + newId + ' > .card-body').html('');
                    $('#collapse' + newId + ' > .card-body').html('<ul class="list-group list-group-flush"></ul>');
                }

                // Put found devices into each group
                item.devices.forEach( function( device ) {

                    if ( device.description == null ) { device.description = 'No description' }

                    $('#collapse' + newId + ' > .card-body > .list-group').append( 
                        '<li class="list-group-item p-0">' +
                            '<div class="d-flex">' +
                                '<div class="py-3 w-100">'+
                                    '<div class="d-flex flex-column">' +
                                        '<div class="py-1">' + device.name + '</div>' +
                                        '<div class="py-1">' +
                                            '<small class="text-muted">' +
                                                device.description +
                                            '</small>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'+
                                '<div class="d-flex align-items-center flex-shrink-1">'+
                                    '<a href="#" x-btn-function="free-device" role="button" x-hiden-value="' + device.name.toLowerCase() + '" class="btn btn-light" >'+
                                        '<i class="material-icons align-middle">close</i>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</li>'
                    );
                });

                // Button for adding devices
                $('#collapse' + newId + ' > .card-body').append(
                    '<div class="d-flex mt-3">'+
                        '<a href="#" role="button" x-btn-function="relate-device" x-hiden-value="'+ item.name.toLowerCase() +'" class="btn btn-light">'+
                            '<i class="material-icons align-middle">add</i>'+
                        '</a>' +
                    '</div>'
                );

            });
        });



        // Detecting device removal
        $('body').on('click', 'a[x-btn-function="free-device"]', function(){

            // Check if user really wanted to click
            if( confirm('Are you sure?') === false ) 
                return;

            // Changing the spinner mode to infinite bar
            app.spinnerType = 'bar';

            device.ejectDevice( $(this).attr('x-hiden-value'), function( response ) {

                if( response === true )
                {
                    app.sendToast('Device is now free');
                    app.moduleLoad('homeMaker');
                }else{
                    app.sendToast('Oops! Device is still in a room');
                }
            });
        });



        // Detecting agregation try
        $('body').on('click', 'a[x-btn-function="relate-device"]', function(){

            let groupName = $(this).attr('x-hiden-value');

            // Changing the spinner mode to infinite bar
            app.spinnerType = 'bar';

            //app.moduleSpinner('show');
            device.getFreeDevices(function( result ){

                //app.moduleSpinner('hide');
                let modalBody = null;

                // Check if there is results
                if( result === false ){
                    app.sendToast('Oops! Could not get available devices');
                    return;
                }

                if( result.length === 0 ){
                    app.sendToast('There are not free devices');
                    return;
                }

                // Building the selectable
                modalBody = '<select id="device-name" class="custom-select custom-select-lg rounded-0">';

                result.forEach( function( item ){
                    modalBody += '<option value="'+item.name+'">'+item.name +'</option>';
                });     

                modalBody += '</select>';
                modalBody += '<small class="d-block py-2 text-muted">Only free devices are listed</small>';

                // Building the modal and relating the device
                app.sendModal(
                    'Add to ' + groupName, 

                    modalBody,

                    function(){

                        // Getting the device from modal
                        let deviceName = $('#modal-body > #device-name').val();

                        // Trying to ask for the request
                        let addingRequest = device.addDeviceToGroup(deviceName, groupName, function( response ){
                            if ( response === false ){
                                app.sendToast('Device could not be related to a room');
                                return;
                            }

                            app.moduleLoad('homeMaker');
                            app.sendToast('Device was related successfully');
                        });
                    }
                );
            });
        });



        // Detecting group removal
        $('body').on('click', 'a[x-btn-function="remove-group"]', function(){

            let groupName = $(this).attr('x-hiden-value');

            // Check if user really wanted to click
            if( confirm('Deleting '+ groupName +'. Are you sure?') === false ) 
                return;

            // Changing the spinner mode to infinite bar
            app.spinnerType = 'bar';

            group.deleteGroup(groupName, function( result ){
                if(result === false ){
                    app.sendToast('Oops! Could delete that group');
                    return;
                }

                app.moduleLoad('homeMaker');
                app.sendToast('Group was deleted successfully');

            });
        });



        // Detecting group agregation
        $('body').on('click', 'a[x-btn-function="add-group"]', function(){

            // Changing the spinner mode to infinite bar
            app.spinnerType = 'bar';

            // Building the selectable
            modalBody  = '<input type="text" class="form-control form-control-lg" id="group-name" placeholder="Write a cool name">';
            modalBody += '<small class="d-block py-2 text-muted">Just lower case characters allowed</small>';

            // Building the modal and relating the device
            app.sendModal(
                'Add a group', 

                modalBody,

                function(){

                    // Getting the device from modal
                    let newGroupName = $('#modal-body > #group-name').val();

                    // Check if the field is empty
                    if( newGroupName === '' ){
                        app.sendToast('Oops! Group name not allowed');
                        return;
                    }

                    // Changing the spinner mode to infinite bar
                    app.spinnerType = 'bar';

                    // Trying to add asked group
                    group.createGroup(newGroupName, function( response ){

                        if ( response === false ){
                            app.sendToast('Oops! New group could not be added. Try again');
                            return;
                        }
                        app.moduleLoad('homeMaker');
                        app.sendToast('Group was added successfully');
                    });
                }
            );
        });



        // Detecting enter-to-map click
        $('body').on('click', 'a[x-btn-function="enter-group"]', function(){

            let groupName = $(this).attr('x-hiden-value');

            app.moduleLoad('homeMap', {'group' : groupName});
        });



    });

</script>