<!-- Spinner -->
<div class="text-center" id="spinner-wrapper">
    <div class="spinner-border my-3" id="spinner">
        <span class="sr-only">Cargando...</span>
    </div>
</div>

<div id="module-wrapper" class="d-none">
    <!-- Franja superior -->
    <div class="d-flex text-white" style="height: 3rem; background-color: #8F8F8F;">
        <p class="mx-2 my-1" style="font-size: 1.5rem;">
            <img src="libs/alke.png" style="height: 2rem;">
            Adaptative
        </p>
        <!-- Botón de Logout -->
        <button id="logout" class="btn" style="width: 3rem; height: 2.6rem; background-color: #1C1C1C; position: absolute; right: 0.2rem; top: 0.2rem;">
            <i class="material-icons md-24 md-light align-bottom">exit_to_app</i>
        </button>
    </div>


    <!-- Contenedor para Toasts -->
    <div id="toastWrapper" class="fixed-middle w-100"></div>


    <!-- Contenido -->
    <div id="content"></div>


    <!-- Franja inferior -->
    <div id="footer" class="fixed-bottom d-flex justify-content-around" style="height: 3rem; background-color: #8F8F8F;">

        <button id="leftButton" class="btn flex-fill" onclick='openmenu("left")'>
            <i class="material-icons md-36 md-dark align-middle" id="leftIcon">ballot</i>
        </button>
        <button id="centerButton" class="btn flex-fill" onclick='openmenu("center")'>
            <i class="material-icons md-36 md-dark align-middle" id="centerIcon">home</i>
        </button>
        <button id="rightButton" class="btn flex-fill" onclick='openmenu("right")'>
            <i class="material-icons md-36 md-dark align-middle" id="rightIcon">explore</i>
        </button>

    </div>
</div>