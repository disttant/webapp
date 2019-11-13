<!-- Module HTML goes here -->



<!-- Example of ActionBar -->
<div id="actionbar" class="d-flex align-items-stretch mb-4 mt-2">
    <div class="d-flex align-items-center pr-2">
        <i class="material-icons md-dark md-24 align-middle d-inline">arrow_left</i>
    </div>
    <div id="actionbar-menu" class="d-flex mx-auto overflow-auto">
        <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">add</i>
            <!--<span class="align-middle">Room</span>-->
        </a>
        <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">delete</i>
            <!--<span class="align-middle">Room</span>-->
        </a>
    </div>
    <div class="d-flex align-items-center pl-2">
        <i class="material-icons md-dark md-24 align-middle d-inline">arrow_right</i>
    </div>
</div>



<!-- Example of group loaded with some channels -->
<!--<div class="d-flex flex-column bd-highlight bg-white mb-3 border">
    <div class="py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
        <span class="text-capitalize align-middle font-weight-bold h5">Cocina</span>
        <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">blur_on</i>
            <span >Enter</span>
        </a>
    </div>
    
    <div class="py-3 px-4 d-flex justify-content-between align-items-center">
        <span>Dispositivo</span>
        <a href="#" class="btn btn-light ml-3 " role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">tune</i>
            <span>Tune</span>
        </a>
    </div>
    <div class="py-3 px-4 d-flex justify-content-between align-items-center">
        <span>Dispositivo 2</span>
        <a href="#" class="btn btn-light ml-3" role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">tune</i>
            <span>Tune</span>
        </a>
    </div>
    <div class="py-3 px-4 d-flex justify-content-between align-items-center">
        <span>Dispositivo 2</span>
        <a href="#" class="btn btn-light ml-3" role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">tune</i>
            <span>Tune</span>
        </a>
    </div>
    <div class="py-3 px-4 d-flex justify-content-between align-items-center">
        <span>Dispositivo 2</span>
        <a href="#" class="btn btn-light ml-3" role="button" aria-pressed="true">
            <i class="material-icons md-dark md-24 align-middle">tune</i>
            <span>Tune</span>
        </a>
    </div>
    
</div>-->





<div class="accordion" id="groups-accordion">

    <!-- New group -->
    <div class="card">
        <div class="card-header" id="headingOne">

            <div class="d-flex justify-content-between align-items-center">
                <div class="mr-auto p-2">
                    Cocina
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
                contenido
            </div>
        </div>
    </div>

    <!-- New group -->
    <div class="card">
        <div class="card-header" id="headingTwo">

            <div class="d-flex justify-content-between align-items-center">
                <div class="mr-auto p-2">
                    Cocina
                </div>
                <div>
                    <a href="#" class="btn ml-3 btn-light" role="button" aria-pressed="true" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
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
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#groups-accordion">
            <div class="card-body">
                contenido
            </div>
        </div>
    </div>

</div>




<!-- Execute module actions-->
<script>
$(function () {



});
</script>