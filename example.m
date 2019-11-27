<!-- Example of ActionBar -->
<div id="actionbar" class="d-flex align-items-center mb-4 mt-2">
    <div id="actionbar-toggler" class="d-flex align-items-center pr-2 ">
        <button type="button" class="btn btn-primary bg-yellow text-black">
            <i class="material-icons md-dark md-24 align-middle d-inline">tune</i>
        </button>
    </div>
    <div id="actionbar-wrapper" class="d-none overflow-auto">
        <div class="d-flex align-items-stretch ">
            <div class="d-flex align-items-center pr-2">
                <i class="material-icons md-dark md-24 align-middle d-inline">arrow_left</i>
            </div>
            <div id="actionbar-menu" class="d-flex mx-auto overflow-auto">
                <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
                    <i class="material-icons md-dark md-24 align-middle">add</i>
                    <span class="align-middle">Room</span>
                </a>
                <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
                    <i class="material-icons md-dark md-24 align-middle">delete</i>
                    <span class="align-middle">Room</span>
                </a>
            </div>
            <div class="d-flex align-items-center pl-2">
                <i class="material-icons md-dark md-24 align-middle d-inline">arrow_right</i>
            </div>
        </div>
    </div>
</div>




<!-- Module HTML goes here -->
<span>This is a </span>
<code>Module Example</code>








<!-- Execute module actions-->
<script>
$(function () {

    console.log('Executing module actions');


    // Toggling the action bar
    $('body').on('click', '#actionbar-toggler', function(){
        $('#actionbar-wrapper').toggleClass('d-none');
    });

});
</script>