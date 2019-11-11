<!-- Spinner -->
<div id="spinner-wrapper">
    <div class="d-flex align-items-center justify-content-center min-vh-100" >
        <div class="d-flex flex-column flex-grow-1 mb-3">
            <div class="d-flex justify-content-center p-2">
                <div class="spinner-grow" style="width: 5rem; height: 5rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Sidebar menu -->
<div id="sidebar-wrapper" class="d-none" style="">

    <div id="sidebar-bg"></div>

    <div id="sidebar-menu" class="shadow overflow-auto" style="">

        <div class="d-flex flex-column bg-dark text-light min-vh-100">
            <div class="p-2 border">
                Header de la barra

                <!-- Logout button -->
                <button id="logout" class="btn">
                    <i class="material-icons md-24 md-dark align-middle">exit_to_app</i>
                </button>
            </div>
            <div class="p-2">
                <a href="#" onclick="app.moduleLoad('test')" >hola</a>
            </div>
            <div class="p-2">
                <a href="#" onclick="app.moduleLoad('test')" >hola</a>
            </div>
            <div class="p-2">Flex item 3</div>
            <div class="p-2">Flex item 3</div>
        </div>

    </div>
</div>




<div id="module-wrapper" class="d-none">

    <!-- Top bar -->
    <nav class="navbar navbar-dark bg-dark shadow">
        <div class="navbar-brand text-light">
            <h4 class="font-weight-bold d-inline-block">ALKE</h4>
            <h4 class="font-weight-light d-inline-block">Adaptative</h4>
        </div>
        <!-- Menu button -->
        <button id="sidebarOpener" class="btn">
            <i class="material-icons md-24 md-light align-middle">menu</i>
        </button>
    </nav>
    
    

    <!-- Toasts container-->
    <div id="toastWrapper" class="fixed-middle w-100"></div>



    <!-- Content -->
    <div id="content" class="p-3"></div>



    <!-- Bottom bar -->
    <div id="footer" class="d-flex fixed-bottom p-2 justify-content-around text-light bg-dark" style="z-index: 2 !important;">

        <button id="homeMaker" class="btn flex-fill" name="botMenu">
            <i class="material-icons md-36 md-light align-middle" style="opacity: 0.3;">ballot</i>
        </button>

        <button id="home" class="btn flex-fill" name="botMenu">
            <i class="material-icons md-36 md-light align-middle">home</i>
        </button>

        <button id="homeMap" class="btn flex-fill" name="botMenu">
            <i class="material-icons md-36 md-light align-middle" style="opacity: 0.3;">explore</i>
        </button>

    </div>

</div>