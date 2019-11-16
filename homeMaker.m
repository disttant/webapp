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
                    '<div class="card-body">contenido'+
                    '</div>'+
                '</div>'+
            '</div>';

            // Append the element to the accordion flow
            $('#groups-accordion').append(newGroup);

        });
        app.moduleSpinner('hide');
    });
    

    // Toggle edition mode
    $('#actionbar-toggler').on('click', function(){
        $('#actionbar-wrapper').toggleClass('d-none');
    });

});

</script>