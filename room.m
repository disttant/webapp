<div id="homemap-content" class="row mx-auto container p-0">

    
    <div id="grid-wrapper" class="d-flex col-md-7 align-items-start p-0">
        <div class="d-flex flex-column flex-grow-1">

            <!-- Location bar -->
            <div id="homemap-header" class="d-flex flex-row align-items-center mx-auto text-muted h5 font-weight-light alert alert-light border rounded" role="alert">
                <div class="px-2">
                    <a href="#" onclick="app.moduleLoad('home')">
                        <i class="material-icons md-dark md-24 align-middle">ballot</i>
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



<!-- Module logic -->
<script src="libs/js/modules/room.js"></script>