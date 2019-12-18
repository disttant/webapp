<!-- Spinner -->
<div id="app-spinner-wrapper">
    <div class="d-flex align-items-center justify-content-center min-vh-100" >
        <div class="d-flex flex-column flex-grow-1 mb-3">
            <div class="d-flex justify-content-center p-2">
                <div class="spinner-grow text-black" style="width: 5rem; height: 5rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Sidebar menu -->
<div id="sidebar-wrapper" class="d-none">

    <div id="sidebar-bg" style="z-index: 1040 !important;"></div>

    <div id="sidebar-menu" class="shadow overflow-auto" style="z-index: 1050 !important;">

        <div id="sidebar-content" class="d-flex flex-column bg-black text-light min-vh-100">

            <!-- Sidebar header -->
            <div id="sidebar-header" class="p-2 bg-yellow">
                <div class="d-flex flex-column">
                    <!-- The Infobar -->
                    <div class="p-2 text-dark">
                        <i id="infobar-placeholder" class="material-icons md-24 md-dark text-black align-middle pr-2">label</i>
                        
                        <i id="infobar-info" class="material-icons md-24 md-dark align-middle pr-2 d-none">info</i>
                        <i id="infobar-sync" class="material-icons md-24 md-dark align-middle pr-2 d-none">sync</i>
                        <i id="infobar-sync-error" class="material-icons md-24 md-dark align-middle pr-2 d-none">sync_disabled</i>
                        <i id="infobar-conn-error" class="material-icons md-24 md-dark align-middle pr-2 d-none">wifi_off</i>
                    </div>
                </div>
            </div>

            <div class="p-3">
                <i class="material-icons md-24 md-light align-middle pr-2">power_settings_new</i>
                <a id="logout" href="#" class="text-light align-middle">Logout</a>
            </div>

        </div>

    </div>
</div>


        
<!-- Modal -->
<div id="modal-wrapper" class="modal fade"  tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content rounded-0 border-0">
            <div class="modal-header border-0">
                <h5 class="modal-title" id="modal-title">...</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="modal-body" class="modal-body">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div id="modal-footer" class="modal-footer border-0">
                <button type="button" class="btn btn-light bg-black text-light" x-modal-key="default">
                    <i class="material-icons md-24 md-light align-middle">done</i>
                </button>
            </div>
        </div>
    </div>
</div>



<!-- Thw wonderfull app -->
<div id="app-wrapper" class="d-none min-vh-100">

    <!-- Top bar -->
    <nav id="app-navbar" class="navbar sticky-top navbar-dark bg-black p-0">

        <div class="d-flex align-items-center justify-content-between w-100 py-2 px-3">
            <!-- Brand -->
            <div class="d-inline-block text-light">
                <h4 class="font-weight-bold d-inline-block">ALKE</h4>
                <h4 class="font-weight-light d-inline-block text-yellow">Adaptative</h4>
            </div>
    
            <!-- Menu button -->
            <div class="d-inline-block">
                <button id="sidebarOpener" class="btn">
                    <i class="material-icons md-24 md-light align-middle">menu</i>
                </button>
            </div>
        </div>
        
        <!-- Preloader infinite bar -->
        <div id="top-preloader" class="linear-activity" style="opacity: 0;">
            <div class="indeterminate"></div>
        </div>
        
    </nav>
    


    <!-- Module Spinner -->
    <div id="module-spinner-wrapper" class="d-none">
        <div class="d-flex align-items-center justify-content-center py-5" >
            <div class="d-flex flex-column flex-grow-1 mb-3">
                <div class="d-flex justify-content-center p-2">
                    <div class="spinner-grow text-black" style="width: 5rem; height: 5rem;" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <!-- Content -->
    <div id="module-wrapper" class="p-3"></div>
    


    <!-- Toast bar-->
    <div id="toastWrapper" class="fixed-bottom w-100">
        <div id="toast" class="alert m-2 bg-black text-light toast-width" role="alert" style="display: none;"></div>
    </div>



</div>