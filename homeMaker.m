<!-- Module HTML goes here -->



<!-- Example of ActionBar -->
<div id="actionbar" class="d-flex align-items-center mb-4 mt-2">
    <div id="actionbar-toggler" class="d-flex align-items-center pr-2 ">
        <button type="button" class="btn btn-primary bg-yellow text-black">
            <i class="material-icons md-dark md-24 align-middle d-inline">tune</i>
        </button>
    </div>
    <div id="actionbar-wrapper" class="d-none overflow-auto bg-light">
        <div class="d-flex align-items-stretch ">
            <div class="d-flex align-items-center pr-2">
                <i class="material-icons md-dark md-18 align-middle d-inline">arrow_left</i>
            </div>
            <div id="actionbar-menu" class="d-flex mx-auto overflow-auto">
                <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
                    <i class="material-icons md-dark md-18 align-middle">add</i>
                    <span class="align-middle">Room</span>
                </a>
                <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
                    <i class="material-icons md-dark md-18 align-middle">delete</i>
                    <span class="align-middle">Room</span>
                </a>
            </div>
            <div class="d-flex align-items-center pl-2">
                <i class="material-icons md-dark md-18 align-middle d-inline">arrow_right</i>
            </div>
        </div>
    </div>
</div>


<!-- Example of group loaded with some channels -->
<div class="accordion" id="groups-accordion">

    <!-- New group -->
    <!--
    <div class="card">
        <div class="card-header" id="headingOne">

            <div class="d-flex justify-content-between align-items-center">
                <div class="mr-auto p-2">
                    Example Title
                </div>
                <div>
                    <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <i class="material-icons md-dark md-24 align-middle">arrow_drop_down</i>
                    </a>
                </div>
                <div>
                    <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
                        <i class="material-icons md-dark md-24 align-middle">blur_on</i>
                    </a>
                </div>
            </div>
        </div>
        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#groups-accordion">
            <div class="card-body">
                Example Content
            </div>
        </div>
    </div>
    -->


</div>



<!-- Execute module actions -->
<script>

    $(function () {

        // Show module spinner when loading the groups
        app.moduleSpinner('show');

        // Show groups and channels inside
        group.getFullGroups(function( response ){

            $('#groups-accordion').empty();

            let newGroup = null;
            let newId = null;

            // Check if there are not groups
            if( response.groups.length == 0 )
            {
                app.moduleSpinner('hide');
                return;
            }

            // List all available groups
            response.groups.forEach( function( item ) {

                // Generate a new unique Id
                newId = app.genRandomId();

                // Build new element into the accordion
                newGroup = 
                '<!-- New group -->' +
                '<div class="card">' +
                    '<div class="card-header" id="heading'+ newId +'">' +

                        '<div class="d-flex justify-content-between align-items-center">' +
                            '<div class="mr-auto p-2 text-capitalize">'+
                                item.name +
                            '</div>'+
                            '<div>'+
                                '<a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true" data-toggle="collapse" data-target="#collapse'+newId+'" aria-expanded="true" aria-controls="collapse'+newId+'">'+
                                    '<i class="material-icons md-dark md-24 align-middle">arrow_drop_down</i>'+
                                '</a>'+
                            '</div>'+
                            '<div>'+
                                '<a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">'+
                                    '<i class="material-icons md-dark md-24 align-middle">blur_on</i>'+
                                '</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div id="collapse'+newId+'" class="collapse" aria-labelledby="heading'+ newId +'" data-parent="#groups-accordion">'+
                        '<div class="card-body">'+
                            'No channels added yet' +
                        '</div>'+
                    '</div>'+
                '</div>';

                // Append the element to the accordion flow
                $('#groups-accordion').append(newGroup);

                // Check if there are channels
                if( item.channels.length !== 0 )
                {
                    // Put the channels into the group
                    $('#collapse' + newId + ' > .card-body').html('');
                    $('#collapse' + newId + ' > .card-body').html('<ul class="list-group list-group-flush"></ul>');
                }

                // Put found channels into each group
                item.channels.forEach( function( channel ) {

                    $('#collapse' + newId + ' > .card-body > .list-group').append( 
                        '<li class="list-group-item p-0">' +
                            '<div class="d-flex">' +
                                '<div class="py-3 w-100">'+
                                    '<div class="d-flex flex-column">' +
                                        '<div class="py-1">' + channel + '</div>' +
                                        '<div class="py-1">' +
                                            '<small class="text-muted">' +
                                                'aksjdhsadhasd' +
                                            '</small>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'+
                                '<div class="d-flex align-items-center flex-shrink-1">'+
                                    '<a href="#" x-btn-function="free-channel" role="button" x-hiden-value="' + channel + '" class="btn btn-light" >'+
                                        '<i class="material-icons align-middle">close</i>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</li>'
                    );
                });

                // Button for adding channels
                $('#collapse' + newId + ' > .card-body').append(
                    '<div class="d-flex mt-3">'+
                        '<a href="#" role="button" x-btn-function="relate-channel" x-hiden-value="'+ item.name +'" class="btn btn-light">'+
                            '<i class="material-icons align-middle">add</i>'+
                        '</a>' +
                    '</div>'
                );

            });

            app.moduleSpinner('hide');
        });
        
        // Detecting actionbar toggle
        $('body').on('click', '#actionbar-toggler', function(){
            $('#actionbar-wrapper').toggleClass('d-none');
        });

        // Detecting channel removal
        $('body').on('click', 'a[x-btn-function="free-channel"]', function(){

            channel.ejectChannel( $(this).attr('x-hiden-value'), function( response ) {

                if( response === true )
                {
                    app.moduleLoad('homeMaker')
                }else{
                    app.sendToast('Device was not removed');
                }
            });
        });

        // Detecting agregation tries
        $('body').on('click', 'a[x-btn-function="relate-channel"]', function(){

            let groupName = $(this).attr('x-hiden-value');

            //app.moduleSpinner('show');
            channel.getFreeChannels(function( result ){

                //app.moduleSpinner('hide');
                let modalBody = null;

                // Check if there is results
                if( result === false ){
                    app.sendToast('Oops! could not get available devices');
                    return;
                }

                if( result.length === 0 ){
                    app.sendToast('There are not free devices');
                    return;
                }

                // Building the selectable
                modalBody = '<select id="channel-name" class="custom-select custom-select-lg rounded-0">';

                result.forEach( function( item ){
                    modalBody += '<option value="'+item.channel+'">'+item.channel +'</option>';
                });     

                modalBody += '</select>';
                modalBody += '<small class="d-block py-2 text-muted">Only free devices are listed</small>';

                // Building the modal and relating the channel
                app.sendModal(
                    'Add to ' + groupName, 

                    modalBody,

                    function(){

                        // Getting the channel from modal
                        let channelName = $('#modal-body > #channel-name').val();

                        // Trying to ask for the request
                        let addingRequest = channel.addChannelToGroup(channelName, groupName, function( response ){
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

    });

</script>